// Low-poly video engine: three.js orthographic dioramas + premium look (key/fill/rim, GTAO, bloom, grade)
// + DOM overlay (header, rising titles, word-synced captions, chips, projected labels, mid text).
// Every frame is a pure function of t. A video = scenes.js: export default (S) => ({cam, sky, titles, chips, update, mid, labels}).
import * as THREE from 'three';
import { makePost } from './vendor/post.js';

export function createStage(cfg = {}) {
  const LAND = cfg.format === '16x9';
  const W = cfg.W || (LAND ? 1920 : 1080), H = cfg.H || (LAND ? 1080 : 1920), FPS = cfg.fps || 30;
  if (LAND) document.body.classList.add('land');
  // ---------- math ----------
  const clamp = x => Math.min(Math.max(x, 0), 1);
  const out3 = x => 1 - Math.pow(1 - clamp(x), 3);
  const in2 = x => clamp(x) * clamp(x);
  const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const spring = s => s <= 0 ? 0 : 1 - Math.exp(-6 * s) * Math.cos(12 * s);
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const R = rng(cfg.seed || 7);
  const col = h => new THREE.Color(h);
  const mixHex = (a, b, p) => col(a).lerp(col(b), clamp(p));

  // ---------- renderer, lights (key sun + cool fill + rim) ----------
  const canvas = document.getElementById('c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 200, 260);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 600);
  const hemi = new THREE.HemisphereLight(0xA9C2FF, 0x6A4E3C, 1.0); scene.add(hemi);
  const rim = new THREE.DirectionalLight(0xCFE0FF, 1.8); scene.add(rim); scene.add(rim.target);
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.02;
  scene.add(sun); scene.add(sun.target);

  // ---------- materials & primitives ----------
  const MC = {};
  function mat(hex, o = {}) { const k = hex + JSON.stringify(o); if (!MC[k] || o.unique) { const m = new THREE.MeshStandardMaterial({ color: hex, flatShading: true, roughness: .9, metalness: 0, ...o }); delete m.unique; if (o.unique) return m; MC[k] = m; } return MC[k]; }
  function mesh(geo, m, cast = true) { const x = new THREE.Mesh(geo, m); x.castShadow = cast; x.receiveShadow = true; return x; }
  const SQ3 = Math.sqrt(3);
  const hexXZ = (q, r) => [SQ3 * (q + r / 2), 1.5 * r];
  const hexDist = (q, r) => (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
  const jit = (hex, a = .05) => { const c = col(hex); const hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, hsl.s, clamp(hsl.l + (R() - .5) * a)); return '#' + c.getHexString(); };
  function hexTile(top, side, h) { const g = new THREE.Group();
    const s = mesh(new THREE.CylinderGeometry(.97, .97, h - .06, 6), mat(side)); s.position.y = (h - .06) / 2 - .02; g.add(s);
    const c = mesh(new THREE.CylinderGeometry(.97, .97, .12, 6), mat(top)); c.position.y = h - .06; g.add(c); g.userData.h = h; return g; }
  function prism(w, h, d, m) { const g = new THREE.CylinderGeometry(h / Math.cos(Math.PI / 6) * 0.58, h / Math.cos(Math.PI / 6) * 0.58, w, 3); const x = mesh(g, m); x.rotation.z = Math.PI / 2; x.rotation.x = Math.PI; x.scale.set(1, 1, d / h * 0.87); return x; }
  const box = (w, h, d, hex, o) => mesh(new THREE.BoxGeometry(w, h, d), mat(hex, o));
  const cyl = (r, h, seg, hex, o) => mesh(new THREE.CylinderGeometry(r, r, h, seg), mat(hex, o));
  const glowM = (c, base = '#FFE2A8', k = 3) => mat(base, { emissive: new THREE.Color(c || '#FFB347'), emissiveIntensity: k, unique: true });
  function texCanvas(draw, w = 512, h = 1024) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; }

  // ---------- animation registry ----------
  const A = [];
  function anim(obj, t0, kind = 'pop', o = {}) { obj.userData.base = { p: obj.position.clone(), s: obj.scale.clone(), r: obj.rotation.clone() }; A.push({ obj, t0, kind, o }); return obj; }
  function applyAnims(t) { for (const a of A) { const { obj, t0, kind, o } = a, b = obj.userData.base, s = t - t0;
    if (o.until !== undefined && t > o.until) { obj.visible = false; continue; }
    if (s < 0 && kind !== 'fn') { obj.visible = false; continue; } obj.visible = true;
    if (kind === 'pop') { const k = spring(s * (o.speed || 1)); obj.scale.set(b.s.x * k, b.s.y * k, b.s.z * k); obj.position.copy(b.p); }
    else if (kind === 'rise') { const D = o.depth || 3; let y = -D * (1 - out3(s / .4)); if (s > .4) y += .18 * Math.exp(-6 * (s - .4)) * Math.sin(14 * (s - .4)); obj.position.set(b.p.x, b.p.y + y, b.p.z); obj.scale.copy(b.s); }
    else if (kind === 'drop') { const Hh = o.height || 6, ft = .32; let y, sq = 1; if (s < ft) { y = Hh * (1 - in2(s / ft)); sq = 1 + .15 * clamp(s / ft); } else { const u = s - ft; y = .35 * Math.exp(-7 * u) * Math.abs(Math.sin(11 * u)); sq = 1 - .22 * Math.exp(-9 * u) * Math.cos(14 * u); }
      obj.position.set(b.p.x, b.p.y + y, b.p.z); obj.scale.set(b.s.x * (2 - sq) ** .5, b.s.y * sq, b.s.z * (2 - sq) ** .5); }
    else if (kind === 'fn') { o.fn(obj, t, s, b); }
    // loop helper: o.out = time to un-build (0.35 s shrink/sink), so the last frame matches the first
    if (o.out !== undefined && t >= o.out && kind !== 'fn') { const u = out3((t - o.out) / .35); if (u >= 1) { obj.visible = false; continue; }
      if (kind === 'rise') obj.position.y -= (o.depth || 3) * u; else obj.scale.multiplyScalar(1 - u); }
  } }

  // ---------- sets: each scene world lives at its own x offset ----------
  const SETS = {}; 'ABCDEFGHIJKL'.split('').forEach((k, i) => SETS[k] = [i * 300, 0, 0]);
  const at = (set, x, y, z) => { const o = SETS[set]; return [o[0] + x, o[1] + y, o[2] + z]; };
  function put(obj, set, x, y, z) { obj.position.set(...at(set, x, y, z)); scene.add(obj); return obj; }

  // ---------- floating island: wavy water disc + earth bands + lilac underside + drifting rocks ----------
  const waters = [];
  function island(set, Rr = 11, hex = '#5FB3D9', o = {}) { const g = new THREE.PlaneGeometry(2 * Rr, 2 * Rr, 64, 64); g.rotateX(-Math.PI / 2);
    { const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), d = Math.hypot(x, z); if (d > Rr) { p.setX(i, x / d * Rr); p.setZ(i, z / d * Rr); } } }
    const g2 = g.toNonIndexed(); const m = mesh(g2, mat(hex, { roughness: .45, emissive: new THREE.Color(o.waterGlow || '#1F6E99'), emissiveIntensity: o.waves === false ? 0 : .25 }), false); m.receiveShadow = true; put(m, set, 0, -.05, 0);
    m.userData.p0 = Float32Array.from(g2.attributes.position.array); if (o.waves !== false) waters.push(m);
    const band = mesh(new THREE.CylinderGeometry(Rr, Rr * .97, .9, 40), mat(o.band || '#A0583A')); put(band, set, 0, -.75, 0);
    const band2 = mesh(new THREE.CylinderGeometry(Rr * .97, Rr * .9, .7, 40), mat(o.band2 || '#7A4632')); put(band2, set, 0, -1.5, 0);
    const under = mesh(new THREE.CylinderGeometry(Rr * .9, Rr * .18, Rr * .75, 9), mat(o.under || '#8C78AE', { emissive: new THREE.Color('#4A3B6E'), emissiveIntensity: .5 })); put(under, set, 0, -1.85 - Rr * .375, 0); under.rotation.y = .3;
    const rr = rng(Rr * 13 | 0); for (let i = 0; i < (o.rocks ?? 6); i++) { const a = rr() * Math.PI * 2, d = Rr * (.9 + rr() * .5), k = .5 + rr() * 1.1; const rk = mesh(new THREE.IcosahedronGeometry(k, 0), mat(i % 2 ? '#D9C2E8' : '#B9A3D6')); put(rk, set, Math.cos(a) * d, -2.5 - rr() * Rr * .4, Math.sin(a) * d); rk.rotation.set(rr() * 3, rr() * 3, 0);
      anim(rk, 0, 'fn', { fn: (ob, t, s, b) => { ob.position.set(b.p.x, b.p.y + .25 * Math.sin(t * .9 + i), b.p.z); } }); }
    return m; }
  // flat-shaded ground plane (streets, fields, floors); jittered vertices so facets catch the light
  function ground(set, size = 40, hex = '#B9C98A', o = {}) { const g = new THREE.PlaneGeometry(size, size, 24, 24); g.rotateX(-Math.PI / 2);
    const rr = rng(size * 7 | 0); const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, (rr() - .5) * (o.bump ?? .08));
    g.computeVertexNormals(); const m = mesh(g.toNonIndexed(), mat(hex), false); m.receiveShadow = true; put(m, set, 0, 0, 0); return m; }
  function updWater(t) { for (const w of waters) { if (!w.visible) continue; const p = w.geometry.attributes.position, p0 = w.userData.p0;
    for (let i = 0; i < p.count; i++) { const x = p0[i * 3], z = p0[i * 3 + 2]; p.array[i * 3 + 1] = .07 * Math.sin(x * .9 + t * 1.6) + .05 * Math.sin(z * 1.3 - t * 1.2) + .03 * Math.sin((x + z) * 2.1 + t * 2.3); }
    p.needsUpdate = true; w.geometry.computeVertexNormals(); } }
  // hex patch: cells within radius, returns {tiles, at:{'q,r':{x,z,h,d}}}; style(q,r,d)->{top,side,h,t0}
  function hexPatch(set, rad, style, ox = 0, oz = 0) { const at = {}, tiles = [];
    for (let q = -rad; q <= rad; q++) for (let r = -rad; r <= rad; r++) { const d = hexDist(q, r); if (d > rad) continue; const st = style(q, r, d); if (!st) continue;
      const [x, z] = hexXZ(q, r); const t = hexTile(st.top, st.side, st.h); put(t, set, ox + x, 0, oz + z); if (st.t0 !== undefined) anim(t, st.t0, 'rise', { depth: st.h + 1.2 });
      at[q + ',' + r] = { x: ox + x, z: oz + z, h: st.h, d }; tiles.push(t); }
    return { tiles, at }; }

  // ---------- prop library ----------
  const C = { CREAM: '#F4E9D4', STONE: '#E2D6BE', TERRA: '#D9734E', GRASS: '#9CCB7A', SAND: '#EBD9A6', ROCK: '#B9AFA2', RED: '#D64545', GOLD: '#E8B93C', DARK: '#3B3F5C', EARTH: '#8C7A62', BLUE: '#3E6FD8', GREEN: '#3FA35B' };
  const P = {
    temple() { const g = new THREE.Group();
      const b1 = box(3.0, .25, 2.1, C.STONE); b1.position.y = .12; g.add(b1); const b2 = box(2.7, .2, 1.8, C.CREAM); b2.position.y = .35; g.add(b2);
      const cols = []; for (let i = 0; i < 6; i++) for (const z of [-.7, .7]) { const c = cyl(.11, 1.3, 8, '#FBF4E4'); c.position.set(-1.1 + i * .44, 1.1, z); g.add(c); cols.push(c); }
      const ent = box(2.8, .18, 1.8, C.CREAM); ent.position.y = 1.84; g.add(ent);
      const roof = prism(2.9, .55, 1.9, mat(C.TERRA)); roof.position.y = 2.2; g.add(roof); return { g, cols, roof, ent }; },
    house(h = .8, roof = C.TERRA, wall = C.CREAM) { const g = new THREE.Group(); const b = box(.8, h, .7, wall); b.position.y = h / 2; g.add(b);
      const r = prism(.9, .38, .8, mat(roof)); r.position.y = h + .17; g.add(r);
      const win = box(.18, .2, .02, '#4A4E69', { emissive: new THREE.Color('#FFB85C'), emissiveIntensity: 1.6, unique: true }); win.position.set(.15, h * .55, .36); g.add(win); g.userData.win = win; return g; },
    cypress(h = 1.1) { const g = new THREE.Group(); const tr = cyl(.06, .25, 5, '#7A5A3C'); tr.position.y = .12; g.add(tr); const c = mesh(new THREE.ConeGeometry(.26, h, 6), mat(jit('#5E8C4A', .08))); c.position.y = .25 + h / 2; g.add(c); return g; },
    tree() { const g = new THREE.Group(); const tr = cyl(.07, .35, 5, '#7A5A3C'); tr.position.y = .17; g.add(tr); const c = mesh(new THREE.IcosahedronGeometry(.42, 0), mat(jit('#7DB35A', .1))); c.position.y = .6; g.add(c); return g; },
    boat(sail = '#F4E9D4') { const g = new THREE.Group(); const hull = mesh(new THREE.CylinderGeometry(.5, .32, .3, 4), mat('#8A5A3B')); hull.rotation.y = Math.PI / 4; hull.scale.set(1, 1, 2.2); hull.position.y = .12; g.add(hull);
      const mast = cyl(.04, 1.3, 4, '#6B4A30'); mast.position.y = .8; g.add(mast); const s = mesh(new THREE.ConeGeometry(.5, 1, 3), mat(sail)); s.scale.set(1, 1, .2); s.position.set(0, .85, 0); g.add(s); return g; },
    lamp() { const g = new THREE.Group(); const pole = cyl(.05, 1, 6, '#2E2E38'); pole.position.y = .5; g.add(pole);
      const bulb = mesh(new THREE.IcosahedronGeometry(.13, 1), glowM(), false); bulb.position.y = 1.05; g.add(bulb); g.userData.glow = bulb; return g; },
    brazier() { const g = new THREE.Group(); const bowl = cyl(.18, .25, 8, '#8A6B3A'); bowl.position.y = .12; g.add(bowl); const fl = mesh(new THREE.ConeGeometry(.14, .4, 5), glowM('#FF7A2A'), false); fl.position.y = .42; g.add(fl); g.userData.glow = fl; return g; },
    person(o = {}) { const g = new THREE.Group(); const skin = o.skin || '#E8B98F';
      const legL = box(.22, .8, .24, o.pants || '#3E5C9A'); legL.position.set(-.13, .4, 0); const legR = legL.clone(); legR.position.x = .13; g.add(legL, legR);
      const body = box(.62, .72, .36, o.shirt || '#F2F2F2'); body.position.y = 1.16; g.add(body);
      const armL = new THREE.Group(); const al = box(.16, .66, .18, o.shirt || '#F2F2F2'); al.position.y = -.3; armL.add(al); const hl = box(.14, .14, .14, skin); hl.position.y = -.68; armL.add(hl); armL.position.set(-.41, 1.48, 0); g.add(armL);
      const armR = armL.clone(); armR.position.x = .41; g.add(armR);
      const head = new THREE.Group(); const hd = mesh(new THREE.IcosahedronGeometry(.27, 1), mat(skin)); head.add(hd); const hair = mesh(new THREE.IcosahedronGeometry(.285, 0), mat(o.hair || '#4A2E1E')); hair.scale.set(1, .6, 1); hair.position.y = .11; head.add(hair);
      const e1 = box(.05, .07, .02, '#222'); e1.position.set(-.09, .02, .26); const e2 = e1.clone(); e2.position.x = .09; head.add(e1, e2); head.position.y = 1.82; g.add(head);
      g.userData = { head, armL, armR }; return g; },
    // smoke: n puffs from a fixed point, looping; returns meshes
    smoke(set, x, y, z, t0, n = 20, every = .17, life = 3.6, drift = [.9, .9, -.2]) { const ps = []; for (let i = 0; i < n; i++) { const p = mesh(new THREE.IcosahedronGeometry(.22, 0), mat('#F2F2F2', { transparent: true, opacity: .9, unique: true }), false); scene.add(p);
      anim(p, t0 + i * every, 'fn', { fn: (o, t, s) => { if (s < 0) { o.visible = false; return; } const u = s % life; o.visible = true; const [ox, oy, oz] = at(set, x, y, z);
        o.position.set(ox + u * drift[0], oy + u * drift[1], oz + u * drift[2]); const k = .6 + u * .9; o.scale.set(k, k, k); o.material.opacity = Math.max(0, .9 * (1 - u / life)); } }); ps.push(p); } return ps; },
    // faceted planet / moon: jittered icosahedron, shared-vertex displacement keeps it closed
    planet(radius, hex, jitter = .06, seed = 11) { const g = new THREE.IcosahedronGeometry(radius, 2); const p = g.attributes.position; const r2 = rng(seed); const seen = {};
      for (let i = 0; i < p.count; i++) { const key = [p.getX(i), p.getY(i), p.getZ(i)].map(v => v.toFixed(3)).join(); if (!seen[key]) seen[key] = 1 + (r2() - .5) * jitter; const k = seen[key]; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); }
      g.computeVertexNormals(); return mesh(g, mat(hex)); },
  };

  // ---------- background sky (gradient + twinkling stars) ----------
  const BG = document.createElement('canvas'); BG.width = 270; BG.height = 480; const bgx = BG.getContext('2d'); const bgTex = new THREE.CanvasTexture(BG); bgTex.colorSpace = THREE.SRGBColorSpace; scene.background = bgTex;
  const STR = (() => { const r = rng(5), a = []; for (let i = 0; i < 140; i++) a.push([r() * 270, r() * 480 * .8, r() * .9 + .4, r()]); return a; })();
  function drawBG(sk, t) { const g = bgx.createLinearGradient(0, 0, 0, 480); g.addColorStop(0, '#' + sk.top.getHexString()); g.addColorStop(.7, '#' + sk.bot.getHexString()); g.addColorStop(1, '#' + sk.bot.getHexString()); bgx.fillStyle = g; bgx.fillRect(0, 0, 270, 480);
    if (sk.stars > 0.01) for (const [x, y, s, p] of STR) { bgx.fillStyle = `rgba(255,250,235,${(sk.stars * (.45 + .55 * Math.abs(Math.sin(t * 1.3 + p * 9)))).toFixed(3)})`; bgx.fillRect(x, y, s, s); }
    bgTex.needsUpdate = true; }

  // ---------- post: GTAO + bloom + grade ----------
  const POST = makePost(renderer, scene, cam, W, H, { ssaa: 1, ao: true, aoRadius: .5, aoScale: 1.6, aoAmt: cfg.ao ?? .6 }); POST.dof.maxCoc = 0;
  POST.bloom.strength = cfg.bloom ?? .55; POST.bloom.radius = .45; POST.bloom.threshold = .92;
  { const u = POST.vig.uniforms; u.amt.value = .32; u.warm.value = .25; u.contrast.value = .18; u.sat.value = 1.1; }

  // ---------- DOM overlay ----------
  const $ = id => document.getElementById(id);
  const fmt = n => Math.round(n).toLocaleString('en-US');
  if (cfg.header) $('hdr').textContent = cfg.header;
  // camera keys [t, set, tx,ty,tz, frustum, azDeg, elDeg, follow?(t)->{tx,ty,tz}]; consecutive keys in the same set interpolate, a set change cuts
  function camAt(K, t) { let k = 0; while (k < K.length - 1 && K[k + 1][0] <= t) k++; const a = K[k], b = K[k + 1]; const same = b && b[1] === a[1];
    const p = same ? sm((t - a[0]) / (b[0] - a[0])) : 0; const v = i => same ? lerp(a[i], b[i], p) : a[i];
    const f = typeof a[8] === 'function' ? a[8](t) : {}; return { set: a[1], tx: v(2) + (f.tx || 0), ty: v(3) + (f.ty || 0), tz: v(4) + (f.tz || 0), F: v(5), az: v(6), el: v(7) }; }
  // sky keys [t, top, bottom, sunI, sunHex, hemiI, stars]
  function skyAt(SK, t) { let k = 0; while (k < SK.length - 1 && SK[k + 1][0] <= t) k++; const a = SK[k], b = SK[k + 1] || a; const p = b[0] > a[0] ? clamp((t - a[0]) / (b[0] - a[0])) : 0;
    return { top: mixHex(a[1], b[1], p), bot: mixHex(a[2], b[2], p), sunI: lerp(a[3], b[3], p), sun: mixHex(a[4], b[4], p), hemi: lerp(a[5], b[5], p), stars: lerp(a[6], b[6], p) }; }
  // titles [t0,t1,text]: letters rise from below a line with overshoot
  function titleAt(TT, t) { const e = $('title'); const T = TT.find(x => t >= x[0] && t < x[1]); if (!T) { e.innerHTML = ''; return; }
    const s = t - T[0], out = T[1] - t; e.innerHTML = [...T[2]].map((ch, i) => { const u = s - .05 - i * .045; let y = u < 0 ? 220 : (u < .3 ? 220 * (1 - out3(u / .3)) : 0) + (u >= .3 ? -14 * Math.exp(-6 * (u - .3)) * Math.sin(14 * (u - .3)) : 0); if (out < .25) y = (1 - out / .25) * 220; return `<span style="transform:translateY(${y.toFixed(1)}px)">${ch === ' ' ? '&nbsp;' : ch}</span>`; }).join('');
    e.style.fontSize = (T[2].length > 8 ? 120 : 150) + 'px'; }
  // captions: phrases of <=3 words or to punctuation; grey until spoken; emph words gold
  const WORDS = cfg.words || window.WORDS || []; const EMPH = new Set(cfg.emph || []); const capEnd = cfg.loop ? 1e9 : (cfg.capEnd ?? 1e9);
  const PH = []; { let cur = []; WORDS.forEach(w => { cur.push(w); if (/[.?,!]$/.test(w.w) || cur.length >= (cfg.capWords || 3)) { PH.push(cur); cur = []; } }); if (cur.length) PH.push(cur); }
  PH.forEach((p, i) => { p.st = p[0].s; p.en = Math.min(PH[i + 1] ? PH[i + 1][0].s : 99, capEnd); });
  function capAt(t) { const e = $('cap'); const p = PH.find(p => t >= p.st - .05 && t < p.en); if (!p || t >= capEnd) { e.innerHTML = ''; return; }
    e.innerHTML = p.map(w => { const on = t >= w.s; const em = EMPH.has(w.w); const k = on ? clamp((t - w.s) / .08) : 0; return `<span style="color:${on ? (em ? '#FFD15C' : '#fff') : 'rgba(255,255,255,.5)'};transform:scale(${(1 + .08 * Math.sin(Math.PI * k)).toFixed(3)})">${w.w}</span>`; }).join(''); }
  // chips [t0,t1,x,y,html|fn(t),rotDeg]: spring pop-in card
  function chipsAt(CH, t) { $('chips').innerHTML = CH.filter(c => t >= c[0] && t < c[1]).map(c => { const s = t - c[0], o = c[1] - t; const k = spring(s * 1.1); const a = clamp(s / .08) * clamp(o / .12);
    const h = typeof c[4] === 'function' ? c[4](t) : c[4];
    return `<div class="chip" style="left:${c[2]}px;top:${c[3]}px;opacity:${a};transform:translate(-50%,-50%) rotate(${c[5] || 0}deg) scale(${(k * (o < .12 ? .9 + .1 * o / .12 : 1)).toFixed(3)})">${h}</div>`; }).join(''); }
  // project a world point to screen px (labels over 3D objects)
  const toScreen = v3 => { const v = v3.clone().project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };

  // ---------- run ----------
  function run(build) {
    const V = build(S);
    const K = V.cam, SK = V.sky, TT = V.titles || [], CH = V.chips || [];
    if (cfg.loop) { const f = K[0], l = K[K.length - 1]; const same = f[1] === l[1] && [2, 3, 4, 5, 6, 7].every(i => Math.abs(f[i] - l[i]) < 1e-3);
      if (!same) console.warn('LOOP: last camera key differs from the first; the seam will jump', f, l); }
    function frame(t) {
      const cs = camAt(K, t); const o = SETS[cs.set]; const tgt = new THREE.Vector3(o[0] + cs.tx, cs.ty, o[2] + cs.tz);
      const az = cs.az * Math.PI / 180, el = cs.el * Math.PI / 180, D = 200;
      cam.position.set(tgt.x + D * Math.cos(el) * Math.sin(az), tgt.y + D * Math.sin(el), tgt.z + D * Math.cos(el) * Math.cos(az)); cam.up.set(0, 1, 0); cam.lookAt(tgt);
      const a = W / H; cam.top = cs.F / 2; cam.bottom = -cs.F / 2; cam.left = -cs.F * a / 2; cam.right = cs.F * a / 2; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
      const sk = skyAt(SK, t); drawBG(sk, t);
      scene.fog.color.copy(sk.bot); scene.fog.near = D + cs.F * .6; scene.fog.far = D + cs.F * 2.6;
      sun.intensity = sk.sunI * 1.15; sun.color.copy(sk.sun); hemi.intensity = sk.hemi * .85; rim.intensity = 1.2 + sk.stars * 1.2;
      rim.position.set(tgt.x - 60 * Math.sin(az), 70, tgt.z - 60 * Math.cos(az)); rim.target.position.copy(tgt);
      const saz = az + 1.35; sun.position.set(tgt.x + 40 * Math.sin(saz), 45, tgt.z + 40 * Math.cos(saz)); sun.target.position.copy(tgt);
      const sc = sun.shadow.camera, Sx = cs.F * 1.1; sc.left = -Sx; sc.right = Sx; sc.top = Sx; sc.bottom = -Sx; sc.near = 1; sc.far = 140; sc.updateProjectionMatrix();
      applyAnims(t); if (V.update) V.update(t, cs); updWater(t);
      titleAt(TT, t); capAt(t); chipsAt(CH, t);
      $('labs').innerHTML = V.labels ? V.labels(t, cs) : '';
      const mid = V.mid ? V.mid(t) : null; $('mid').innerHTML = mid ? mid.html : ''; if (mid && mid.top) $('mid').style.top = mid.top + 'px';
      $('hdr').style.opacity = (V.hideHeader && V.hideHeader(t)) ? 0 : 1;
      POST.composer.render();
    }
    const ready = (V.ready || (() => Promise.resolve()));
    document.fonts.load('600 40px Fredoka').then(() => document.fonts.ready).then(() => ready()).then(() => {
      window.renderFrame = f => frame((f - 1) / FPS); window.seek = frame; window.ready = true; });
  }
  const S = { THREE, W, H, FPS, scene, cam, renderer, sun, hemi, rim, POST,
    clamp, out3, in2, sm, lerp, spring, rng, R, col, mixHex, fmt,
    mat, mesh, box, cyl, prism, hexTile, hexXZ, hexDist, jit, glowM, texCanvas,
    anim, SETS, at, put, island, ground, hexPatch, C, P, toScreen, run };
  return S;
}
