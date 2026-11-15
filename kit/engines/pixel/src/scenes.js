// Style library test v2 on the /pixel-video engine: "Night writer" (3 s seamless loop, no voice).
export const config = {
  loop: true,
  pixel: { size: 5, dither: 1,
    palette: ['#0E0F2E', '#1B1F5E', '#2A2C7A', '#3D3A9A', '#5B4FC0', '#8A6BE0', '#F2E6D0', '#FFFFFF', '#FFD15C', '#FF9A3C', '#E8603C',
      '#F28CA8', '#C2456E', '#7A2342', '#2E7BE8', '#7FD3FF', '#16152B', '#3FD0C9', '#1F8F8A', '#F6C7A8', '#C98E6C', '#8A5A3A'] },
};

export default function build(S) {
  const { THREE, mat, mesh, put, anim, blob, halo, eyes, rng } = S;
  const TAU = Math.PI * 2, fr = x => x - Math.floor(x), sinL = (t, per, ph = 0) => Math.sin(TAU * (t / per + ph));
  const box = (w, h, d, hex, o = {}) => mesh(new THREE.BoxGeometry(w, h, d), mat(hex, { roughness: .8, ...o }), false);
  const glowBox = (w, h, d, hex, k = 1) => mesh(new THREE.BoxGeometry(w, h, d), mat(hex, { emissive: new THREE.Color(hex), emissiveIntensity: k, unique: true }), false);
  const r = rng(9), D = -3.6;   // desk top height

  // back wall and window
  put(box(30, 30, .2, '#3D3A9A'), 'A', 0, 0, -6);
  put(box(6.2, 5.6, .3, '#8A6BE0'), 'A', 0, 2.6, -5.6);
  put(box(5.6, 5.0, .1, '#16152B', { emissive: new THREE.Color('#1B1F5E'), emissiveIntensity: .25, unique: true }), 'A', 0, 2.6, -5.4);
  const moon = blob(.45, '#F2E6D0', { face: false, emissive: '#FFD15C', glow: .35 }); put(moon, 'A', 1.6, 4.2, -5.2); put(halo(1.3, '#FFD15C', .25), 'A', 1.6, 4.2, -5.25);
  for (let x = -2.6; x < 2.6;) { const w = .45 + r() * .6, h = 1 + r() * 1.8; put(box(w, h, .1, '#0E0F2E'), 'A', x + w / 2, .1 + h / 2, -5.3);
    for (let y = .25; y < .1 + h - .2; y += .32) for (let xx = x + .1; xx < x + w - .1; xx += .22) if (r() < .45) { const ph = r(), l = glowBox(.1, .14, .05, '#FFD15C', .35); put(l, 'A', xx, y, -5.24); anim(l, 0, 'fn', { fn: (o, t) => { o.visible = fr(t / 3 + ph) > .15; } }); }
    x += w + .05; }
  for (let i = 0; i < 46; i++) { const x = -2.7 + r() * 5.4, ph = r(), dr = box(.04, .35 + r() * .3, .04, '#7FD3FF', { emissive: new THREE.Color('#7FD3FF'), emissiveIntensity: .15 });
    put(dr, 'A', x, 3.3, -5.2); anim(dr, 0, 'fn', { fn: (o, t) => { const u = fr(t / .75 + ph); o.position.y = 5.0 - u * 5; o.position.x = x - u * .3; } }); }
  put(box(.18, 5.0, .14, '#8A6BE0'), 'A', 0, 2.6, -5.25); put(box(5.6, .18, .14, '#8A6BE0'), 'A', 0, 2.25, -5.25);

  // creator: torso, head with blinking eyes, hair; types in quarter-second taps
  put(halo(2.4, '#F28CA8', .15), 'A', 0, -1.0, -3);
  const torso = blob(1.2, '#F28CA8', { face: false, stretch: [.95, .85, .6] }); put(torso, 'A', 0, -2.7, -1);
  const head = blob(.95, '#F6C7A8', { eyes: { size: .2, gap: .36, smile: true, every: 3, look: () => [0, -.6] }, faceY: -.05 }); put(head, 'A', 0, -.35, -.6);
  const hair = blob(1.05, '#16152B', { face: false, stretch: [1.05, .9, .6] }); put(hair, 'A', 0, -.05, -1.25);
  [torso, head, hair].forEach((o, i) => anim(o, 0, 'fn', { fn: (ob, t, s, b) => { ob.position.y = b.p.y + .035 * Math.sin(TAU * t / .25 + i * .3); } }));

  // laptop lid with a glowing logo, desk, mug with steam
  put(box(3.6, 2.15, .14, '#3FD0C9', { roughness: .4 }), 'A', 0, -2.5, .4);
  const logo = blob(.2, '#FFFFFF', { face: false, emissive: '#FFD15C', glow: .5 }); put(logo, 'A', 0, -2.45, .52); put(halo(.7, '#FFD15C', .3), 'A', 0, -2.45, .55);
  put(box(30, 6, 4, '#5B4FC0'), 'A', 0, D - 3, 0); put(box(30, .14, 4.02, '#8A6BE0'), 'A', 0, D, 0);
  put(box(4.0, .16, 1.2, '#1F8F8A'), 'A', 0, D + .08, .3);
  const mug = mesh(new THREE.CylinderGeometry(.55, .5, 1.2, 28), mat('#FFD15C', { roughness: .5 }), false); put(mug, 'A', -3.4, D + .6, .6);
  const handle = mesh(new THREE.TorusGeometry(.32, .1, 10, 20), mat('#FF9A3C'), false); put(handle, 'A', -2.82, D + .65, .6);
  for (let i = 0; i < 3; i++) { const p = blob(.18, '#FFFFFF', { face: false, emissive: '#FFFFFF', glow: .15 });
    put(p, 'A', -3.4, D + 1.4, .6); anim(p, 0, 'fn', { fn: (o, t) => { const u = fr(t / 1.5 + i / 3); o.position.y = D + 1.3 + u * 2; o.position.x = -3.4 + .25 * sinL(t, 1.5, i / 3); const k = Math.sin(Math.PI * u) * (1 - u * .3); o.scale.setScalar(Math.max(.01, k)); } }); }

  // sleeping cat: breathing body, swishing tail, closed eyes, rising z's
  const cat = blob(1.0, '#FF9A3C', { face: false, stretch: [1.55, .7, .9] }); put(cat, 'A', 2.9, D + .62, .4);
  anim(cat, 0, 'fn', { fn: (o, t, s, b) => { const k = 1 + .05 * sinL(t, 1.5); o.scale.set(b.s.x, b.s.y * k, b.s.z); o.position.y = b.p.y + (k - 1) * .3; } });
  const cHead = blob(.6, '#FF9A3C', { face: false }); put(cHead, 'A', 1.75, D + .75, .9);
  for (const sx of [-1, 1]) { const ear = mesh(new THREE.ConeGeometry(.22, .45, 4), mat('#E8603C'), false); put(ear, 'A', 1.75 + sx * .3, D + 1.3, .9); ear.rotation.z = -sx * .35; }
  for (const sx of [-1, 1]) { const lid = mesh(new THREE.TorusGeometry(.11, .035, 6, 12, Math.PI), mat('#16152B'), false); lid.rotation.z = Math.PI; put(lid, 'A', 1.75 + sx * .22, D + .8, 1.45); }
  const tail = mesh(new THREE.CylinderGeometry(.13, .1, 1.5, 10), mat('#E8603C'), false); put(tail, 'A', 4.3, D + 1.0, .3);
  anim(tail, 0, 'fn', { fn: (o, t) => { o.rotation.z = .5 + .45 * sinL(t, 3); } });
  for (let i = 0; i < 3; i++) { const z = blob(.14, '#FFFFFF', { face: false, emissive: '#7FD3FF', glow: .25 }); put(z, 'A', 1.6, D + 2, 1);
    anim(z, 0, 'fn', { fn: (o, t) => { const u = fr(t / 3 + i / 3); o.position.set(1.5 + u * .8, D + 1.6 + u * 2.2, 1); o.scale.setScalar(Math.max(.01, Math.sin(Math.PI * u)) * (1 + u)); } }); }

  return {
    cam: [[0, 'A', 0, .3, 0, 14, 0, 0], [1.5, 'A', 0, .1, 0, 13.3, 0, 0], [3, 'A', 0, .3, 0, 14, 0, 0]],
    sky: [[0, '#1B1F5E', '#2E3290', 1.7, '#FFE6C8', 1.5, .2], [3, '#1B1F5E', '#2E3290', 1.7, '#FFE6C8', 1.5, .2]],
    titles: [],
    cards: [[0, 3, '3 AM.|#*STILL TYPING*|_THE CAT GAVE UP HOURS AGO']],
    chips: [],
    hideHeader: () => true,
  };
}
