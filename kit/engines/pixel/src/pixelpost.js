// Pixel post: the low-poly post chain (GTAO, bloom, grade, tone map) + a final 8-bit pass:
// sample at block centres (nearest-neighbour upscale) -> optional palette snap -> 4x4 Bayer ordered dither -> per-channel quantise.
// makePixelPost(renderer, scene, cam, W, H, o, px) where px = { size, levels, dither, palette:[hex...], sharpen }
import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { makePost } from './vendor/post.js';

const MAXP = 32;
const pixelShader = {
  uniforms: {
    tDiffuse: { value: null }, res: { value: new THREE.Vector2(1080, 1920) }, size: { value: 4 }, levels: { value: 6 },
    dither: { value: 1 }, pal: { value: Array.from({ length: MAXP }, () => new THREE.Vector3()) }, nPal: { value: 0 }, palMix: { value: 1 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `
    varying vec2 vUv; uniform sampler2D tDiffuse; uniform vec2 res; uniform float size, levels, dither, palMix; uniform vec3 pal[${MAXP}]; uniform int nPal;
    float bayer(vec2 p){ int x = int(mod(p.x, 4.)), y = int(mod(p.y, 4.)); int i = x + y * 4;
      float m[16]; m[0]=0.;m[1]=8.;m[2]=2.;m[3]=10.;m[4]=12.;m[5]=4.;m[6]=14.;m[7]=6.;m[8]=3.;m[9]=11.;m[10]=1.;m[11]=9.;m[12]=15.;m[13]=7.;m[14]=13.;m[15]=5.;
      for (int k = 0; k < 16; k++) if (k == i) return (m[k] + .5) / 16.; return .5; }
    void main(){
      vec2 blk = floor(vUv * res / size);                       // block index (the "big pixel")
      vec2 uv = (blk + .5) * size / res;
      vec3 c = texture2D(tDiffuse, uv).rgb;
      float b = bayer(blk) - .5;
      if (nPal > 0) {                                           // palette snap: nearest of two closest, dithered between them
        vec3 c1 = pal[0], c2 = pal[0]; float d1 = 1e9, d2 = 1e9;
        for (int k = 0; k < ${MAXP}; k++) { if (k >= nPal) break; vec3 p = pal[k]; vec3 dd = (c - p) * vec3(.9, 1.2, .7); float d = dot(dd, dd);
          if (d < d1) { d2 = d1; c2 = c1; d1 = d; c1 = p; } else if (d < d2) { d2 = d; c2 = p; } }
        float r = sqrt(d1) / (sqrt(d1) + sqrt(d2) + 1e-5);       // 0 = exactly c1, .5 = halfway
        vec3 q = (r > .5 - b * dither * .5) ? c2 : c1;        // dither only in the middle band: flat areas stay solid
        c = mix(c, q, palMix);
      } else if (levels > 0.) c = floor(c * levels + .5 + b * dither) / levels;   // ordered-dither quantise per channel
      gl_FragColor = vec4(clamp(c, 0., 1.), 1.);
    }`,
};

export function makePixelPost(renderer, scene, cam, W, H, o = {}, px = {}) {
  const post = makePost(renderer, scene, cam, W, H, o);
  const pix = new ShaderPass(pixelShader);
  const u = pix.uniforms;
  u.res.value.set(W, H); u.size.value = px.size ?? 4; u.levels.value = px.levels ?? 7; u.dither.value = px.dither ?? 1;
  setPalette(u, px.palette || []); u.palMix.value = px.palMix ?? 1;
  post.composer.addPass(pix);           // after OutputPass: dither in display (sRGB) space, like real 8-bit art
  post.pix = pix; post.setPalette = list => setPalette(u, list);
  return post;
}
function setPalette(u, list) { list.slice(0, MAXP).forEach((h, i) => { const c = new THREE.Color(h); u.pal.value[i].set(...c.convertLinearToSRGB().toArray()); }); u.nPal.value = Math.min(list.length, MAXP); }
