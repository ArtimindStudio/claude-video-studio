// Shared 5 s test scene for the Claude video style library.
// One subject in every style: a cyclist rides straight at the camera at sunset while the world streams past.
// (Scene idea after a front-view cycling loop on Pinterest; geometry, timing and art are our own.)
// The picture is a pure function of time: renderFrame(f) draws frame f from nothing. Loop period 5 s.
(() => {
const W = 1080, H = 1920, FPS = 30, DUR = 5, HZ = 1060, CX = 540;
const STYLE = window.STYLE || 'glowflat';
const c = document.createElement('canvas'); c.width = W; c.height = H; document.body.appendChild(c);
document.body.style.margin = '0';
const g = c.getContext('2d');
const TAU = Math.PI * 2;
const frac = x => x - Math.floor(x);
const clamp = (x, a = 0, b = 1) => Math.min(Math.max(x, a), b);
const ease = x => 1 - Math.pow(1 - clamp(x), 3);
function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const off = (w, h) => { const k = document.createElement('canvas'); k.width = w; k.height = h; return k; };

// ---------- static world, built once ----------
const R = rng(7);
const SKY = [];  // skyline blocks along the horizon
for (let x = 40; x < 1040;) { const w = 26 + R() * 60, h = 40 + R() * 150 * (1 - Math.abs(x - CX) / 700); SKY.push({ x, w, h }); x += w + 2; }

// ---------- the scene model: everything as parts with roles ----------
function model(t) {
  const p = TAU * 1.6 * t;              // 8 pedal turns in 5 s: loops cleanly
  const bob = 5 * Math.sin(2 * p);
  const P = [];
  const add = (role, type, d, z = 5) => P.push(Object.assign({ role, type, z }, d));
  // trees pass on both sides, growing as they near the camera (period 1.25 s)
  const trees = [];
  for (let k = 0; k < 5; k++) for (const side of [-1, 1]) {
    const u = frac(t / 1.25 + k / 5 + (side > 0 ? 0.1 : 0));
    const s = 0.35 + u * u * 2.4, x = CX + side * (150 + u * u * 760), y = HZ + 8 + u * 140;
    trees.push({ u, s, x, y, side });
  }
  trees.sort((a, b) => a.u - b.u);
  // road dashes rushing toward the camera (period 1 s)
  const dashes = [];
  for (let i = 0; i < 7; i++) { const v = frac(t + i / 7); const y0 = HZ + 20 + v * v * 880, len = 8 + v * v * 120, w = 4 + v * 34; dashes.push({ v, y0, len, w }); }
  // cyclist (front view)
  const by = bob;
  add('helmet', 'poly', { pts: [[478, 690 + by], [492, 640 + by], [540, 622 + by], [588, 640 + by], [602, 690 + by]] }, 9);
  add('skin', 'circle', { cx: 540, cy: 702 + by, r: 46 }, 8);
  add('glasses', 'poly', { pts: [[500, 694 + by], [580, 694 + by], [578, 714 + by], [544, 714 + by], [540, 704 + by], [536, 714 + by], [502, 714 + by]] }, 9);
  add('jersey', 'poly', { pts: [[452, 778 + by], [628, 778 + by], [604, 900 + by], [476, 900 + by]] }, 7);
  add('jerseyShade', 'poly', { pts: [[540, 778 + by], [628, 778 + by], [604, 900 + by], [540, 900 + by]] }, 7.1);
  for (const s of [-1, 1]) {
    const sh = [CX + s * 82, 790 + by], el = [CX + s * 128, 846 + by], hd = [CX + s * 132, 884];
    add('skin', 'line', { pts: [sh, el, hd], w: 30 }, 6.5);
    add('sleeve', 'line', { pts: [sh, [CX + s * 102, 818 + by]], w: 38 }, 7.2);
  }
  add('bar', 'line', { pts: [[400, 886], [680, 886]], w: 12 }, 6);
  add('bar', 'line', { pts: [[540, 886], [540, 930]], w: 12 }, 6);
  // legs: knees out, feet circle with the cranks, left and right half a turn apart
  for (const s of [-1, 1]) {
    const ph = p + (s > 0 ? Math.PI : 0);
    const hip = [CX + s * 34, 904 + by], foot = [CX + s * 40, 1010 + 48 * Math.sin(ph)];
    const knee = [CX + s * (70 + 10 * Math.cos(ph)), 960 + 30 * Math.sin(ph) + by * 0.5];
    add('shorts', 'line', { pts: [hip, [(hip[0] + knee[0]) / 2, (hip[1] + knee[1]) / 2]], w: 46 }, 6.8);
    add('skin', 'line', { pts: [hip, knee, foot], w: 34 }, 6.6);
    add('shoe', 'poly', { pts: [[foot[0] - 22, foot[1] - 6], [foot[0] + 22, foot[1] - 6], [foot[0] + 18, foot[1] + 16], [foot[0] - 18, foot[1] + 16]] }, 6.9);
  }
  add('tire', 'ellipse', { cx: 540, cy: 1068, rx: 16, ry: 120 }, 5.5);
  add('bar', 'line', { pts: [[540, 930], [540, 1000]], w: 10 }, 5.6);
  const K = 1.55, GY = 1188, NY = 1330;
  const T = (x, y) => [CX + (x - CX) * K, NY + (y - GY) * K];
  for (const d of P) {
    if (d.pts) d.pts = d.pts.map(([x, y]) => T(x, y));
    if (d.cx !== undefined) { [d.cx, d.cy] = T(d.cx, d.cy); }
    if (d.r) d.r *= K; if (d.rx) { d.rx *= K; d.ry *= K; } if (d.w) d.w *= K;
  }
  return { t, p, bob, trees, dashes, T, K, parts: P.sort((a, b) => a.z - b.z) };
}

// ---------- drawing helpers ----------
function pathPart(q, d) {
  q.beginPath();
  if (d.type === 'poly') { d.pts.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y)); q.closePath(); }
  else if (d.type === 'circle') q.arc(d.cx, d.cy, d.r, 0, TAU);
  else if (d.type === 'ellipse') q.ellipse(d.cx, d.cy, d.rx, d.ry, 0, 0, TAU);
  else if (d.type === 'line') d.pts.forEach(([x, y], i) => i ? q.lineTo(x, y) : q.moveTo(x, y));
}
function drawPart(q, d, fill, stroke, lw) {
  pathPart(q, d);
  if (d.type === 'line') { q.lineCap = 'round'; q.lineJoin = 'round'; q.strokeStyle = fill; q.lineWidth = d.w; q.stroke(); if (stroke) { q.save(); q.globalCompositeOperation = 'destination-over'; q.strokeStyle = stroke; q.lineWidth = d.w + lw * 2; q.stroke(); q.restore(); } return; }
  if (fill) { q.fillStyle = fill; q.fill(); }
  if (stroke) { q.strokeStyle = stroke; q.lineWidth = lw; q.lineJoin = 'round'; q.stroke(); }
}
function tree(q, tr, fill, trunk, stroke, lw) {
  const { x, y, s } = tr;
  q.fillStyle = trunk; q.fillRect(x - 6 * s, y - 40 * s, 12 * s, 40 * s);
  q.beginPath(); q.arc(x, y - 70 * s, 38 * s, 0, TAU); q.arc(x - 28 * s, y - 48 * s, 26 * s, 0, TAU); q.arc(x + 28 * s, y - 48 * s, 26 * s, 0, TAU);
  q.fillStyle = fill; q.fill(); if (stroke) { q.strokeStyle = stroke; q.lineWidth = lw; q.stroke(); }
}
function road(q, fill) { q.beginPath(); q.moveTo(CX - 26, HZ); q.lineTo(CX + 26, HZ); q.lineTo(W + 120, H); q.lineTo(-120, H); q.closePath(); q.fillStyle = fill; q.fill(); }
function skyline(q, fill, stroke, lw) { q.beginPath(); for (const b of SKY) q.rect(b.x, HZ - b.h, b.w, b.h + 2); q.fillStyle = fill; q.fill(); if (stroke) { q.strokeStyle = stroke; q.lineWidth = lw; q.stroke(); } }
function shadow(q, M, col, alpha) { q.save(); q.globalAlpha = alpha; q.translate(0, 1336); q.scale(1, -0.5); q.translate(0, -1336); for (const d of M.parts) drawPart(q, d, col); q.restore(); }
let GRAIN = null;
function grain(q, amt, t) {
  if (!GRAIN) { GRAIN = off(540, 960); const k = GRAIN.getContext('2d'), im = k.createImageData(540, 960), r = rng(3); for (let i = 0; i < im.data.length; i += 4) { const v = r() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } k.putImageData(im, 0, 0); }
  q.save(); q.globalAlpha = amt; q.globalCompositeOperation = 'overlay'; const o = Math.floor(t * 30) % 4; q.drawImage(GRAIN, -o * 7, -o * 5, W + 40, H + 40); q.restore();
}

// ---------- a flat base render, shared by several styles ----------
const BASE = { sky0: '#6D3CF0', sky1: '#3A1C9A', sun: '#FFF6E8', city: '#2B1474', road: '#3A1F8F', dash: '#1A0B4D', tree: '#2B1474', trunk: '#1A0B4D',
  helmet: '#1B1B2F', skin: '#F2A27E', glasses: '#FFD34D', jersey: '#FF3C78', jerseyShade: '#D9245E', sleeve: '#FF3C78', shorts: '#1B1B2F', shoe: '#FFD34D', bar: '#1B1B2F', tire: '#1B1B2F' };
function flat(q, M, C = BASE, opt = {}) {
  const gr = q.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, C.sky0); gr.addColorStop(1, C.sky1);
  q.fillStyle = gr; q.fillRect(0, 0, W, H);
  if (opt.glow) { const rg = q.createRadialGradient(CX, HZ, 200, CX, HZ, 760); rg.addColorStop(0, 'rgba(255,240,255,.55)'); rg.addColorStop(1, 'rgba(255,240,255,0)'); q.fillStyle = rg; q.fillRect(0, 0, W, H); }
  q.beginPath(); q.arc(CX, HZ, 330, Math.PI, 0); q.fillStyle = C.sun; q.fill();
  skyline(q, C.city, opt.stroke, opt.lw);
  q.fillStyle = C.sky1; q.fillRect(0, HZ, W, H - HZ); road(q, C.road);
  for (const d of M.dashes) { q.fillStyle = C.dash; q.fillRect(CX - d.w / 2, d.y0, d.w, d.len); }
  if (!opt.noShadow) shadow(q, M, C.dash, 0.55);
  for (const tr of M.trees) if (tr.u < 0.5) tree(q, tr, C.tree, C.trunk, opt.stroke, opt.lw);
  for (const d of M.parts) drawPart(q, d, C[d.role], opt.stroke, opt.lw);
  for (const tr of M.trees) if (tr.u >= 0.5) tree(q, tr, C.tree, C.trunk, opt.stroke, opt.lw);
}

// ---------- the ten styles ----------
const S = {};

// 1. Whiteboard draw-on: black marker on white, one violet accent, drawn line by line in the first 1.6 s
S.whiteboard = (t) => {
  const M = model(t), wob = rng(11);
  g.fillStyle = '#FBFBF8'; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(0,0,0,.03)'; for (let i = 0; i < 6; i++) g.fillRect(0, 300 * i + 120, W, 2);
  const reveal = ease(t / 1.6);
  const marker = (fn, k, col = '#1A1A1A', lw = 7) => { if (k > reveal) return; g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = g.lineJoin = 'round';
    const a = clamp((reveal - k) / 0.12); g.globalAlpha = a; fn(); g.restore(); };
  marker(() => { g.beginPath(); g.arc(CX, HZ, 330, Math.PI, 0); g.stroke(); for (let i = 0; i < 9; i++) { const a = Math.PI + (i + .5) * Math.PI / 9; g.beginPath(); g.moveTo(CX + Math.cos(a) * 360, HZ + Math.sin(a) * 360); g.lineTo(CX + Math.cos(a) * 420, HZ + Math.sin(a) * 420); g.stroke(); } }, 0.0, '#7C3AED', 7);
  marker(() => { g.beginPath(); g.moveTo(30, HZ); g.lineTo(1050, HZ); g.stroke(); g.beginPath(); for (const b of SKY) { g.moveTo(b.x, HZ); g.lineTo(b.x, HZ - b.h); g.lineTo(b.x + b.w, HZ - b.h); g.lineTo(b.x + b.w, HZ); } g.lineWidth = 3; g.stroke(); }, 0.12);
  marker(() => { g.beginPath(); g.moveTo(CX - 26, HZ); g.lineTo(-120, H); g.moveTo(CX + 26, HZ); g.lineTo(W + 120, H); g.stroke(); for (const d of M.dashes) { g.beginPath(); g.moveTo(CX, d.y0); g.lineTo(CX, d.y0 + d.len); g.lineWidth = 3 + d.v * 8; g.stroke(); } }, 0.25);
  marker(() => { for (const tr of M.trees) { const { x, y, s } = tr; g.lineWidth = 2 + s * 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 40 * s); g.stroke(); g.beginPath(); g.arc(x, y - 70 * s, 38 * s, 0, TAU); g.stroke(); } }, 0.35);
  marker(() => { for (const d of M.parts) { pathPart(g, d); const j = (wob() - .5) * 2; g.save(); g.translate(j, -j); if (d.type === 'line') { g.lineWidth = 6; } g.stroke(); g.restore(); } }, 0.5);
  marker(() => { pathPart(g, M.parts.find(d => d.role === 'jersey')); g.fillStyle = 'rgba(124,58,237,.22)'; g.fill(); }, 0.8);
  marker(() => { g.font = 'italic 46px "Comic Sans MS", "Chalkboard SE", sans-serif'; g.fillStyle = '#1A1A1A'; g.fillText('96 rpm', 790, 1250); g.beginPath(); g.moveTo(780, 1238); g.quadraticCurveTo(720, 1230, 660, 1260); g.lineWidth = 4; g.stroke(); }, 0.9);
};

// 2. Ukiyo-e woodblock: bokashi sky, flat blocks, carved ink outline, paper grain; figure on threes
S.ukiyoe = (t) => {
  const tf = Math.floor(t * 10) / 10, M = model(tf), Mbg = model(t);
  const sky = g.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, '#1F3A6B'); sky.addColorStop(0.45, '#E9C9A0'); sky.addColorStop(1, '#E6743C');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,248,235,.75)'; for (const [y, x0, w] of [[300, 80, 520], [380, 520, 460], [540, 40, 380]]) { const xs = x0 + 40 * Math.sin(t * TAU / 5); g.beginPath(); g.roundRect(xs, y, w, 34, 17); g.fill(); g.beginPath(); g.roundRect(xs + 60, y - 30, w * 0.5, 30, 15); g.fill(); }
  g.beginPath(); g.arc(CX, HZ, 300, Math.PI, 0); g.fillStyle = '#D9342B'; g.fill();
  skyline(g, '#2D2A4A', '#141224', 3);
  g.fillStyle = '#3B5E7A'; g.fillRect(0, HZ, W, H - HZ);
  // seigaiha waves on the ground, rolling toward the viewer
  g.strokeStyle = '#E8DCC2'; g.lineWidth = 3;
  for (let row = 0; row < 14; row++) { const v = frac(row / 14 + t / 2.5), y = HZ + 20 + v * v * 900, r = 10 + v * 60; for (let x = -r + ((row % 2) * r); x < W + r; x += r * 2) { for (let k = 3; k > 0; k--) { g.beginPath(); g.arc(x, y, r * k / 3, Math.PI, 0); g.stroke(); } } }
  road(g, '#C9A66B'); for (const d of Mbg.dashes) { g.fillStyle = '#5A3A22'; g.fillRect(CX - d.w / 2, d.y0, d.w, d.len); }
  const C = Object.assign({}, BASE, { helmet: '#1F1D2B', skin: '#F0D2B0', glasses: '#1F1D2B', jersey: '#2F5D8A', jerseyShade: '#244A70', sleeve: '#2F5D8A', shorts: '#1F1D2B', shoe: '#D9342B', bar: '#1F1D2B', tire: '#1F1D2B' });
  for (const tr of Mbg.trees) tree(g, tr, '#2E4F3A', '#3A2618', '#141224', 3);
  for (const d of M.parts) drawPart(g, d, C[d.role], '#141224', 5);
  g.fillStyle = '#D9342B'; g.fillRect(900, 120, 90, 90); g.fillStyle = '#F4E7D0'; g.font = 'bold 40px serif'; g.fillText('走', 925, 180);
  grain(g, 0.18, 0);
};

// 3. Stained glass: the flat scene sampled into lead-lined panes; on twos; light sweeps across
let SG = null;
S.stainedglass = (t) => {
  const tf = Math.floor(t * 15) / 15, M = model(tf), sw = 270, sh = 480;
  if (!SG) { const r = rng(21), sites = []; for (let i = 0; i < 520; i++) { let x = r() * sw, y = r() * sh; if (i < 220) { x = 90 + r() * 90; y = 140 + r() * 170; } sites.push([x, y]); }
    const idx = new Int16Array(sw * sh); for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { let b = 0, bd = 1e9; for (let i = 0; i < sites.length; i++) { const dx = sites[i][0] - x, dy = sites[i][1] - y, d = dx * dx + dy * dy; if (d < bd) { bd = d; b = i; } } idx[y * sw + x] = b; }
    SG = { sites, idx, lo: off(sw, sh), out: off(sw, sh) }; }
  const k = SG.lo.getContext('2d'); k.save(); k.scale(sw / W, sh / H);
  flat(k, M, Object.assign({}, BASE, { sky0: '#1E4FA8', sky1: '#5C2C9E', sun: '#FFC93C', city: '#2E7D4F', road: '#8A3A2E', dash: '#F2D16B', tree: '#2E9E5B', trunk: '#6B3A1E', jersey: '#E8402F', jerseyShade: '#B92E22', sleeve: '#E8402F' }), { noShadow: true });
  k.restore();
  const src = k.getImageData(0, 0, sw, sh).data, ok = SG.out.getContext('2d'), im = ok.createImageData(sw, sh), o = im.data;
  const col = SG.sites.map(([x, y]) => { const i = (Math.floor(y) * sw + Math.floor(x)) * 4; return [src[i], src[i + 1], src[i + 2]]; });
  const sweep = frac(t / 5) * (sw + sh) - sh;
  for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) { const p = y * sw + x, s = SG.idx[p], j = p * 4;
    const edge = (x < sw - 1 && SG.idx[p + 1] !== s) || (y < sh - 1 && SG.idx[p + sw] !== s);
    if (edge) { o[j] = o[j + 1] = o[j + 2] = 18; o[j + 3] = 255; continue; }
    const lit = Math.exp(-Math.pow((x + y - sweep - sh) / 60, 2)) * 70, c = col[s];
    o[j] = Math.min(255, c[0] * 0.9 + lit); o[j + 1] = Math.min(255, c[1] * 0.9 + lit); o[j + 2] = Math.min(255, c[2] * 0.9 + lit); o[j + 3] = 255; }
  ok.putImageData(im, 0, 0);
  g.fillStyle = '#0D0D10'; g.fillRect(0, 0, W, H); g.imageSmoothingEnabled = true; g.drawImage(SG.out, 0, 0, W, H);
  const GL = { skin: '#F6B48C', sleeve: '#E8402F', shorts: '#2A2A6A', bar: '#2A2A6A', jersey: '#E8402F', jerseyShade: '#B92E22', helmet: '#2A2A6A', glasses: '#FFC93C', shoe: '#FFC93C', tire: '#2A2A6A' };
  for (const d of M.parts) { pathPart(g, d); g.lineJoin = g.lineCap = 'round';
    if (d.type === 'line') { g.strokeStyle = '#141216'; g.lineWidth = d.w + 14; g.stroke(); g.strokeStyle = GL[d.role]; g.lineWidth = d.w; g.stroke(); }
    else { g.fillStyle = GL[d.role]; g.fill(); g.strokeStyle = '#141216'; g.lineWidth = 9; g.stroke(); } }
  // arched window frame
  g.save(); g.beginPath(); g.rect(0, 0, W, H); g.moveTo(70, H - 60); g.lineTo(70, 520); g.arc(CX, 520, 470, Math.PI, 0); g.lineTo(1010, H - 60); g.closePath();
  g.fillStyle = '#16141A'; g.fill('evenodd'); g.restore();
  g.strokeStyle = '#3A3530'; g.lineWidth = 14; g.beginPath(); g.moveTo(70, H - 60); g.lineTo(70, 520); g.arc(CX, 520, 470, Math.PI, 0); g.lineTo(1010, H - 60); g.closePath(); g.stroke();
};

// 4. 8-bit pixel art: the scene drawn at 180x320, palette-snapped, stepped at 12 fps, scaled up hard
let PX = null;
const PAL = [[20, 12, 40], [58, 28, 120], [110, 60, 230], [255, 246, 220], [255, 60, 120], [200, 36, 90], [242, 162, 126], [255, 210, 77], [40, 20, 90], [27, 27, 47], [90, 200, 120], [255, 255, 255]];
S.pixel = (t) => {
  const tf = Math.floor(t * 12) / 12, M = model(tf), pw = 180, ph = 320;
  if (!PX) PX = off(pw, ph); const k = PX.getContext('2d'); k.imageSmoothingEnabled = false;
  k.save(); k.scale(pw / W, ph / H); flat(k, M, Object.assign({}, BASE, { tree: '#2C6E49', trunk: '#3A2618' }), {}); k.restore();
  const im = k.getImageData(0, 0, pw, ph), d = im.data;
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < ph; y++) for (let x = 0; x < pw; x++) { const i = (y * pw + x) * 4, b = (bayer[(y % 4) * 4 + x % 4] / 16 - .5) * 28;
    let best = 0, bd = 1e9; for (let p = 0; p < PAL.length; p++) { const dr = d[i] + b - PAL[p][0], dg = d[i + 1] + b - PAL[p][1], db = d[i + 2] + b - PAL[p][2], dd = dr * dr + dg * dg + db * db; if (dd < bd) { bd = dd; best = p; } }
    d[i] = PAL[best][0]; d[i + 1] = PAL[best][1]; d[i + 2] = PAL[best][2]; }
  k.putImageData(im, 0, 0);
  g.imageSmoothingEnabled = false; g.drawImage(PX, 0, 0, W, H);
  // HUD box in pixel type
  g.fillStyle = '#140C28'; g.fillRect(60, 1620, 960, 170); g.strokeStyle = '#FFF6DC'; g.lineWidth = 6; g.strokeRect(72, 1632, 936, 146);
  g.fillStyle = '#FFF6DC'; g.font = 'bold 54px "Courier New", monospace'; const msg = 'RIDE INTO THE SUN...'; g.fillText(msg.slice(0, Math.floor(clamp(t / 2.5) * msg.length)), 110, 1722);
  for (let i = 0; i < 3; i++) { g.fillStyle = (Math.floor(t * 4) % 2 && i === 2) ? '#5A2B8A' : '#FF3C78'; g.fillRect(820 + i * 54, 70, 42, 36); }
};

// 5. Red papercut: one red on warm paper; the cut is the drawing; layered shadows
S.papercut = (t) => {
  const M = model(t), RED = '#C8102E';
  g.fillStyle = '#F4E6CC'; g.fillRect(0, 0, W, H); grain(g, 0.12, 0);
  const layer = (fn, dy) => { g.save(); g.shadowColor = 'rgba(80,20,10,.35)'; g.shadowBlur = 14; g.shadowOffsetY = dy; fn(); g.restore(); };
  layer(() => { g.beginPath(); g.arc(CX, HZ, 330, Math.PI, 0); g.fillStyle = RED; g.fill();
    g.globalCompositeOperation = 'destination-out'; for (let ring = 0; ring < 4; ring++) for (let i = 0; i < 18 + ring * 6; i++) { const a = Math.PI + (i + .5) * Math.PI / (18 + ring * 6), r = 90 + ring * 60; g.beginPath(); g.ellipse(CX + Math.cos(a) * r, HZ - 8 + Math.sin(a) * r, 7, 16, a + Math.PI / 2, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over'; }, 6);
  layer(() => { skyline(g, RED); g.globalCompositeOperation = 'destination-out'; for (const b of SKY) for (let y = HZ - b.h + 12; y < HZ - 10; y += 22) for (let x = b.x + 6; x < b.x + b.w - 8; x += 14) g.fillRect(x, y, 6, 9); g.globalCompositeOperation = 'source-over'; }, 5);
  layer(() => { g.fillStyle = RED; g.fillRect(0, HZ, W, 18); road(g, RED); g.globalCompositeOperation = 'destination-out'; for (const d of M.dashes) g.fillRect(CX - d.w / 2, d.y0, d.w, d.len); g.globalCompositeOperation = 'source-over'; }, 4);
  layer(() => { for (const tr of M.trees) { tree(g, tr, RED, RED); g.globalCompositeOperation = 'destination-out'; const { x, y, s } = tr; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(x - 20 * s + i * 10 * s, y - 64 * s, 3 * s, 9 * s, 0, 0, TAU); g.fill(); } g.globalCompositeOperation = 'source-over'; } }, 8);
  for (const d of M.parts) drawPart(g, d, '#F4E6CC', '#F4E6CC', 14);
  layer(() => { for (const d of M.parts) drawPart(g, d, RED); g.globalCompositeOperation = 'destination-out';
    const dia = (x, y, r) => { const [X, Y] = M.T(x, y + M.bob); g.beginPath(); g.moveTo(X, Y - r); g.lineTo(X + r, Y); g.lineTo(X, Y + r); g.lineTo(X - r, Y); g.fill(); };
    for (let y = 806; y < 892; y += 26) for (let x = 488; x < 596; x += 26) dia(x, y, 12);
    for (const x of [520, 560]) { const [X, Y] = M.T(x, 704 + M.bob); g.beginPath(); g.ellipse(X, Y, 17, 10, 0, 0, TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over'; }, 10);
  // scalloped paper border
  g.fillStyle = RED; for (let x = 0; x < W; x += 40) { g.beginPath(); g.arc(x + 20, 20, 22, 0, Math.PI); g.fill(); g.beginPath(); g.arc(x + 20, H - 20, 22, Math.PI, 0); g.fill(); }
};

// 6. Glow flat vector: violet night, two-tone shapes, glowing sun, grain (closest to the reference)
S.glowflat = (t) => {
  const M = model(t);
  flat(g, M, BASE, { glow: true });
  g.save(); g.globalCompositeOperation = 'screen'; for (let i = 0; i < 3; i++) { const u = frac(t / 2.5 + i / 3), y = 300 + i * 160; g.strokeStyle = `rgba(255,220,255,${0.35 * Math.sin(u * Math.PI)})`; g.lineWidth = 4; g.beginPath(); g.moveTo(120 + u * 900, y); g.lineTo(-80 + u * 900, y + 70); g.stroke(); } g.restore();
  grain(g, 0.10, t);
};

// 7. Dark keynote UI: near-black, hairline grid, the rider as clean line art, live metrics on cards
S.keynote = (t) => {
  const M = model(t);
  const bg = g.createRadialGradient(CX, 900, 100, CX, 900, 1300); bg.addColorStop(0, '#1C1430'); bg.addColorStop(1, '#07060B'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,.05)'; g.lineWidth = 1; for (let x = 0; x <= W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 0; y <= H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.save(); g.shadowColor = 'rgba(124,58,237,.9)'; g.shadowBlur = 40; g.beginPath(); g.arc(CX, HZ, 330, Math.PI, 0); g.strokeStyle = '#8B5CF6'; g.lineWidth = 3; g.stroke(); g.restore();
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(40, HZ); g.lineTo(1040, HZ); g.stroke();
  g.beginPath(); g.moveTo(CX - 26, HZ); g.lineTo(-120, H); g.moveTo(CX + 26, HZ); g.lineTo(W + 120, H); g.stroke();
  for (const d of M.dashes) { g.fillStyle = `rgba(139,92,246,${0.3 + d.v * .7})`; g.fillRect(CX - d.w / 6, d.y0, d.w / 3, d.len); }
  for (const d of M.parts) { pathPart(g, d); if (d.type === 'line') { g.strokeStyle = '#F5F3FF'; g.lineWidth = d.w * 0.22; g.lineCap = 'round'; g.stroke(); } else { g.fillStyle = d.role === 'jersey' ? 'rgba(139,92,246,.35)' : 'rgba(255,255,255,.04)'; g.fill(); g.strokeStyle = '#F5F3FF'; g.lineWidth = 3; g.stroke(); } }
  const card = (x, y, w, h, k, label, val, unit) => { const a = ease((t - k) / 0.5); if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(0, (1 - a) * 30);
    g.fillStyle = 'rgba(255,255,255,.06)'; g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 1.5; g.beginPath(); g.roundRect(x, y, w, h, 22); g.fill(); g.stroke();
    g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '500 26px -apple-system, Helvetica, sans-serif'; g.fillText(label, x + 28, y + 48);
    g.fillStyle = '#FFFFFF'; g.font = '600 72px -apple-system, Helvetica, sans-serif'; g.fillText(val, x + 26, y + 130); const vw = g.measureText(val).width;
    g.fillStyle = '#A78BFA'; g.font = '500 30px -apple-system, Helvetica, sans-serif'; g.fillText(unit, x + 36 + vw, y + 130); g.restore(); };
  card(60, 1330, 450, 170, 0.3, 'SPEED', (24 + 8 * ease((t - .3) / 2)).toFixed(1), 'km/h');
  card(570, 1330, 450, 170, 0.6, 'CADENCE', String(Math.round(96 * ease((t - .6) / 1.5))), 'rpm');
  card(60, 1540, 960, 170, 0.9, 'GOLDEN HOUR', (6.2 * ease((t - .9) / 3)).toFixed(1), 'km to the sun');
  g.fillStyle = '#FFFFFF'; g.font = '600 64px -apple-system, Helvetica, sans-serif'; g.globalAlpha = ease(t / .6); g.fillText('Ride the light.', 60, 200); g.globalAlpha = 1;
};

// 8. Visual journalism collage: a halftone print on a dark desk, red ring, highlighter, source tag
let HT = null;
S.journal = (t) => {
  const M = model(t);
  g.fillStyle = '#111013'; g.fillRect(0, 0, W, H); grain(g, 0.15, t);
  if (!HT) HT = off(W, H); const k = HT.getContext('2d'); flat(k, M, BASE, {});
  const px = k.getImageData(0, 0, W, H).data;
  const push = 1 + 0.04 * t / 5;
  g.save(); g.translate(CX, 900); g.scale(push, push); g.rotate(-0.035); g.translate(-CX, -900);
  g.fillStyle = '#EDE7DA'; g.fillRect(100, 300, 880, 1180);
  g.save(); g.beginPath(); g.rect(140, 340, 800, 1020); g.clip(); g.fillStyle = '#EDE7DA'; g.fillRect(140, 340, 800, 1020); g.fillStyle = '#16141A';
  const step = 12; for (let y = 340; y < 1360; y += step) for (let x = 140; x < 940; x += step) { const sx = Math.round((x - 140) / 800 * W), sy = Math.round((y - 340) / 1020 * H * 0.86 + 150); const i = (sy * W + sx) * 4; const lum = (px[i] * .3 + px[i + 1] * .59 + px[i + 2] * .11) / 255; const r = (1 - lum) * step * 0.62; if (r > .4) { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); } }
  g.restore();
  g.fillStyle = '#16141A'; g.font = '600 30px "Barlow Condensed", "Arial Narrow", sans-serif'; g.fillText('FIG. 1 — A RIDER AT GOLDEN HOUR', 140, 1420);
  g.restore();
  // highlighter sweep on the key line
  const hl = ease((t - 1.6) / 0.6); g.fillStyle = 'rgba(255,230,0,.85)'; g.fillRect(70, 1540, 940 * hl, 64);
  g.fillStyle = '#F5F3EE'; g.font = '700 54px "Arial Narrow", sans-serif'; g.fillText('96 PEDAL TURNS A MINUTE', 90, 1590);
  g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '24px "IBM Plex Mono", Menlo, monospace'; g.fillText('SOURCE: ILLUSTRATION · AIARTIMIND', 90, 1660);
  // red ring drawn around the rider, then a dashed leader to the note
  const ring = ease((t - 0.6) / 0.8); g.strokeStyle = '#E3262B'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.ellipse(CX, 900, 250, 330, -0.08, -Math.PI / 2, -Math.PI / 2 + TAU * ring); g.stroke();
  if (t > 1.4) { g.setLineDash([16, 14]); g.lineWidth = 4; g.beginPath(); g.moveTo(760, 700); g.lineTo(760 + 160 * ease((t - 1.4) / .5), 520); g.stroke(); g.setLineDash([]); }
  g.fillStyle = '#E3262B'; g.font = '700 40px "Arial Narrow", sans-serif'; g.globalAlpha = ease((t - 1.9) / .4); g.fillText('HEADS INTO THE LIGHT', 600, 490); g.globalAlpha = 1;
};

// 9. Kinetic poster type: huge words slam on the beat over solid fields; the rider stays in front
S.kinetic = (t) => {
  const M = model(t), beat = 0.625, n = Math.floor(t / beat), u = frac(t / beat);
  const FIELDS = ['#7C3AED', '#FFD34D', '#FF3C78', '#0F0F14', '#F2EFEC', '#7C3AED', '#FF3C78', '#FFD34D'];
  const INK = ['#F2EFEC', '#0F0F14', '#0F0F14', '#FFD34D', '#7C3AED', '#FFD34D', '#F2EFEC', '#7C3AED'];
  const WORDS = ['RIDE', 'INTO', 'THE', 'SUN', 'NO', 'BRAKES', 'JUST', 'LIGHT'];
  g.fillStyle = FIELDS[(n + 7) % 8]; g.fillRect(0, 0, W, H);
  const slam = ease(u / 0.22); g.fillStyle = FIELDS[n % 8]; g.fillRect(0, H * (1 - slam), W, H * slam);
  g.save(); g.fillStyle = INK[n % 8]; g.font = '900 470px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  const sc = 1.25 - 0.25 * ease(u / 0.3); g.translate(CX, 560); g.scale(sc, sc); g.fillText(WORDS[n % 8], 0, 0); g.restore();
  g.save(); g.fillStyle = INK[n % 8]; g.globalAlpha = 0.9; g.font = '900 120px "Arial Black", Impact, sans-serif'; g.textAlign = 'center'; g.fillText(WORDS[(n + 1) % 8], CX, 1780); g.restore();
  const ink = INK[n % 8]; g.save(); g.shadowColor = 'rgba(0,0,0,.25)'; g.shadowOffsetY = 14; for (const d of M.parts) drawPart(g, d, ink); g.restore();
  g.fillStyle = ink; g.fillRect(0, 1338, W * slam, 12);
};

// 10. Low-poly: faceted sun, mountains and trees with flat-shaded facets; drawn in 2D
S.lowpoly = (t) => {
  const M = model(t), r = rng(5);
  const sky = g.createLinearGradient(0, 0, 0, HZ); sky.addColorStop(0, '#3B2A7A'); sky.addColorStop(1, '#F29E6B'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  // faceted sun: 18-gon split into triangles from the centre, each facet its own shade
  for (let i = 0; i < 18; i++) { const a0 = Math.PI + i * Math.PI / 18, a1 = a0 + Math.PI / 18; g.beginPath(); g.moveTo(CX, HZ); g.lineTo(CX + Math.cos(a0) * 330, HZ + Math.sin(a0) * 330); g.lineTo(CX + Math.cos(a1) * 330, HZ + Math.sin(a1) * 330); g.closePath(); const l = 82 + 12 * Math.sin(i * 1.7); g.fillStyle = `hsl(40,100%,${l}%)`; g.fill(); }
  // mountain ridge as triangles
  const ridge = []; for (let x = -40; x <= W + 40; x += 90) ridge.push([x, HZ - 120 - r() * 200]);
  for (let i = 0; i < ridge.length - 1; i++) { const [x0, y0] = ridge[i], [x1, y1] = ridge[i + 1]; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo((x0 + x1) / 2, HZ); g.closePath(); g.fillStyle = `hsl(258,35%,${30 + (i % 3) * 5}%)`; g.fill();
    g.beginPath(); g.moveTo(x0, y0); g.lineTo((x0 + x1) / 2, HZ); g.lineTo(x0 - 45, HZ); g.closePath(); g.fillStyle = `hsl(258,35%,${24 + (i % 2) * 4}%)`; g.fill(); }
  g.globalAlpha = 0.0; g.globalAlpha = 1;
  for (let y = HZ; y < H; y += 120) for (let x = -60; x < W; x += 120) { const o = (Math.floor(y / 120) % 2) * 60; g.beginPath(); g.moveTo(x + o, y); g.lineTo(x + o + 120, y); g.lineTo(x + o + 60, y + 120); g.closePath(); g.fillStyle = `hsl(150,35%,${26 + ((x + y) / 120 % 3) * 4}%)`; g.fill(); g.beginPath(); g.moveTo(x + o + 120, y); g.lineTo(x + o + 180, y + 120); g.lineTo(x + o + 60, y + 120); g.closePath(); g.fillStyle = `hsl(150,35%,${22 + ((x + y) / 120 % 2) * 4}%)`; g.fill(); }
  // road with faceted shoulders
  road(g, '#4A3F5C'); g.beginPath(); g.moveTo(CX, HZ); g.lineTo(W + 120, H); g.lineTo(CX + 26, HZ); g.closePath(); g.fillStyle = '#5A4E6E'; g.fill();
  for (const d of M.dashes) { g.fillStyle = '#F2EFEC'; g.beginPath(); g.moveTo(CX - d.w / 2, d.y0); g.lineTo(CX + d.w / 2, d.y0); g.lineTo(CX + d.w * .7, d.y0 + d.len); g.lineTo(CX - d.w * .7, d.y0 + d.len); g.closePath(); g.fill(); }
  const cone = (tr) => { const { x, y, s } = tr; const top = [x, y - 170 * s], l = [x - 55 * s, y - 30 * s], rr = [x + 55 * s, y - 30 * s], m = [x + 8 * s, y - 20 * s];
    g.fillStyle = '#5B3A22'; g.fillRect(x - 7 * s, y - 32 * s, 14 * s, 32 * s);
    g.beginPath(); g.moveTo(...top); g.lineTo(...l); g.lineTo(...m); g.closePath(); g.fillStyle = '#3E8E5A'; g.fill();
    g.beginPath(); g.moveTo(...top); g.lineTo(...m); g.lineTo(...rr); g.closePath(); g.fillStyle = '#2B6B42'; g.fill(); };
  for (const tr of M.trees) if (tr.u < 0.5) cone(tr);
  // rider: every part split into facets from its centroid, shaded by facet direction
  const C = Object.assign({}, BASE, { jersey: '#FF4F7B', jerseyShade: '#FF4F7B', sleeve: '#FF4F7B' });
  for (const d of M.parts) { if (d.type !== 'poly') { drawPart(g, d, C[d.role]); continue; }
    const cx = d.pts.reduce((a, p) => a + p[0], 0) / d.pts.length, cy = d.pts.reduce((a, p) => a + p[1], 0) / d.pts.length;
    for (let i = 0; i < d.pts.length; i++) { const a = d.pts[i], b = d.pts[(i + 1) % d.pts.length]; g.beginPath(); g.moveTo(cx, cy); g.lineTo(...a); g.lineTo(...b); g.closePath();
      const nx = (a[1] + b[1]) / 2 - cy, sh = 0.82 + 0.25 * Math.sign(-((a[0] + b[0]) / 2 - cx)) * 0.5 - nx * 0.0015; g.fillStyle = C[d.role]; g.fill(); g.fillStyle = `rgba(0,0,0,${clamp(0.28 - sh * 0.25)})`; g.fill(); } }
  for (const tr of M.trees) if (tr.u >= 0.5) cone(tr);
};

window.renderFrame = (f) => { const t = ((f - 1) / FPS) % DUR; g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowBlur = 0; S[STYLE](t); };
window.STYLES = Object.keys(S);
window.ready = true;
})();
