// Style library test v2: "Night writer". A creator types at a laptop at 3 AM, the cat sleeps on the desk,
// rain runs down the window, steam curls from the mug. Every motion is periodic in 3 s, so the clip loops.
// Pure function of time: renderFrame(f) draws frame f from nothing.
(() => {
const W = 1080, H = 1920, FPS = 30, DUR = 3;
const STYLE = window.STYLE || 'doodle';
const c = document.createElement('canvas'); c.width = W; c.height = H; document.body.appendChild(c);
const g = c.getContext('2d');
const TAU = Math.PI * 2, frac = x => x - Math.floor(x), clamp = (x, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const ease = x => 1 - Math.pow(1 - clamp(x), 3), sinL = (t, per, ph = 0) => Math.sin(TAU * (t / per + ph));
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const off = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };

// ---------- static layout ----------
const WIN = { x: 190, y: 230, w: 700, h: 650 }, DESK = 1400;
const r0 = rng(9), CITY = [], LIT = [], RAIN = [];
for (let x = WIN.x; x < WIN.x + WIN.w;) { const w = 40 + r0() * 70, h = 90 + r0() * 260; CITY.push({ x, w, h }); for (let yy = WIN.y + WIN.h - h + 18; yy < WIN.y + WIN.h - 20; yy += 34) for (let xx = x + 10; xx < x + w - 14; xx += 22) if (r0() < .45) LIT.push({ x: xx, y: yy, ph: r0(), on: r0() < .8 }); x += w + 4; }
for (let i = 0; i < 70; i++) RAIN.push({ x: WIN.x + r0() * WIN.w, ph: r0(), len: 30 + r0() * 50 });

// ---------- the model: parts with roles, all periodic in 3 s ----------
function model(t) {
  const type = 4 * Math.sin(TAU * t / 0.25);          // typing bob, 12 taps in 3 s
  const blinkK = (() => { const p = t % 3; return p > 1.9 && p < 2.06 ? Math.sin(Math.PI * (p - 1.9) / .16) : 0; })();
  const breath = 1 + 0.045 * sinL(t, 1.5);
  const tail = 0.35 * sinL(t, 3);
  const P = []; const add = (role, type, d) => P.push(Object.assign({ role, type }, d));
  const by = type * .5;
  add('shirt', 'poly', { pts: [[372, 1118 + by], [708, 1118 + by], [770, DESK + 30], [310, DESK + 30]] });
  add('skin', 'poly', { pts: [[512, 1060 + by], [568, 1060 + by], [572, 1125 + by], [508, 1125 + by]] });
  add('skin', 'circle', { cx: 540, cy: 975 + by, r: 118 });
  add('hair', 'poly', { pts: [[418, 990 + by], [426, 900 + by], [480, 852 + by], [560, 842 + by], [630, 866 + by], [664, 920 + by], [662, 992 + by], [628, 940 + by], [560, 922 + by], [470, 930 + by]] });
  add('eye', 'ellipse', { cx: 500, cy: 990 + by, rx: 12, ry: 13 * (1 - blinkK) + .5 });
  add('eye', 'ellipse', { cx: 580, cy: 990 + by, rx: 12, ry: 13 * (1 - blinkK) + .5 });
  add('mouth', 'line', { pts: [[524, 1036 + by], [540, 1042 + by], [556, 1036 + by]], w: 6 });
  add('cheek', 'ellipse', { cx: 468, cy: 1022 + by, rx: 18, ry: 10 }); add('cheek', 'ellipse', { cx: 612, cy: 1022 + by, rx: 18, ry: 10 });
  add('laptop', 'rrect', { x: 318, y: 1150, w: 444, h: 262, r: 26 });
  add('logo', 'circle', { cx: 540, cy: 1282, r: 22 });
  add('desk', 'rect', { x: 0, y: DESK, w: W, h: H - DESK });
  add('deskEdge', 'rect', { x: 0, y: DESK, w: W, h: 16 });
  add('laptopBase', 'rrect', { x: 290, y: DESK - 14, w: 500, h: 26, r: 10 });
  add('mug', 'rrect', { x: 130, y: 1260, w: 140, h: 152, r: 24 });
  add('mugHandle', 'ring', { cx: 276, cy: 1330, r: 34, w: 16 });
  add('cat', 'ellipse', { cx: 870, cy: DESK - 62 * breath, rx: 150, ry: 66 * breath });
  add('catTail', 'curve', { pts: [[1010, DESK - 40], [1060, DESK - 130 + 40 * tail], [960 + 50 * tail, DESK - 150]], w: 26 });
  add('cat', 'circle', { cx: 748, cy: DESK - 70, r: 58 });
  add('cat', 'poly', { pts: [[702, DESK - 104], [712, DESK - 162], [744, DESK - 122]] });
  add('cat', 'poly', { pts: [[756, DESK - 124], [790, DESK - 160], [796, DESK - 100]] });
  add('catEye', 'curve', { pts: [[718, DESK - 70], [728, DESK - 62], [738, DESK - 70]], w: 5 });
  add('catEye', 'curve', { pts: [[756, DESK - 70], [766, DESK - 62], [776, DESK - 70]], w: 5 });
  const steam = [0, 1, 2].map(i => { const u = frac(t / 1.5 + i / 3); return { u, x: 180 + i * 22, y: 1240 - u * 220, a: Math.sin(Math.PI * u), sway: 18 * sinL(t, 1.5, i / 3) }; });
  const zz = [0, 1, 2].map(i => { const u = frac(t / 3 + i / 3); return { u, x: 700 + u * 60 + i * 6, y: DESK - 190 - u * 220, s: 30 + u * 30, a: Math.sin(Math.PI * u) }; });
  const rain = RAIN.map(r => { const u = frac(t / .75 + r.ph); return { x: r.x - u * 40, y: WIN.y + u * (WIN.h + 80) - 60, len: r.len }; });
  const lit = LIT.map(l => ({ ...l, on: l.on ? (frac(t / 3 + l.ph) > .1) : (frac(t / 3 + l.ph) > .6) }));
  return { t, type, blinkK, breath, tail, parts: P, steam, zz, rain, lit };
}

// ---------- shape paths ----------
function trace(q, d) {
  q.beginPath();
  switch (d.type) {
    case 'poly': d.pts.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.closePath(); break;
    case 'circle': q.arc(d.cx, d.cy, d.r, 0, TAU); break;
    case 'ellipse': q.ellipse(d.cx, d.cy, d.rx, Math.max(.5, d.ry), 0, 0, TAU); break;
    case 'rect': q.rect(d.x, d.y, d.w, d.h); break;
    case 'rrect': q.roundRect(d.x, d.y, d.w, d.h, d.r); break;
    case 'ring': q.arc(d.cx, d.cy, d.r, -Math.PI / 2, Math.PI / 2); break;
    case 'line': d.pts.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); break;
    case 'curve': { const [a, b, e] = d.pts; q.moveTo(...a); q.quadraticCurveTo(...b, ...e); break; }
  }
}
const isStroke = d => ['ring', 'line', 'curve'].includes(d.type);
const bbox = d => d.type === 'circle' ? [d.cx - d.r, d.cy - d.r, d.r * 2, d.r * 2] : d.type === 'ellipse' ? [d.cx - d.rx, d.cy - d.ry, d.rx * 2, d.ry * 2] : d.pts ? (() => { const xs = d.pts.map(p => p[0]), ys = d.pts.map(p => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)]; })() : [d.x, d.y, d.w, d.h];

// ---------- generic painter; each style passes a palette and a shape hook ----------
function paint(q, M, C, hook) {
  const shape = (d, col) => hook.shape ? hook.shape(q, d, col) : (trace(q, d), isStroke(d) ? (q.strokeStyle = col, q.lineWidth = d.w, q.lineCap = 'round', q.stroke()) : (q.fillStyle = col, q.fill()));
  q.fillStyle = C.wall; q.fillRect(0, 0, W, H);
  if (hook.wall) hook.wall(q, M);
  // window
  q.save(); q.beginPath(); q.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, 18); q.clip();
  const sk = q.createLinearGradient(0, WIN.y, 0, WIN.y + WIN.h); sk.addColorStop(0, C.sky0); sk.addColorStop(1, C.sky1); q.fillStyle = sk; q.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
  q.fillStyle = C.moon; q.beginPath(); q.arc(760, 360, 54, 0, TAU); q.fill();
  q.fillStyle = C.city; for (const b of CITY) q.fillRect(b.x, WIN.y + WIN.h - b.h, b.w, b.h);
  q.fillStyle = C.lit; for (const l of M.lit) if (l.on) q.fillRect(l.x, l.y, 10, 14);
  q.strokeStyle = C.rain; q.lineWidth = 3; q.lineCap = 'round'; q.globalAlpha = .7;
  for (const r of M.rain) { q.beginPath(); q.moveTo(r.x, r.y); q.lineTo(r.x - 12, r.y + r.len); q.stroke(); }
  q.globalAlpha = 1; q.restore();
  q.strokeStyle = C.frame; q.lineWidth = 22; q.beginPath(); q.roundRect(WIN.x, WIN.y, WIN.w, WIN.h, 18); q.stroke();
  q.lineWidth = 14; q.beginPath(); q.moveTo(WIN.x + WIN.w / 2, WIN.y); q.lineTo(WIN.x + WIN.w / 2, WIN.y + WIN.h); q.moveTo(WIN.x, WIN.y + WIN.h * .55); q.lineTo(WIN.x + WIN.w, WIN.y + WIN.h * .55); q.stroke();
  if (hook.glow) hook.glow(q, M);
  for (const d of M.parts) { if (d.role === 'desk' && hook.beforeDesk) hook.beforeDesk(q, M); shape(d, C[d.role]); }
  // steam and sleep letters
  for (const s of M.steam) { q.save(); q.globalAlpha = s.a * .8; q.strokeStyle = C.steam; q.lineWidth = 9; q.lineCap = 'round'; q.beginPath(); q.moveTo(s.x, s.y + 60); q.bezierCurveTo(s.x + s.sway, s.y + 30, s.x - s.sway, s.y + 10, s.x + s.sway * .5, s.y - 30); q.stroke(); q.restore(); }
  q.save(); q.fillStyle = C.zz; q.font = `700 40px ${hook.font || 'Helvetica, sans-serif'}`; for (const z of M.zz) { q.globalAlpha = z.a; q.font = `700 ${z.s}px ${hook.font || 'Helvetica, sans-serif'}`; q.fillText('z', z.x, z.y); } q.restore();
  if (hook.after) hook.after(q, M);
}
let GR = null;
function grain(q, amt, t, mode = 'overlay') {
  if (!GR) { GR = off(540, 960); const k = GR.getContext('2d'), im = k.createImageData(540, 960), r = rng(3); for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } k.putImageData(im, 0, 0); }
  q.save(); q.globalAlpha = amt; q.globalCompositeOperation = mode; const o = Math.floor(t * 30) % 4; q.drawImage(GR, -o * 7, -o * 5, W + 40, H + 40); q.restore();
}
const BASE = { wall: '#2A1F5C', sky0: '#141A4A', sky1: '#3B2C7A', moon: '#FFF3C4', city: '#1C1440', lit: '#FFD36B', rain: '#B9C8FF', frame: '#1A1238',
  shirt: '#FF6F91', skin: '#F6C7A8', hair: '#2B1B4D', eye: '#1B1230', mouth: '#7A2E4A', cheek: '#FF9FB0', laptop: '#C9CFEA', logo: '#FFFFFF', desk: '#6B4A9E', deskEdge: '#8A68C0', laptopBase: '#9AA0C8',
  mug: '#FFC24B', mugHandle: '#FFC24B', cat: '#FF9F5A', catTail: '#FF9F5A', catEye: '#3A1F1A', steam: '#FFFFFF', zz: '#FFFFFF' };
const S = {};

// 1. Whiteboard: black marker linework, violet accent; a looping annotation draws on and wipes off
S.whiteboard = (t) => {
  const M = model(t), wob = rng(1 + Math.floor(t * 8) % 24);
  const C = Object.fromEntries(Object.keys(BASE).map(k => [k, '#1A1A1A']));
  Object.assign(C, { wall: '#FBFBF8', sky0: '#FBFBF8', sky1: '#FBFBF8', moon: '#7C3AED', lit: '#7C3AED', rain: '#7C3AED', steam: '#7C3AED', zz: '#7C3AED', city: 'rgba(0,0,0,0)' });
  paint(g, M, C, { font: '"Chalkboard SE", "Comic Sans MS", sans-serif', shape(q, d, col) { trace(q, d); q.save(); const j = (wob() - .5) * 3; q.translate(j, -j); q.strokeStyle = col; q.lineWidth = isStroke(d) ? Math.min(d.w, 7) : 6; q.lineJoin = q.lineCap = 'round';
      if (['eye', 'hair', 'logo'].includes(d.role)) { q.fillStyle = d.role === 'logo' ? '#7C3AED' : '#1A1A1A'; q.fill(); } if (d.role === 'shirt') { q.fillStyle = 'rgba(124,58,237,.16)'; q.fill(); } q.stroke(); q.restore(); },
    after(q, M) { const a = t < 1.5 ? ease(t / .9) : 1 - ease((t - 2.4) / .5); q.strokeStyle = '#7C3AED'; q.lineWidth = 8; q.lineCap = 'round';
      q.beginPath(); q.ellipse(870, DESK - 70, 210, 120, -.1, -1.2, -1.2 + TAU * clamp(a)); q.stroke();
      q.globalAlpha = clamp(a); q.fillStyle = '#7C3AED'; q.font = '46px "Chalkboard SE", "Comic Sans MS", sans-serif'; q.fillText('the real boss', 690, DESK + 120); q.globalAlpha = 1; } });
};

// 2. Ukiyo-e: indigo bokashi night, flat blocks, ink outline, Hiroshige rain over everything; figure on threes
S.ukiyoe = (t) => {
  const tf = Math.floor(t * 10) / 10, M = model(tf), Mb = model(t);
  M.rain = Mb.rain; M.steam = Mb.steam;
  const C = Object.assign({}, BASE, { wall: '#E9DCC0', sky0: '#14213D', sky1: '#5A6E9A', moon: '#F2D6A2', city: '#1E2A44', lit: '#E8B04A', rain: '#1E2A44', frame: '#3A2A1E',
    shirt: '#2F5D8A', skin: '#F0D2B0', hair: '#1A1A24', desk: '#8A5A3A', deskEdge: '#A87652', laptop: '#D9C9A8', laptopBase: '#BFAF8E', mug: '#C8102E', mugHandle: '#C8102E', cat: '#E8E0CF', catTail: '#E8E0CF', cheek: '#E89A8A', zz: '#3A2A1E', steam: '#F7F0E2' });
  paint(g, M, C, { font: 'serif', shape(q, d, col) { trace(q, d); q.lineJoin = q.lineCap = 'round'; if (isStroke(d)) { q.strokeStyle = '#1B1724'; q.lineWidth = d.w + 8; q.stroke(); q.strokeStyle = col; q.lineWidth = d.w; q.stroke(); } else { q.fillStyle = col; q.fill(); q.strokeStyle = '#1B1724'; q.lineWidth = 5; q.stroke(); } },
    wall(q) { const gr = q.createLinearGradient(0, 0, 0, 500); gr.addColorStop(0, 'rgba(40,60,110,.55)'); gr.addColorStop(1, 'rgba(40,60,110,0)'); q.fillStyle = gr; q.fillRect(0, 0, W, 500); },
    beforeDesk(q) { q.strokeStyle = 'rgba(60,40,30,.35)'; q.lineWidth = 2; for (let y = DESK + 40; y < H; y += 46) { q.beginPath(); q.moveTo(0, y); q.bezierCurveTo(300, y - 12, 700, y + 12, W, y); q.stroke(); } },
    after(q, M) { q.save(); q.strokeStyle = 'rgba(30,42,68,.45)'; q.lineWidth = 2; const r = rng(4); for (let i = 0; i < 140; i++) { const x = r() * W * 1.3, u = frac(t / .75 + r()); const y = u * (H + 200) - 100; q.beginPath(); q.moveTo(x, y); q.lineTo(x - 26, y + 90); q.stroke(); } q.restore();
      q.fillStyle = '#C8102E'; q.fillRect(930, 110, 90, 90); q.fillStyle = '#F4E7D0'; q.font = 'bold 54px serif'; q.fillText('夜', 948, 175); grain(q, .16, 0); } });
};

// 3. Dark keynote UI: line-art scene on a hairline grid, live cards (focus ring, word count, typing waveform)
S.keynote = (t) => {
  const M = model(t);
  const C = Object.fromEntries(Object.keys(BASE).map(k => [k, '#EDE9FE']));
  Object.assign(C, { wall: '#09070F', sky0: '#120E22', sky1: '#1C1433', city: 'rgba(139,92,246,.25)', lit: '#A78BFA', rain: 'rgba(167,139,250,.6)', frame: 'rgba(255,255,255,.18)', moon: '#A78BFA', steam: 'rgba(237,233,254,.7)', zz: '#A78BFA' });
  paint(g, M, C, { font: '-apple-system, Helvetica, sans-serif',
    wall(q) { q.strokeStyle = 'rgba(255,255,255,.05)'; q.lineWidth = 1; for (let x = 0; x <= W; x += 60) { q.beginPath(); q.moveTo(x, 0); q.lineTo(x, H); q.stroke(); } for (let y = 0; y <= H; y += 60) { q.beginPath(); q.moveTo(0, y); q.lineTo(W, y); q.stroke(); } },
    shape(q, d, col) { trace(q, d); q.lineJoin = q.lineCap = 'round'; if (isStroke(d)) { q.strokeStyle = col; q.lineWidth = Math.min(d.w, 5); q.stroke(); return; }
      q.fillStyle = d.role === 'laptop' ? 'rgba(139,92,246,.22)' : d.role === 'desk' ? '#0E0B18' : d.role === 'eye' || d.role === 'hair' ? '#EDE9FE' : 'rgba(255,255,255,.03)'; q.fill(); q.strokeStyle = d.role === 'desk' || d.role === 'deskEdge' ? 'rgba(255,255,255,.18)' : col; q.lineWidth = 2.5; q.stroke(); },
    glow(q) { q.save(); const rg = q.createRadialGradient(540, 1100, 40, 540, 1100, 520); rg.addColorStop(0, 'rgba(139,92,246,.35)'); rg.addColorStop(1, 'rgba(139,92,246,0)'); q.fillStyle = rg; q.fillRect(0, 600, W, 1100); q.restore(); },
    after(q, M) { const card = (x, y, w, h) => { q.fillStyle = 'rgba(255,255,255,.06)'; q.strokeStyle = 'rgba(255,255,255,.14)'; q.lineWidth = 1.5; q.beginPath(); q.roundRect(x, y, w, h, 24); q.fill(); q.stroke(); };
      card(60, 1540, 300, 300); const p = frac(t / 3); q.strokeStyle = 'rgba(255,255,255,.1)'; q.lineWidth = 14; q.beginPath(); q.arc(210, 1690, 92, 0, TAU); q.stroke();
      q.strokeStyle = '#8B5CF6'; q.lineCap = 'round'; q.beginPath(); q.arc(210, 1690, 92, -Math.PI / 2, -Math.PI / 2 + TAU * (.62 + .08 * Math.sin(TAU * p))); q.stroke();
      q.fillStyle = '#FFF'; q.font = '600 52px -apple-system, Helvetica, sans-serif'; q.textAlign = 'center'; q.fillText('2:41', 210, 1700); q.fillStyle = 'rgba(255,255,255,.55)'; q.font = '500 22px -apple-system, Helvetica, sans-serif'; q.fillText('FOCUS', 210, 1740); q.textAlign = 'left';
      card(390, 1540, 630, 300); q.fillStyle = 'rgba(255,255,255,.55)'; q.font = '500 24px -apple-system, Helvetica, sans-serif'; q.fillText('WRITING SESSION', 430, 1595);
      q.fillStyle = '#FFF'; q.font = '600 64px -apple-system, Helvetica, sans-serif'; q.fillText('1,284', 430, 1670); q.fillStyle = '#A78BFA'; q.font = '500 30px -apple-system, Helvetica, sans-serif'; q.fillText('words', 620, 1670);
      for (let i = 0; i < 26; i++) { const h = 14 + 40 * Math.abs(Math.sin(TAU * (t / .75) + i * .7)) * (.5 + .5 * Math.sin(i * 1.3)); q.fillStyle = i % 5 === 0 ? '#8B5CF6' : 'rgba(167,139,250,.55)'; q.beginPath(); q.roundRect(430 + i * 22, 1770 - h / 2, 12, h, 6); q.fill(); }
      q.fillStyle = '#FFF'; q.font = '600 60px -apple-system, Helvetica, sans-serif'; q.fillText('3:12 AM. Still shipping.', 60, 150); if (frac(t / .5) < .5) q.fillRect(60 + q.measureText('3:12 AM. Still shipping.').width + 8, 100, 5, 62); } });
};

// 4. Stickman storytelling (after the cozy-storytelling grammar of kaomei/stickman-video-director; our own character):
// white circle head with dot eyes, single black line body, stick limbs, white rounded gloves, inside a full-colour
// 2D world drawn with black ink contours and simple cel-shadow patches.
S.stickman = (t) => {
  const M = model(t), INK = '#141414';
  const C = Object.assign({}, BASE, { wall: '#F2C98A', sky0: '#1F3466', sky1: '#4F6DA8', moon: '#FFF2C2', city: '#243A6B', lit: '#FFD36B', rain: '#C9D8FF', frame: '#7A4E2D',
    desk: '#A8673C', deskEdge: '#C98552', mug: '#3FA7A0', mugHandle: '#3FA7A0', cat: '#E9893F', catTail: '#E9893F', catEye: INK, steam: '#FFFFFF', zz: INK });
  const skip = new Set(['shirt', 'skin', 'hair', 'eye', 'mouth', 'cheek', 'laptop', 'logo', 'laptopBase']);
  const glove = (q, x, y, a) => { q.save(); q.translate(x, y); q.rotate(a); q.fillStyle = '#FFFFFF'; q.strokeStyle = INK; q.lineWidth = 6;
    q.beginPath(); q.ellipse(0, 0, 24, 20, 0, 0, TAU); q.fill(); q.stroke(); q.beginPath(); q.ellipse(-20, -10, 10, 8, -.6, 0, TAU); q.fill(); q.stroke();
    q.beginPath(); q.moveTo(-6, 4); q.lineTo(8, 4); q.moveTo(-4, 11); q.lineTo(10, 11); q.lineWidth = 3; q.stroke(); q.restore(); };
  paint(g, M, C, { font: '"Chalkboard SE", "Comic Sans MS", sans-serif',
    shape(q, d, col) { if (skip.has(d.role)) return; trace(q, d); q.lineJoin = q.lineCap = 'round';
      if (isStroke(d)) { q.strokeStyle = INK; q.lineWidth = d.w + 9; q.stroke(); q.strokeStyle = col; q.lineWidth = d.w; q.stroke(); return; }
      q.fillStyle = col; q.fill();
      if (!['deskEdge'].includes(d.role)) { q.save(); q.clip(); const [x, y, w, h] = bbox(d); q.fillStyle = 'rgba(40,20,40,.16)'; q.beginPath(); q.ellipse(x + w * .85, y + h * .95, w * .6, h * .55, 0, 0, TAU); q.fill(); q.restore();
        trace(q, d); q.strokeStyle = INK; q.lineWidth = 6; q.stroke(); } },
    wall(q) { q.fillStyle = 'rgba(120,70,30,.14)'; q.beginPath(); q.moveTo(0, 0); q.lineTo(220, 0); q.lineTo(60, 1400); q.lineTo(0, 1400); q.fill(); },
    glow(q) { const rg = q.createRadialGradient(540, 1180, 40, 540, 1180, 420); rg.addColorStop(0, 'rgba(255,240,200,.55)'); rg.addColorStop(1, 'rgba(255,240,200,0)'); q.fillStyle = rg; q.fillRect(0, 700, W, 900); },
    after(q, M) { const tap = M.type, by = tap * .4, bl = M.blinkK;
      q.lineCap = q.lineJoin = 'round'; q.strokeStyle = INK;
      // body: one black line, stick arms down to the desk, tapping in turn
      q.lineWidth = 9; q.beginPath(); q.moveTo(540, 1092 + by); q.lineTo(540, 1330); q.stroke();
      const hands = [[402, DESK - 8 + Math.max(0, tap) * 2], [678, DESK - 8 + Math.max(0, -tap) * 2]];
      for (const [i, [hx, hy]] of hands.entries()) { const s = i ? 1 : -1; q.lineWidth = 8; q.beginPath(); q.moveTo(540, 1150 + by); q.lineTo(540 + s * 96, 1268); q.lineTo(hx, hy); q.stroke(); }
      // head: plain white circle, dot eyes that blink, a short mouth
      q.fillStyle = '#FFFFFF'; q.lineWidth = 7; q.beginPath(); q.arc(540, 1000 + by, 92, 0, TAU); q.fill(); q.stroke();
      q.fillStyle = INK; for (const ex of [508, 572]) { q.beginPath(); q.ellipse(ex, 995 + by, 8, Math.max(.8, 11 * (1 - bl)), 0, 0, TAU); q.fill(); }
      q.lineWidth = 5; q.beginPath(); q.moveTo(526, 1040 + by); q.quadraticCurveTo(540, 1048 + by, 556, 1040 + by); q.stroke();
      // a low laptop: lid seen from behind, keyboard deck, then the gloves on the deck
      q.fillStyle = '#5C6170'; q.lineWidth = 6; q.beginPath(); q.roundRect(392, 1262, 296, 140, 16); q.fill(); q.stroke();
      q.fillStyle = '#FFE08A'; q.beginPath(); q.arc(540, 1330, 14, 0, TAU); q.fill();
      q.fillStyle = '#8B90A0'; q.beginPath(); q.moveTo(352, DESK - 18); q.lineTo(728, DESK - 18); q.lineTo(752, DESK + 2); q.lineTo(328, DESK + 2); q.closePath(); q.fill(); q.stroke();
      glove(q, hands[0][0], hands[0][1], -.3); glove(q, hands[1][0], hands[1][1], .3);
      // tap marks
      if (tap > 2) { q.lineWidth = 4; for (const a of [-.9, -.5, -.1]) { q.beginPath(); q.moveTo(402 + Math.cos(a - 1.6) * 34, DESK - 30 + Math.sin(a - 1.6) * 34); q.lineTo(402 + Math.cos(a - 1.6) * 50, DESK - 30 + Math.sin(a - 1.6) * 50); q.stroke(); } } } });
};

// 5. Storytime doodle (TheOdd1sOut / Jaiden-style grammar, our own characters): thick boiling outlines, flat fills, dot eyes, handwritten caption
S.doodle = (t) => {
  const M = model(t), boil = rng(5 + Math.floor(t * 8) % 24);
  const C = Object.assign({}, BASE, { wall: '#FFF6E9', sky0: '#2C3E8F', sky1: '#5B7BD6', city: '#22306E', frame: '#FFFFFF', shirt: '#57C4E5', skin: '#FFE0C2', hair: '#3A2A20', desk: '#E9B872', deskEdge: '#D9A35E',
    laptop: '#D8DCE8', laptopBase: '#B9BECF', mug: '#FF6B6B', mugHandle: '#FF6B6B', cat: '#F6A04D', catTail: '#F6A04D', cheek: '#FFB3B3', zz: '#3A2A20', steam: '#B8C2CC' });
  const jit = (d) => { const j = () => (boil() - .5) * 5; if (d.pts) return { ...d, pts: d.pts.map(([x, y]) => [x + j(), y + j()]) }; if (d.cx !== undefined) return { ...d, cx: d.cx + j(), cy: d.cy + j() }; return { ...d, x: d.x + j(), y: d.y + j() }; };
  paint(g, M, C, { font: '"Comic Sans MS", "Chalkboard SE", sans-serif', shape(q, d, col) { const e = jit(d); trace(q, e); q.lineJoin = q.lineCap = 'round';
      if (isStroke(e)) { q.strokeStyle = '#2A2A2A'; q.lineWidth = e.w + 10; q.stroke(); q.strokeStyle = col; q.lineWidth = e.w; q.stroke(); return; }
      q.fillStyle = col; q.fill(); if (!['cheek', 'deskEdge', 'desk'].includes(e.role)) { q.strokeStyle = '#2A2A2A'; q.lineWidth = e.role === 'eye' ? 0 : 9; if (q.lineWidth) q.stroke(); } },
    after(q) { q.save(); q.setTransform(1, 0, 0, 1, 0, 0); q.fillStyle = '#2A2A2A'; q.font = '700 78px "Comic Sans MS", "Chalkboard SE", sans-serif'; q.fillText('me at 3 AM:', 70, 150);
      q.font = '700 46px "Comic Sans MS", "Chalkboard SE", sans-serif'; q.fillText('"just one more paragraph"', 70, 215); q.restore();
      q.save(); q.translate(320, 900); q.rotate(-.12 + .03 * Math.sin(TAU * t / .75)); q.fillStyle = '#FFFFFF'; q.strokeStyle = '#2A2A2A'; q.lineWidth = 6; q.beginPath(); q.roundRect(-150, -60, 170, 76, 30); q.fill(); q.stroke(); q.fillStyle = '#2A2A2A'; q.font = '700 40px "Comic Sans MS", sans-serif'; q.fillText('*tap tap*', -140, -10); q.restore(); } });
};

// 6. Cozy watercolour (lo-fi anime mood): soft washes that bleed past their lines, warm lamp light, paper texture
let PAPER = null;
S.watercolor = (t) => {
  const M = model(t), wr = rng(77);
  if (!PAPER) { PAPER = off(540, 960); const k = PAPER.getContext('2d'), r = rng(8); k.fillStyle = '#F3EBDD'; k.fillRect(0, 0, 540, 960); for (let i = 0; i < 9000; i++) { k.fillStyle = `rgba(120,100,70,${r() * .06})`; k.fillRect(r() * 540, r() * 960, 1 + r() * 2, 1 + r() * 2); } }
  const C = Object.assign({}, BASE, { wall: '#3E3A5E', sky0: '#20305A', sky1: '#6C6AA0', moon: '#FFF0C8', city: '#2A2C4E', lit: '#FFD98A', rain: '#CFD8FF', frame: '#2B2440',
    shirt: '#D9849B', skin: '#F4D1B8', hair: '#3A2E44', desk: '#9A6B4B', deskEdge: '#B88563', laptop: '#C7C9D9', laptopBase: '#A9ABC0', mug: '#E8A54B', mugHandle: '#E8A54B', cat: '#E99A5C', catTail: '#E99A5C', zz: '#FFF0C8', steam: '#FFF6E8' });
  paint(g, M, C, { font: 'Georgia, serif', shape(q, d, col) { q.save(); q.filter = 'blur(1.5px)';
      if (isStroke(d)) { trace(q, d); q.strokeStyle = col; q.globalAlpha = .85; q.lineWidth = d.w; q.lineCap = 'round'; q.stroke(); q.restore(); return; }
      for (let k = 0; k < 3; k++) { q.save(); q.translate((wr() - .5) * 8, (wr() - .5) * 8); trace(q, d); q.globalAlpha = .42; q.fillStyle = col; q.fill(); q.restore(); }
      trace(q, d); q.filter = 'none'; q.globalAlpha = .35; q.strokeStyle = 'rgba(60,40,50,.8)'; q.lineWidth = 2; q.stroke(); q.restore(); },
    glow(q) { q.save(); q.globalCompositeOperation = 'screen'; const rg = q.createRadialGradient(540, 1180, 30, 540, 1180, 640); rg.addColorStop(0, `rgba(255,214,150,${.42 + .04 * Math.sin(TAU * t / 1.5)})`); rg.addColorStop(1, 'rgba(255,214,150,0)'); q.fillStyle = rg; q.fillRect(0, 500, W, 1400); q.restore(); },
    after(q) { q.save(); q.globalCompositeOperation = 'multiply'; q.drawImage(PAPER, 0, 0, W, H); q.restore();
      q.save(); q.globalCompositeOperation = 'screen'; const r = rng(12); for (let i = 0; i < 14; i++) { const x = r() * W, y = 300 + r() * 1300, rad = 20 + r() * 50, a = .08 + .08 * Math.sin(TAU * (t / 3 + r())); q.fillStyle = `rgba(255,220,170,${a})`; q.beginPath(); q.arc(x, y, rad, 0, TAU); q.fill(); } q.restore(); } });
};

// 7. Soft 3D clay: rounded pastel forms shaded with gradients, soft contact shadows, glossy highlights
S.clay = (t) => {
  const M = model(t);
  const C = Object.assign({}, BASE, { wall: '#B9A8F0', sky0: '#5B6BD6', sky1: '#9BB0F5', moon: '#FFF6D6', city: '#6E7CD8', lit: '#FFE39A', rain: '#E4ECFF', frame: '#F4F0FF',
    shirt: '#FF8FB0', skin: '#FFD6BD', hair: '#5A4296', desk: '#F2C59B', deskEdge: '#FFD9B6', laptop: '#E9ECF7', laptopBase: '#D3D7EA', mug: '#7FD8C6', mugHandle: '#7FD8C6', cat: '#FFB073', catTail: '#FFB073', zz: '#FFFFFF', steam: '#FFFFFF' });
  const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = n >> 8 & 255, b = n & 255; const f = v => Math.round(clamp(v * k / 255, 0, 1) * 255); return `rgb(${f(r)},${f(gg)},${f(b)})`; };
  paint(g, M, C, { font: '"Arial Rounded MT Bold", Helvetica, sans-serif', shape(q, d, col) { q.save(); q.lineJoin = q.lineCap = 'round';
      if (isStroke(d)) { trace(q, d); q.shadowColor = 'rgba(60,30,90,.35)'; q.shadowBlur = 14; q.shadowOffsetY = 8; q.strokeStyle = col; q.lineWidth = d.w + 4; q.stroke(); q.restore(); return; }
      const [x, y, w, h] = bbox(d); if (!['desk', 'deskEdge'].includes(d.role)) { q.shadowColor = 'rgba(60,30,90,.35)'; q.shadowBlur = 24; q.shadowOffsetY = 14; }
      const gr = q.createRadialGradient(x + w * .32, y + h * .25, Math.max(4, Math.min(w, h) * .05), x + w * .5, y + h * .5, Math.max(w, h) * .75);
      gr.addColorStop(0, shade(col, 1.18)); gr.addColorStop(.55, col); gr.addColorStop(1, shade(col, .72)); trace(q, d); q.fillStyle = gr; q.fill(); q.restore();
      if (w > 40 && h > 30 && !['desk', 'deskEdge'].includes(d.role)) { q.save(); q.globalAlpha = .5; q.fillStyle = '#FFFFFF'; q.beginPath(); q.ellipse(x + w * .3, y + h * .22, w * .12, h * .07, -.5, 0, TAU); q.fill(); q.restore(); } },
    after(q) { grain(q, .05, 0, 'soft-light'); } });
};

window.renderFrame = (f) => { const t = ((f - 1) / FPS) % DUR; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowBlur = 0; g.filter = 'none'; if (['whiteboard', 'ukiyoe', 'doodle', 'watercolor', 'clay', 'stickman'].includes(STYLE)) { g.translate(540, 0); g.scale(1.18, 1.18); g.translate(-540, 0); } S[STYLE](t); };
window.ready = true;
})();
