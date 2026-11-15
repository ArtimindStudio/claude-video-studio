// Low-poly & pixel postprocessing chain: Render/SSAA -> GTAO -> Bloom -> Bokeh DOF -> Grade/Vignette -> OutputPass
import * as THREE from 'three';
import { EffectComposer } from './three/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './three/jsm/postprocessing/RenderPass.js';
import { SSAARenderPass } from './three/jsm/postprocessing/SSAARenderPass.js';
import { GTAOPass } from './three/jsm/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from './three/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from './three/jsm/postprocessing/BokehPass.js';
import { ShaderPass } from './three/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from './three/jsm/postprocessing/OutputPass.js';

const vigShader = {
  uniforms: {
    tDiffuse: { value: null },
    amt: { value: 0.32 },
    warm: { value: 0.25 },
    contrast: { value: 0.18 },
    sat: { value: 1.1 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float amt, warm, contrast, sat;
    void main() {
      vec4 tex = texture2D(tDiffuse, vUv);
      vec3 c = tex.rgb;
      c = mix(c, c * vec3(1.0 + 0.08 * warm, 1.0 + 0.02 * warm, 1.0 - 0.07 * warm), clamp(warm, 0.0, 1.0));
      c = mix(c, smoothstep(0.0, 1.0, c), clamp(contrast, 0.0, 1.0));
      float luma = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(luma), c, sat);
      vec2 d = (vUv - 0.5) * vec2(1.05, 1.25);
      float v = clamp(1.0 - dot(d, d) * amt * 1.35, 0.0, 1.0);
      gl_FragColor = vec4(clamp(c * v, 0.0, 1.0), tex.a);
    }
  `,
};

export function makePost(renderer, scene, cam, W, H, o = {}) {
  const rt = new THREE.WebGLRenderTarget(W, H, {
    type: THREE.HalfFloatType,
    samples: o.samples ?? 0,
  });
  const composer = new EffectComposer(renderer, rt);
  composer.setSize(W, H);

  if (o.ssaa && o.ssaa > 1) {
    const ssaa = new SSAARenderPass(scene, cam);
    ssaa.sampleLevel = o.ssaa;
    composer.addPass(ssaa);
  } else {
    composer.addPass(new RenderPass(scene, cam));
  }

  let gtao = null;
  if (o.ao) {
    gtao = new GTAOPass(scene, cam, W, H);
    gtao.output = GTAOPass.OUTPUT.Default;
    gtao.blendIntensity = o.aoAmt ?? 0.6;
    gtao.updateGtaoMaterial({
      radius: o.aoRadius ?? 0.5,
      scale: o.aoScale ?? 1.6,
      thickness: 1.0,
      distanceExponent: 1.0,
      samples: 16,
    });
    composer.addPass(gtao);
  }

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(W, H),
    o.bloom ?? 0.55,
    o.bloomRadius ?? 0.45,
    o.bloomThreshold ?? 0.92
  );
  composer.addPass(bloom);

  const bokeh = new BokehPass(scene, cam, {
    focus: o.focus ?? 200.0,
    aperture: 0.0,
    maxblur: 0.0,
  });
  bokeh.enabled = false;
  composer.addPass(bokeh);

  const dof = {
    pass: bokeh,
    get focus() { return bokeh.uniforms.focus.value; },
    set focus(v) { bokeh.uniforms.focus.value = v; },
    get maxCoc() { return bokeh.uniforms.maxblur.value; },
    set maxCoc(v) {
      bokeh.uniforms.maxblur.value = v;
      bokeh.uniforms.aperture.value = v > 0 ? v * 0.002 : 0;
      bokeh.enabled = v > 0;
    },
  };

  const vig = new ShaderPass(vigShader);
  composer.addPass(vig);

  const output = new OutputPass();
  composer.addPass(output);

  return { composer, gtao, bloom, dof, vig, output };
}
