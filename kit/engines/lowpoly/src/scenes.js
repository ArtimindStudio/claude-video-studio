// Style library test v2 on the /lowpoly-video engine: "Night writer" as a low-poly room diorama (3 s loop, no voice).
export const config = { header: '', emph: [], capEnd: 0, loop: true, ao: .6, bloom: .6 };

export default function build(S) {
  const { THREE, R, P, mat, mesh, box, cyl, anim, put, ground, rng } = S;
  const TAU = Math.PI * 2, fr = x => x - Math.floor(x), sinL = (t, per, ph = 0) => Math.sin(TAU * (t / per + ph));
  const glow = (w, h, d, hex, k) => mesh(new THREE.BoxGeometry(w, h, d), mat(hex, { emissive: new THREE.Color(hex), emissiveIntensity: k, unique: true }), false);
  const r = rng(11);

  // room shell: floor, back wall with a window, side wall
  put(box(9, .3, 7, '#6B4A9E'), 'A', 0, -.15, 0);
  put(box(9, 5.5, .3, '#3D2C78'), 'A', 0, 2.6, -3.4);
  put(box(.3, 5.5, 7, '#4A3590'), 'A', -4.4, 2.6, 0);
  put(box(4.0, 2.8, .2, '#1A1238'), 'A', .4, 3.2, -3.2);                     // window frame
  put(glow(3.6, 2.4, .1, '#1E2A6B', .35), 'A', .4, 3.2, -3.12);              // night glass
  for (let x = -1.3; x < 2.1;) { const w = .3 + r() * .4, h = .5 + r() * 1.2; put(box(w, h, .06, '#121034'), 'A', x + w / 2, 2.0 + h / 2, -3.06);
    for (let y = 2.1; y < 2.0 + h - .12; y += .2) for (let xx = x + .06; xx < x + w - .06; xx += .13) if (r() < .45) { const ph = r(), l = glow(.06, .09, .02, '#FFC24B', 1.6); put(l, 'A', xx, y, -3.02); anim(l, 0, 'fn', { fn: (o, t) => { o.visible = fr(t / 3 + ph) > .15; } }); }
    x += w + .04; }
  const moon = mesh(new THREE.IcosahedronGeometry(.32, 1), mat('#FFF3C4', { emissive: new THREE.Color('#FFE3A3'), emissiveIntensity: .7, unique: true })); put(moon, 'A', 1.6, 4.0, -3.02);
  for (let i = 0; i < 34; i++) { const x = -1.3 + r() * 3.4, ph = r(), dr = glow(.025, .22, .02, '#B9C8FF', .8); put(dr, 'A', x, 3.2, -3.0);
    anim(dr, 0, 'fn', { fn: (o, t) => { const u = fr(t / .75 + ph); o.position.y = 4.4 - u * 2.5; } }); }
  put(box(.1, 2.4, .12, '#1A1238'), 'A', .4, 3.2, -3.0); put(box(3.6, .1, .12, '#1A1238'), 'A', .4, 3.4, -3.0);

  // desk, laptop with a glowing screen, mug with steam, lamp
  put(box(5.2, .2, 2.0, '#B07A4E'), 'A', .4, 1.5, -1.6);
  for (const [x, z] of [[-2, -.75], [2.8, -.75], [-2, -2.45], [2.8, -2.45]]) put(box(.16, 1.4, .16, '#8A5A36'), 'A', x, .7, z);
  put(box(1.5, .07, 1.0, '#C9CFEA'), 'A', .4, 1.64, -1.75);
  const lid = new THREE.Group(); const lb = box(1.5, 1.0, .06, '#C9CFEA'); lb.position.y = .5; lid.add(lb);
  const scr = glow(1.36, .86, .02, '#7FFFF3', 1.1); scr.position.set(0, .5, .04); lid.add(scr); lid.rotation.y = Math.PI; lid.rotation.x = .22; put(lid, 'A', .4, 1.66, -1.85);
  const logo = glow(.16, .16, .02, '#FFE3A3', 1.4); logo.position.set(0, .5, -.05); lid.add(logo);
  const mug = cyl(.22, .4, 10, '#FFC24B'); put(mug, 'A', -1.4, 1.8, -1.2);
  for (let i = 0; i < 3; i++) { const p = mesh(new THREE.IcosahedronGeometry(.1, 0), mat('#FFFFFF', { transparent: true, opacity: .8, unique: true }), false); put(p, 'A', -1.4, 2.1, -1.2);
    anim(p, 0, 'fn', { fn: (o, t) => { const u = fr(t / 1.5 + i / 3); o.position.y = 2.05 + u * 1.0; o.position.x = -1.4 + .12 * sinL(t, 1.5, i / 3) + 3.15 * 0; o.material.opacity = .8 * Math.sin(Math.PI * u); o.scale.setScalar(.6 + u); } }); }
  const lamp = P.lamp(); put(lamp, 'A', 2.6, 1.6, -2.2);

  // the writer on a stool behind the desk, typing in quarter-second taps
  const guy = P.person({ shirt: '#FF6F91', pants: '#2E2A5A', hair: '#2B1B4D', skin: '#F2C29C' }); guy.scale.setScalar(1.3); put(guy, 'A', .4, .2, -2.85);
  const { armL, armR, head } = guy.userData; armL.rotation.x = armR.rotation.x = -1.25;
  anim(guy, 0, 'fn', { fn: (o, t) => { armL.rotation.x = -1.25 + .12 * Math.max(0, Math.sin(TAU * t / .25)); armR.rotation.x = -1.25 + .12 * Math.max(0, -Math.sin(TAU * t / .25)); head.rotation.x = .15 + .03 * sinL(t, 1.5); } });
  put(cyl(.35, .5, 8, '#3D2C78'), 'A', .4, .1, -2.85);

  // sleeping cat curled on the desk: breathing body, swishing tail
  const cat = new THREE.Group(); const cb = mesh(new THREE.IcosahedronGeometry(.42, 1), mat('#FF9F5A')); cb.scale.set(1.3, .6, 1); cat.add(cb);
  const ch = mesh(new THREE.IcosahedronGeometry(.25, 1), mat('#FF9F5A')); ch.position.set(-.48, .08, .12); cat.add(ch);
  for (const s of [-1, 1]) { const e = mesh(new THREE.ConeGeometry(.08, .16, 4), mat('#E07A3A')); e.position.set(-.5 + s * .1, .32, .12); cat.add(e); }
  const tail = new THREE.Group(); const tb = cyl(.05, .55, 6, '#E07A3A'); tb.position.y = .27; tail.add(tb); tail.position.set(.5, .05, 0); tail.rotation.z = -1.1; cat.add(tail);
  put(cat, 'A', 2.2, 1.85, -1.0);
  anim(cat, 0, 'fn', { fn: (o, t) => { cb.scale.y = .6 * (1 + .06 * sinL(t, 1.5)); tail.rotation.z = -1.1 + .35 * sinL(t, 3); } });

  return {
    // slow orbit and back: last key equals the first
    cam: [[0, 'A', .4, 2.3, -1.6, 7.6, 32, 22], [1.5, 'A', .4, 2.3, -1.6, 7.1, 40, 24], [3, 'A', .4, 2.3, -1.6, 7.6, 32, 22]],
    sky: [[0, '#1E1050', '#5A2E96', 1.1, '#C7B8FF', .9, .6], [3, '#1E1050', '#5A2E96', 1.1, '#C7B8FF', .9, .6]],
    titles: [[0, 3, 'STILL WRITING']],
    chips: [],
    update(t) { lamp.userData.glow.material.emissiveIntensity = 2.4; scr.material.emissiveIntensity = 1.0 + .08 * sinL(t, .5); },
    labels() { return ''; }, mid() { return null; }, hideHeader: () => true, ready() { return Promise.resolve(); },
  };
}
