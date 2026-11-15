// flat-video engine: 2D orthographic flat-vector stage in SVG. Every frame is a pure function of t.
// Contract with the lowpoly render scripts: window.ready, window.seek(t), window.renderFrame(f) (1-based, 30 fps).
export function createStage(cfg = {}) {
  const W = 1080, H = 1920, FPS = cfg.fps || 30;
  const $ = id => document.getElementById(id);
  // ---------- math ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
  const out3 = x => { x = clamp(x); return 1 - (1 - x) ** 3; };
  const in2 = x => { x = clamp(x); return x * x; };
  const inout = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
  const outBack = (x, k = 1.9) => { x = clamp(x); return 1 + (k + 1) * (x - 1) ** 3 + k * (x - 1) ** 2; };
  const spring = s => s <= 0 ? 0 : 1 - Math.exp(-5.5 * s) * Math.cos(11 * s); // overshoot spring 0 -> 1
  const env = (t, t0, d) => clamp((t - t0) / d);
  // pop scale: 0 before t0, overshoot in, optional out at t1
  const pop = (t, t0, t1 = 1e9, d = .5) => { if (t < t0 || t > t1 + .3) return 0; const i = spring((t - t0) / d * .9); const o = t > t1 ? 1 - out3((t - t1) / .3) : 1; return Math.max(0, i * o); };
  // squash & stretch on landing at tl: returns [sx, sy]
  const squash = (t, tl, amt = .22) => { const s = t - tl; if (s < 0 || s > .7) return [1, 1]; const k = amt * Math.exp(-7 * s) * Math.cos(16 * s); return [1 + k, 1 - k]; };
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const R = rng(cfg.seed || 7);
  const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mixHex = (a, b, p) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], clamp(p))).toString(16).padStart(2, '0')).join(''); };
  const f1 = n => (+n).toFixed(1);
  // blink: 0 open .. 1 closed; deterministic per seed, ~every 2.6-4 s
  const blink = (t, seed = 0) => { const per = 2.7 + (seed * 0.37 % 1.3); const ph = ((t + seed * 1.13) % per + per) % per; const d = .16; return ph < d ? Math.sin(Math.PI * ph / d) : 0; };
  // ---------- svg building ----------
  let uid = 0; const nid = p => `${p}${uid++}`;
  const staticDefs = $('sdefs'); const made = new Set();
  function defOnce(id, markup) { if (made.has(id)) return id; made.add(id); staticDefs.insertAdjacentHTML('beforeend', markup); return id; }
  const glowId = hex => defOnce('gl' + hex.slice(1), `<radialGradient id="gl${hex.slice(1)}"><stop offset="0" stop-color="${hex}" stop-opacity=".85"/><stop offset=".45" stop-color="${hex}" stop-opacity=".32"/><stop offset="1" stop-color="${hex}" stop-opacity="0"/></radialGradient>`);
  const linId = (a, b, vert = true) => defOnce(`ln${a.slice(1)}${b.slice(1)}${vert ? 'v' : 'h'}`, `<linearGradient id="ln${a.slice(1)}${b.slice(1)}${vert ? 'v' : 'h'}" x1="0" y1="0" x2="${vert ? 0 : 1}" y2="${vert ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`);
  const ellD = (cx, cy, rx, ry) => `M${f1(cx - rx)},${f1(cy)}a${f1(rx)},${f1(ry)} 0 1,0 ${f1(2 * rx)},0a${f1(rx)},${f1(ry)} 0 1,0 ${f1(-2 * rx)},0Z`;
  const rrD = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return `M${f1(x + r)},${f1(y)}h${f1(w - 2 * r)}a${f1(r)},${f1(r)} 0 0 1 ${f1(r)},${f1(r)}v${f1(h - 2 * r)}a${f1(r)},${f1(r)} 0 0 1 ${f1(-r)},${f1(r)}h${f1(-(w - 2 * r))}a${f1(r)},${f1(r)} 0 0 1 ${f1(-r)},${f1(-r)}v${f1(-(h - 2 * r))}a${f1(r)},${f1(r)} 0 0 1 ${f1(r)},${f1(-r)}Z`; };
  // group transform: translate, rotate (deg), scale (s or sx/sy), opacity
  function g(inner, o = {}) { if (!inner) return ''; const tr = []; if (o.x || o.y) tr.push(`translate(${f1(o.x || 0)},${f1(o.y || 0)})`); if (o.r) tr.push(`rotate(${(+o.r).toFixed(2)})`);
    const sx = (o.sx ?? 1) * (o.s ?? 1), sy = (o.sy ?? 1) * (o.s ?? 1); if (sx !== 1 || sy !== 1) tr.push(`scale(${sx.toFixed(4)},${sy.toFixed(4)})`);
    if ((o.s ?? 1) === 0 || o.o === 0) return ''; return `<g${tr.length ? ` transform="${tr.join(' ')}"` : ''}${o.o != null && o.o < 1 ? ` opacity="${o.o.toFixed(3)}"` : ''}${o.clip ? ` clip-path="url(#${o.clip})"` : ''}>${inner}</g>`; }
  // two-tone flat shape: light face, hard-edged shadow toward (dx,dy), thin highlight rim on the opposite side
  function tone(d, L, D, o = {}) { const id = nid('c'); const dx = o.dx ?? 14, dy = o.dy ?? 16; const rim = o.rim ?? mixHex(L, '#FFFFFF', .45);
    return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${D}"/><g clip-path="url(#${id})"><path d="${d}" fill="${L}" transform="translate(${-dx},${-dy})"/>${o.norim ? '' : `<path d="${d}" fill="none" stroke="${rim}" stroke-width="${o.rimW ?? 5}" stroke-opacity=".7" transform="translate(${dx * .35},${dy * .35})"/>`}</g>`; }
  const ell = (cx, cy, rx, ry, L, D, o = {}) => D ? tone(ellD(cx, cy, rx, ry), L, D, { dx: rx * .12, dy: ry * .16, ...o }) : `<path d="${ellD(cx, cy, rx, ry)}" fill="${L}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const rr = (x, y, w, h, r, L, D, o = {}) => D ? tone(rrD(x, y, w, h, r), L, D, { dx: w * .1, dy: h * .1, ...o }) : `<path d="${rrD(x, y, w, h, r)}" fill="${L}"${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const path = (d, fill, o = {}) => `<path d="${d}" fill="${fill || 'none'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.w || 6}" stroke-linecap="round" stroke-linejoin="round"` : ''}${o.op != null ? ` opacity="${o.op}"` : ''}/>`;
  const line = (x1, y1, x2, y2, c, w = 6, op = 1) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${op < 1 ? ` opacity="${op}"` : ''}/>`;
  const text = (x, y, s, size, fill, o = {}) => `<text x="${f1(x)}" y="${f1(y)}" font-family="Fredoka" font-weight="${o.wt || 700}" font-size="${size}" fill="${fill}" text-anchor="${o.anchor || 'middle'}"${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${s}</text>`;
  const glow = (cx, cy, r, hex, a = 1) => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="url(#${glowId(hex)})" opacity="${a.toFixed(3)}"/>`;
  const bg = (top, bot, x = 0, y = 0, w = W, h = H) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${linId(top, bot)})"/>`;
  // ---------- detail pass helpers ----------
  // background plate (AI-generated flat art in src/bg/), placed in world/layer coords
  const img = (href, x, y, w, h, o = {}) => `<image href="${href}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" preserveAspectRatio="none"${o.op != null ? ` opacity="${o.op}"` : ''}${o.blur ? ` filter="url(#${blurId(o.blur)})"` : ''}/>`;
  const blurId = r => defOnce('bl' + r, `<filter id="bl${r}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${r}"/></filter>`);
  // dot / freckle pattern fill clipped to a path (texture on big flat areas)
  const patId = (hex, sp, r, op) => defOnce(`pt${hex.slice(1)}${sp}${r}`, `<pattern id="pt${hex.slice(1)}${sp}${r}" width="${sp}" height="${sp}" patternUnits="userSpaceOnUse"><circle cx="${sp / 4}" cy="${sp / 4}" r="${r}" fill="${hex}" opacity="${op}"/><circle cx="${sp * .75}" cy="${sp * .75}" r="${r * .7}" fill="${hex}" opacity="${op}"/></pattern>`);
  const texture = (d, hex = '#FFFFFF', sp = 40, r = 4, op = .18) => `<path d="${d}" fill="url(#${patId(hex, sp, r, op)})"/>`;
  // drifting particles (plankton, dust, pollen): periodic, pure function of t
  const motes = (t, seed, x0, y0, w, h, n = 40, c = '#DFFBFF', o = {}) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const px = r(), py = r(), sp = .02 + r() * .05, rad = 1.5 + r() * 4;
    const u = ((px + t * sp * (o.dir || 1)) % 1 + 1) % 1; s += `<circle cx="${f1(x0 + u * w)}" cy="${f1(y0 + py * h + Math.sin(t * (1 + r()) + i) * 12)}" r="${f1(rad)}" fill="${c}" opacity="${(.25 + .45 * Math.abs(Math.sin(t * .8 + i))).toFixed(2)}"/>`; } return s; };
  // colour grade overlay: top/bottom tint with soft-light blend
  const grade = (top, bot, op = .35) => `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#${linId(top, bot)})" opacity="${op}" style="mix-blend-mode:soft-light"/>`;
  // ---------- characters ----------
  const BROWS = { neutral: [0, 0], surprised: [-16, 0], worried: [-6, -18], happy: [-8, -8], angry: [2, 18], sleep: [4, 0] };
  // face: eyes (blink, look), brows (mood), mouth. Local origin = between the eyes.
  function face(o) { const r = o.eyeR || 16, gap = o.gap || 26, mood = o.mood || 'neutral', b = o.sleep ? 1 : (o.blink || 0), lk = o.look || [0, 0], ink = o.ink || '#2A1640';
    let s = ''; const by = BROWS[mood] || [0, 0];
    (o.single ? [1] : [-1, 1]).forEach(side => { const ex = o.single ? 0 : side * gap;
      if (b > .85) s += path(`M${ex - r},${-2} Q${ex},${o.sleep ? 10 : 6} ${ex + r},${-2}`, 'none', { stroke: ink, w: r * .32 });
      else { s += `<g transform="translate(${ex},0) scale(1,${(1 - b).toFixed(3)})">${ell(0, 0, r, r * 1.12, '#FFFFFF')}${ell(lk[0] * r * .35, lk[1] * r * .35 + 2, r * .6, r * .66, ink)}${ell(lk[0] * r * .35 - r * .2, lk[1] * r * .35 - r * .22, r * .2, r * .2, '#FFFFFF')}</g>`; }
      if (o.brows !== false) { const yIn = -r * 1.55 + by[0] + by[1] * .5, yOut = -r * 1.55 + by[0] - by[1] * .5; const inX = ex - side * r * .2, outX = ex + side * r * 1.0;
        s += path(`M${f1(inX)},${f1(yIn)} Q${f1(ex + side * r * .4)},${f1(Math.min(yIn, yOut) - (mood === 'surprised' || mood === 'happy' ? 7 : 2))} ${f1(outX)},${f1(yOut)}`, 'none', { stroke: o.browC || ink, w: r * .36 }); } });
    const my = o.mouthY ?? r * 1.9, mw = o.mouthW || r * 1.1, m = o.mouth || ({ neutral: 'smile', surprised: 'o', worried: 'worry', happy: 'grin', angry: 'flat', sleep: 'flat' })[mood];
    if (m === 'smile') s += path(`M${-mw},${my} Q0,${my + mw * .7} ${mw},${my}`, 'none', { stroke: ink, w: r * .3 });
    else if (m === 'grin') s += path(`M${-mw},${my - 3} Q0,${my + mw * 1.3} ${mw},${my - 3}Z`, ink) + path(`M${-mw * .45},${my + mw * .45} Q0,${my + mw * .85} ${mw * .45},${my + mw * .45}Z`, '#FF7A9C');
    else if (m === 'o') s += ell(0, my + 4, mw * .45, mw * .6, ink) + ell(0, my + mw * .3, mw * .25, mw * .2, '#FF7A9C');
    else if (m === 'worry') s += path(`M${-mw},${my + 6} Q${-mw * .5},${my - 4} 0,${my + 4} Q${mw * .5},${my + 10} ${mw},${my}`, 'none', { stroke: ink, w: r * .28 });
    else if (m === 'flat') s += line(-mw * .7, my + 2, mw * .7, my + 2, ink, r * .28);
    else if (m === 'open') s += path(`M${-mw},${my} Q0,${my + mw * 1.6} ${mw},${my}Z`, ink);
    if (o.blush) s += ell(-gap - r * .4, r * 1.35, r * .55, r * .3, '#FF8FB1', null, { op: .55 }) + ell(gap + r * .4, r * 1.35, r * .55, r * .3, '#FF8FB1', null, { op: .55 });
    return s; }
  // HIPPO (side view, faces right). Local origin = ground between the feet; ~560 wide x 420 tall at s=1.
  const HP = { L: '#E58BB5', D: '#B65F92', belly: '#F7B9D2', bellyD: '#E496B8', far: '#A85488', ink: '#3B1640', hoof: '#7A3466' };
  function hippo(o = {}) { const t = o.t || 0, C = { ...HP, ...(o.colors || {}) }; const wp = o.walk ?? 0, wa = o.walkAmp ?? (o.walk != null ? .38 : 0);
    const leg = (x, ph, far) => { const a = Math.sin(wp * Math.PI * 2 + ph) * wa * 57.3; const Lc = far ? C.far : C.L, Dc = far ? mixHex(C.far, '#2A0E30', .25) : C.D;
      return g(rr(-38, -20, 76, 132, 34, Lc, Dc, { rimW: 3 }) + rr(-38, 88, 76, 26, 13, C.hoof) + [-18, 0, 18].map(k => ell(k, 104, 9, 7, mixHex(C.hoof, '#FFFFFF', .25))).join(''), { x, y: -112, r: a }); };
    let s = ''; if (o.shadow !== false) s += ell(10, 6, 270, 30, '#120A30', null, { op: .22 }) + ell(10, 4, 200, 18, '#0B0620', null, { op: .3 });
    s += leg(-150, Math.PI, true) + leg(110, 0, true); // far legs
    s += path('M-245,-215 Q-292,-232 -300,-200', 'none', { stroke: C.D, w: 18 }); // tail
    s += tone(ellD(-10, -215, 260, 170), C.L, C.D, { dx: 26, dy: 34 });
    { const id = nid('hb'); s += `<clipPath id="${id}"><path d="${ellD(-10, -215, 260, 170)}"/></clipPath><g clip-path="url(#${id})">${texture(rrD(-280, -400, 540, 360, 0), C.D, 46, 5, .35)}${ell(-120, -330, 60, 26, C.D, null, { op: .35 })}${ell(30, -360, 44, 18, C.D, null, { op: .3 })}</g>`; }
    s += `<g clip-path="url(#${(() => { const id = nid('bc'); s += `<clipPath id="${id}"><path d="${ellD(-10, -215, 260, 170)}"/></clipPath>`; return id; })()})">${ell(10, -70, 220, 75, C.belly, C.bellyD, { norim: true })}</g>`;
    s += leg(-90, 0, false) + leg(170, Math.PI, false); // near legs
    // head (pivot at neck); nod/open via o.head = {r, open, mood, look, sleep}
    const hd = o.head || {}; const mood = hd.mood || 'neutral'; const open = hd.open || 0;
    let h = '';
    h += ell(-6, -36, 66, 46, C.L, C.D); // ear pad bump
    h += ell(-18, -112, 20, 24, C.D) + ell(-18, -110, 10, 13, '#F28CB0'); // ear
    h += ell(-60, -96, 18, 22, C.far); // far ear
    h += tone(ellD(10, -20, 125, 112), C.L, C.D, { dx: 16, dy: 22 });
    // jaw (opens down)
    h += g(tone(`M40,30 Q120,${70} 215,30 Q225,70 160,92 Q80,104 40,70Z`, C.L, C.D, { dx: 10, dy: 14 }) + (open > .1 ? [70, 150].map(x => path(`M${x},34 l10,-26 l10,26Z`, '#FFF6E8')).join('') : ''), { x: 0, y: 0, r: open * 22 });
    if (open > .05) h += path(`M45,30 Q130,${30 + 50 * open} 212,30Z`, '#7A1E4A');
    h += tone(ellD(130, -12, 118, 74), C.L, C.D, { dx: 14, dy: 18 }); // snout
    h += ell(130, 14, 86, 30, C.belly, null, { op: .5 });
    h += ell(196, -60, 16, 10, C.ink) + ell(150, -66, 13, 8, C.ink); // nostrils
    h += path('M70,34 Q140,58 214,26', 'none', { stroke: C.ink, w: 7 });
    h += ell(40, -72, 48, 40, C.L, C.D, { norim: true }); // eye bump
    h += g(face({ single: true, eyeR: 19, mood, look: hd.look || [1, 0], blink: blink(t, o.seed || 1), sleep: hd.sleep, mouth: 'none', ink: C.ink }), { x: 46, y: -80 });
    if (hd.blush !== false) h += ell(70, 2, 26, 13, '#FF7FA8', null, { op: .45 });
    s += g(h, { x: 228, y: -278, r: hd.r || 0 });
    return g(s, { x: o.x, y: o.y, s: o.s, sx: (o.face === -1 ? -1 : 1) * (o.sx ?? 1), sy: o.sy, r: o.r, o: o.o }); }
  // HIPPO 3/4 HEAD close-up. Local origin = centre of the head; ~520 wide.
  function hippoHead(o = {}) { const t = o.t || 0, C = { ...HP, ...(o.colors || {}) }, mood = o.mood || 'neutral', wig = Math.sin(t * 9) * (o.earWiggle || 0);
    let s = '';
    s += g(ell(0, 0, 36, 44, C.D) + ell(0, 4, 18, 26, '#F28CB0'), { x: -170, y: -230, r: -20 + wig * 20 }) + g(ell(0, 0, 36, 44, C.D) + ell(0, 4, 18, 26, '#F28CB0'), { x: 170, y: -230, r: 20 - wig * 20 });
    s += tone(ellD(0, -60, 230, 200), C.L, C.D, { dx: 24, dy: 30 });
    s += ell(-95, -170, 70, 58, C.L, C.D, { norim: true }) + ell(95, -170, 70, 58, C.L, C.D, { norim: true });
    s += g(face({ eyeR: 30, gap: 95, mood, look: o.look || [0, .2], blink: blink(t, o.seed || 3), sleep: o.sleep, mouth: 'none', ink: C.ink }), { x: 0, y: -170 });
    s += tone(ellD(0, 110, 270, 160), C.L, C.D, { dx: 20, dy: 26 }); // muzzle
    s += ell(0, 160, 200, 80, C.belly, null, { op: .55 });
    s += ell(-95, 40, 30, 20, C.ink) + ell(95, 40, 30, 20, C.ink);
    const m = o.mouth || ({ worried: 'worry', surprised: 'o', happy: 'grin' })[mood] || 'smile';
    if (m === 'worry') s += path('M-120,190 Q-60,160 0,185 Q60,210 120,180', 'none', { stroke: C.ink, w: 12 });
    else if (m === 'o') s += ell(0, 195, 40, 46, '#7A1E4A');
    else if (m === 'grin') s += path('M-150,170 Q0,300 150,170Z', '#7A1E4A') + path('M-110,178 l14,40 l14,-40Z M82,178 l14,40 l14,-40Z', '#FFF6E8');
    else s += path('M-140,175 Q0,240 140,175', 'none', { stroke: C.ink, w: 12 });
    s += ell(-190, 120, 40, 20, '#FF7FA8', null, { op: .45 }) + ell(190, 120, 40, 20, '#FF7FA8', null, { op: .45 });
    if (o.sweat) s += g(path('M0,-30 Q22,0 0,14 Q-22,0 0,-30Z', '#8FE3FF') + ell(-5, -2, 5, 8, '#FFFFFF'), { x: 215, y: -170 + o.sweat * 30, s: clamp(o.sweat * 3) });
    return g(s, { x: o.x, y: o.y, s: o.s, r: o.r, sx: o.sx, sy: o.sy, o: o.o }); }
  // PIP the host: a tiny round scientist (gold skin, teal goggles, lab coat). Origin = ground, ~230 tall at s=1.
  const PP = { skin: '#FFC56B', skinD: '#E3943A', coat: '#F5F2FF', coatD: '#C9BFEF', lens: '#4FE0D6', band: '#2F2160', ink: '#2A1640', boot: '#5B3FA8' };
  function pip(o = {}) { const t = o.t || 0, C = PP, mood = o.mood || 'neutral'; const bob = o.bob ?? Math.abs(Math.sin(t * 2.4)) * 4; const aL = o.armL ?? 20, aR = o.armR ?? -20;
    const arm = (side, ang) => g(line(0, 0, 0, 52, C.coatD, 20) + ell(0, 56, 14, 14, C.skin, C.skinD, { norim: true }), { x: side * 60, y: -96, r: ang });
    let s = ''; if (o.shadow !== false) s += ell(0, 4, 70, 12, '#120A30', null, { op: .3 });
    const st = o.step || 0; s += rr(-34, -32 - Math.max(0, Math.sin(st)) * 10, 26, 34, 12, C.boot) + rr(8, -32 - Math.max(0, -Math.sin(st)) * 10, 26, 34, 12, C.boot);
    let b = ''; b += arm(-1, aL) + arm(1, aR);
    const body = ellD(0, -100, 74, 82); b += tone(body, C.skin, C.skinD, { dx: 10, dy: 14 });
    const cid = nid('pc'); b += `<clipPath id="${cid}"><path d="${body}"/></clipPath><g clip-path="url(#${cid})">${tone(rrD(-80, -78, 160, 70, 10), C.coat, C.coatD, { dx: 14, dy: 10, norim: true })}${path('M-26,-78 L0,-50 L26,-78', 'none', { stroke: C.coatD, w: 6 })}${ell(40, -46, 8, 8, C.lens)}</g>`;
    b += g(face({ eyeR: 13, gap: 24, mood, look: o.look || [0, 0], blink: blink(t, o.seed || 5), sleep: o.sleep, ink: C.ink, blush: true }), { x: 0, y: -118 });
    b += rr(-74, -170, 148, 16, 8, C.band) + ell(-26, -164, 21, 19, C.band) + ell(26, -164, 21, 19, C.band) + ell(-26, -164, 15, 13, C.lens) + ell(26, -164, 15, 13, C.lens) + ell(-31, -169, 5, 4, '#FFFFFF') + ell(21, -169, 5, 4, '#FFFFFF');
    b += path('M0,-180 Q-6,-206 12,-212 Q24,-214 22,-200', 'none', { stroke: C.skinD, w: 8 }); // sprout curl
    s += g(b, { y: -bob });
    return g(s, { x: o.x, y: o.y, s: o.s, sx: (o.face === -1 ? -1 : 1) * (o.sx ?? 1), sy: o.sy, r: o.r, o: o.o }); }
  // ---------- cut-out puppet (AI-drawn character art rigged in code) ----------
  // spec: { href, w, h, scale, origin:[ox,oy] (image px that lands on 0,0, e.g. between the feet),
  //   base:[[x,y,w,h]...] (static body clip), parts:[{key, clip:[x,y,w,h], pivot:[x,y], phase, front}] (rotating pieces, e.g. legs),
  //   patch:[[cx,cy,rx,ry,hex]...] (paint over painted eyes/brows), eyes:[{x,y,rx,ry}] (code eyes drawn there),
  //   brows:true, mouth:{x,y,w,ink,patch:[cx,cy,rx,ry,hex], native:'smile'} }
  // o: { x, y, s, sx, sy, r, face, t, walk, walkAmp, mood, look, sleep, seed, o }
  function puppet(P, o = {}) { const t = o.t || 0, k = P.scale || 1, ink = P.ink || '#3B1640', mood = o.mood || 'neutral';
    const im = `<image href="${P.href}" x="0" y="0" width="${P.w}" height="${P.h}"/>`;
    const clipR = rects => { const id = nid('pp'); return [id, `<clipPath id="${id}">${rects.map(r => `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}"/>`).join('')}</clipPath>`]; };
    const wa = o.walk != null ? (o.walkAmp ?? .35) : 0; let back = '', front = '';
    (P.parts || []).forEach(pt => { const a = wa ? Math.sin((o.walk || 0) * Math.PI * 2 + (pt.phase || 0)) * wa * 57.3 * (pt.amp || 1) : 0; const [id, cd] = clipR([pt.clip]);
      const piece = `${cd}<g transform="rotate(${a.toFixed(2)},${pt.pivot[0]},${pt.pivot[1]})"><g clip-path="url(#${id})">${im}</g></g>`; if (pt.front) front += piece; else back += piece; });
    const [bid, bcd] = clipR(P.base || [[0, 0, P.w, P.h]]);
    let s = back + bcd + `<g clip-path="url(#${bid})">${im}</g>` + front;
    (P.patch || []).forEach(q => s += ell(q[0], q[1], q[2], q[3], q[4]));
    const b = o.sleep || mood === 'sleep' ? 1 : blink(t, o.seed || 1), lk = o.look || [0, 0], by = BROWS[mood] || [0, 0];
    (P.eyes || []).forEach((e, i) => { const sc = e.ry / 18;
      if (b > .85) s += path(`M${e.x - e.rx},${e.y} Q${e.x},${e.y + e.ry * .55} ${e.x + e.rx},${e.y}`, 'none', { stroke: ink, w: e.ry * .22 });
      else s += `<g transform="translate(${e.x},${e.y}) scale(1,${(1 - b).toFixed(3)})">${ell(0, 0, e.rx, e.ry, '#FFFFFF')}${ell(lk[0] * e.rx * .3, lk[1] * e.ry * .3 + e.ry * .05, e.rx * .62, e.ry * .66, ink)}${ell(lk[0] * e.rx * .3 - e.rx * .22, lk[1] * e.ry * .3 - e.ry * .22, e.rx * .2, e.ry * .2, '#FFFFFF')}</g>`;
      if (P.brows !== false) { const side = (P.eyes.length > 1 ? (i ? 1 : -1) : 1) * (e.flip ? -1 : 1); const y0 = e.y - e.ry * 1.45 + by[0] * sc; const yIn = y0 + by[1] * sc * .5, yOut = y0 - by[1] * sc * .5;
        const inX = e.x - side * e.rx * .5, outX = e.x + side * e.rx * .9; s += path(`M${f1(inX)},${f1(yIn)} Q${f1(e.x)},${f1(Math.min(yIn, yOut) - e.ry * (mood === 'surprised' || mood === 'happy' ? .4 : .12))} ${f1(outX)},${f1(yOut)}`, 'none', { stroke: ink, w: e.ry * .26 }); } });
    const M = P.mouth; if (M) { const want = o.mouth || ({ worried: 'worry', surprised: 'o', angry: 'flat' })[mood] || M.native || 'smile';
      if (want !== (M.native || 'smile')) { const q = M.patch; s += ell(q[0], q[1], q[2], q[3], q[4]); const w = M.w, x = M.x, y = M.y, lw = M.lw || 10;
        if (want === 'worry') s += path(`M${x - w},${y + 6} Q${x - w * .5},${y - w * .12} ${x},${y + 4} Q${x + w * .5},${y + w * .14} ${x + w},${y - 2}`, 'none', { stroke: M.ink || ink, w: lw });
        else if (want === 'o') s += ell(x, y, w * .22, w * .26, '#7A1E4A');
        else if (want === 'flat') s += line(x - w * .6, y, x + w * .6, y, M.ink || ink, lw); } }
    if (o.shadow !== false && P.shadow) s = ell(P.shadow[0], P.shadow[1], P.shadow[2], P.shadow[3], '#120A30', null, { op: .25 }) + s;
    const inner = `<g transform="scale(${k}) translate(${-P.origin[0]},${-P.origin[1]})">${s}</g>`;
    return g(inner, { x: o.x, y: o.y, s: o.s, sx: (o.face === -1 ? -1 : 1) * (o.sx ?? 1), sy: o.sy, r: o.r, o: o.o }); }
  // ---------- devices ----------
  // magnifier: circular cut-away showing inner(svg in local coords centred at 0,0) at (x,y) radius r, leader to (tx,ty)
  function magnifier(o) { const k = o.k ?? 1; if (k <= 0) return ''; const r = o.r * k, id = nid('mg'); let s = '';
    if (o.tx != null) s += line(o.x, o.y, lerp(o.x, o.tx, k), lerp(o.y, o.ty, k), '#FFE3A3', 6, .9) + `<circle cx="${o.tx}" cy="${o.ty}" r="${12 * k}" fill="#FFE3A3"/>`;
    s += glow(o.x, o.y, r * 1.6, o.glow || '#FF8FC8', .5);
    s += `<clipPath id="${id}"><circle cx="${o.x}" cy="${o.y}" r="${r}"/></clipPath><circle cx="${o.x}" cy="${o.y}" r="${r}" fill="${o.fill || '#2A1E5C'}"/><g clip-path="url(#${id})">${g(o.inner || '', { x: o.x, y: o.y, s: k })}</g>`;
    s += `<circle cx="${o.x}" cy="${o.y}" r="${r}" fill="none" stroke="#FFE3A3" stroke-width="${16 * k}"/><circle cx="${o.x}" cy="${o.y}" r="${r - 12 * k}" fill="none" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="5"/>`;
    s += path(`M${f1(o.x - r * .55)},${f1(o.y - r * .62)} A${f1(r * .8)},${f1(r * .8)} 0 0 1 ${f1(o.x + r * .1)},${f1(o.y - r * .8)}`, 'none', { stroke: '#FFFFFF', w: 8 * k, op: .45 });
    return s; }
  // TAG STYLE (shared by pill, card, chips): frosted deep-violet panel, thin accent rim, accent dot, white text, soft drop glow.
  const TAG = { bg: '#1B1240', op: .82, rim: 3, text: '#FFFFFF', sub: '#C9BFEF' };
  const panel = (w, h, r, accent) => `<rect x="${f1(-w / 2)}" y="${f1(-h / 2 + 10)}" width="${f1(w)}" height="${f1(h)}" rx="${r}" fill="#0B0620" opacity=".35" filter="url(#${blurId(10)})"/>` +
    `<rect x="${f1(-w / 2)}" y="${f1(-h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${r}" fill="${TAG.bg}" opacity="${TAG.op}"/>` +
    `<rect x="${f1(-w / 2 + 1.5)}" y="${f1(-h / 2 + 1.5)}" width="${f1(w - 3)}" height="${f1(h - 3)}" rx="${r - 1.5}" fill="none" stroke="${accent}" stroke-width="${TAG.rim}" stroke-opacity=".9"/>` +
    `<rect x="${f1(-w / 2 + r * .6)}" y="${f1(-h / 2 + 7)}" width="${f1(w - r * 1.2)}" height="5" rx="2.5" fill="#FFFFFF" opacity=".12"/>`;
  // pill label: small tag + thin leader with an end dot (tx,ty). o.color = accent
  function pill(o) { const k = o.k ?? 1; if (k <= 0) return ''; const fs = o.size ? Math.min(o.size, 52) * .84 : 42, c = o.color || '#FF6F91';
    const w = o.w || o.text.length * fs * .58 + fs * 2.8, h = fs * 1.75; let s = '';
    if (o.tx != null) { const e = clamp(k * 1.4); s += line(o.tx, o.ty, lerp(o.tx, o.x, e), lerp(o.ty, o.y, e), c, 3.5, .9) + `<circle cx="${o.tx}" cy="${o.ty}" r="9" fill="${c}"/><circle cx="${o.tx}" cy="${o.ty}" r="16" fill="none" stroke="${c}" stroke-width="3" opacity=".5"/>`; }
    s += g(panel(w, h, h / 2, c) + `<circle cx="${f1(-w / 2 + fs * .95)}" cy="0" r="${f1(fs * .24)}" fill="${c}"/>` + text(fs * .5, fs * .35, o.text, fs, TAG.text, { wt: 600, ls: 1 }), { x: o.x, y: o.y, s: spring(k * .9) });
    return s; }
  // vertical meter (fill 0..1) with label and value text
  function meter(o) { const k = o.k ?? 1; if (k <= 0) return ''; const w = o.w || 110, h = o.h || 520, f = clamp(o.fill || 0); let s = '';
    s += g(panel(w + 28, h + 28, (w + 28) / 2, o.top || '#FFC24B'), { y: -h / 2 }) + rr(-w / 2, -h, w, h, w / 2, '#3A2A78');
    const cid = nid('mt'); s += `<clipPath id="${cid}"><path d="${rrD(-w / 2, -h, w, h, w / 2)}"/></clipPath><g clip-path="url(#${cid})"><rect x="${-w / 2}" y="${f1(-h * f)}" width="${w}" height="${f1(h * f)}" fill="url(#${linId(o.top || '#FFC24B', o.bot || '#3FD0C9')})"/><rect x="${-w / 2 + 14}" y="${-h}" width="16" height="${h}" fill="#FFFFFF" opacity=".18"/></g>`;
    for (let i = 1; i < (o.ticks || 5); i++) s += line(w / 2 - 26, -h * i / (o.ticks || 5), w / 2 - 6, -h * i / (o.ticks || 5), '#FFFFFF', 4, .5);
    if (o.icon) s += g(o.icon, { x: 0, y: 70 });
    if (o.value) s += text(0, -h - 44, o.value, o.vsize || 64, '#FFE3A3');
    return g(s, { x: o.x, y: o.y, s: spring(k * .9) }); }
  // speed gauge: semicircle 0..max, needle on value v
  function gauge(o) { const k = o.k ?? 1; if (k <= 0) return ''; const r = o.r || 170, max = o.max || 40, v = clamp((o.v || 0) / max); let s = '';
    const arc = (a0, a1, c, w) => { const p = a => [Math.cos(Math.PI * (1 + a)) * r, Math.sin(Math.PI * (1 + a)) * r]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `<path d="M${f1(x0)},${f1(y0)} A${r},${r} 0 0 1 ${f1(x1)},${f1(y1)}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`; };
    s += `<path d="M${-r - 50},24 A${r + 50},${r + 50} 0 0 1 ${r + 50},24 Z" fill="${TAG.bg}" opacity="${TAG.op}"/><path d="M${-r - 48},22 A${r + 48},${r + 48} 0 0 1 ${r + 48},22 Z" fill="none" stroke="#FFC24B" stroke-width="3" opacity=".9"/>`;
    s += arc(0, 1, '#3A2A78', 34) + arc(0, .45, '#3FD0C9', 34) + arc(.45, .75, '#FFC24B', 34) + arc(.75, 1, '#FF6F91', 34);
    for (let i = 0; i <= 4; i++) { const a = Math.PI * (1 + i / 4); s += line(Math.cos(a) * (r - 34), Math.sin(a) * (r - 34), Math.cos(a) * (r - 54), Math.sin(a) * (r - 54), '#FFFFFF', 5, .6); }
    const a = Math.PI * (1 + v); s += line(0, 0, Math.cos(a) * (r - 20), Math.sin(a) * (r - 20), '#FFFFFF', 12) + `<circle r="22" fill="#FFE3A3"/>`;
    s += text(0, -r * .35, o.value ?? '', 70, '#FFFFFF') + text(0, -r * .35 + 40, o.unit || 'km/h', 30, '#FFE3A3', { wt: 500 });
    return g(s, { x: o.x, y: o.y, s: spring(k * .9) }); }
  // card: counter/step card in the tag style (label small caps, big number, unit line)
  function card(o) { const k = o.k ?? 1; if (k <= 0) return ''; const w = o.w ? o.w * .85 : 260, h = o.h ? o.h * .8 : 240, c = o.band || o.color || '#FFC24B'; let s = '';
    s += panel(w, h, 34, c) + `<circle cx="${f1(-w / 2 + 34)}" cy="${f1(-h / 2 + 36)}" r="8" fill="${c}"/>` + text(-w / 2 + 54, -h / 2 + 46, o.top || '', 26, c, { wt: 600, ls: 3, anchor: 'start' });
    s += text(0, h * .2 + 8, o.big || '', o.bigSize ? o.bigSize * .75 : 112, TAG.text);
    if (o.small) s += text(0, h / 2 - 24, o.small, 28, TAG.sub, { wt: 500 });
    return g(s, { x: o.x, y: o.y, s: spring(k * .9), r: o.r }); }
  // small effects
  const bubbles = (t, x0, y0, n, seed, o = {}) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const ph = r(), sp = 60 + r() * 80, rad = 6 + r() * 14, life = o.life || 3; const u = (((t - (o.t0 || 0)) / life + ph) % 1 + 1) % 1; if (o.t0 != null && t < o.t0) continue; if (o.t1 != null && t > o.t1) continue;
    const y = y0 - u * sp * life, x = x0 + (r() - .5) * (o.spread || 80) + Math.sin(u * 9 + i) * 10; if (o.top != null && y < o.top) continue; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="none" stroke="#BFF6FF" stroke-width="4" opacity="${(.8 * (1 - u)).toFixed(2)}"/><circle cx="${f1(x - rad * .3)}" cy="${f1(y - rad * .3)}" r="${f1(rad * .25)}" fill="#FFFFFF" opacity="${(.8 * (1 - u)).toFixed(2)}"/>`; } return s; };
  const puff = (t, t0, x, y, c = '#C9A6E8', n = 6, size = 60) => { const s0 = t - t0; if (s0 < 0 || s0 > .9) return ''; let s = ''; for (let i = 0; i < n; i++) { const a = Math.PI * (i / (n - 1)), d = out3(s0 / .9) * size * 1.6; s += ell(x - Math.cos(a) * d * 1.4, y - Math.sin(a) * d * .5, size * .45 * (1 - s0 / .9) + 4, size * .38 * (1 - s0 / .9) + 3, c, null, { op: .85 }); } return s; };
  const ring = (t, t0, x, y, c = '#BFF6FF', R0 = 30, R1 = 220, dur = .9) => { const s0 = (t - t0) / dur; if (s0 < 0 || s0 > 1) return ''; return `<ellipse cx="${x}" cy="${y}" rx="${f1(lerp(R0, R1, out3(s0)))}" ry="${f1(lerp(R0, R1, out3(s0)) * .28)}" fill="none" stroke="${c}" stroke-width="${f1(10 * (1 - s0) + 1)}" opacity="${(1 - s0).toFixed(2)}"/>`; };
  const stars = (n, seed, x0, y0, w, h, t) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + r() * h, rad = 1.5 + r() * 3.5, tw = .45 + .55 * Math.abs(Math.sin(t * (1 + r() * 2) + i)); s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rad)}" fill="#FFF3D6" opacity="${tw.toFixed(2)}"/>`; } return s; };
  const sparkle = (x, y, k, c = '#FFE3A3', sz = 40) => k <= 0 ? '' : g(path(`M0,${-sz} Q${sz * .15},${-sz * .15} ${sz},0 Q${sz * .15},${sz * .15} 0,${sz} Q${-sz * .15},${sz * .15} ${-sz},0 Q${-sz * .15},${-sz * .15} 0,${-sz}Z`, c), { x, y, s: k });
  const qmark = (x, y, k, c = '#FFC24B') => k <= 0 ? '' : g(ell(0, 0, 62, 62, c, mixHex(c, '#B0601A', .5)) + text(0, 30, '?', 90, '#3A1F5C'), { x, y, s: k });
  const cross = (x, y, k, size = 70, c = '#FF4F6E') => k <= 0 ? '' : g(line(-size, -size, size, size, c, 26) + line(size, -size, -size, size, c, 26), { x, y, s: k, r: -8 });
  const speed = (t, x, y, n, len, seed, c = '#FFFFFF') => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const yy = y + (r() - .5) * 360, u = ((t * 3 + r()) % 1), L = len * (.5 + r()); s += line(x - u * 300, yy, x - u * 300 - L, yy, c, 6 + r() * 6, .6 * (1 - u)); } return s; };
  // ---------- camera ----------
  // keys [t, set, cx, cy, zoom, ease?]; tween within the same set, hard cut between sets. Shake via fn.
  function camAt(K, t) { let i = 0; while (i < K.length - 1 && K[i + 1][0] <= t) i++; const a = K[i], b = K[i + 1]; if (!b || b[1] !== a[1]) return { set: a[1], cx: a[2], cy: a[3], z: a[4] };
    const p = (b[5] || inout)((t - a[0]) / (b[0] - a[0])); return { set: a[1], cx: lerp(a[2], b[2], p), cy: lerp(a[3], b[3], p), z: lerp(a[4], b[4], p) }; }
  let CAM = { cx: 540, cy: 960, z: 1 };
  // parallax layer: k=0 fixed backdrop, 1 = world, >1 near foreground
  function layer(k, inner, o = {}) { if (!inner) return ''; const z = 1 + (CAM.z - 1) * k, cx = 540 + (CAM.cx - 540) * k, cy = 960 + (CAM.cy - 960) * k; return `<g transform="translate(540,960) scale(${z.toFixed(4)}) translate(${f1(-cx)},${f1(-cy)})"${o.blur ? ` filter="url(#${blurId(o.blur)})"` : ''}>${inner}</g>`; }
  // ---------- titles, captions, chips (DOM, same rules as lowpoly) ----------
  function titleAt(TT, t) { const e = $('title'); const T = TT.find(x => t >= x[0] && t < x[1]); if (!T) { e.innerHTML = ''; return; }
    const s = t - T[0], out = T[1] - t; e.innerHTML = [...T[2]].map((ch, i) => { const u = s - .05 - i * .045; let y = u < 0 ? 220 : (u < .3 ? 220 * (1 - out3(u / .3)) : 0) + (u >= .3 ? -14 * Math.exp(-6 * (u - .3)) * Math.sin(14 * (u - .3)) : 0); if (out < .25) y = (1 - out / .25) * 220; return `<span style="transform:translateY(${y.toFixed(1)}px)">${ch === ' ' ? '&nbsp;' : ch}</span>`; }).join(''); }
  const WORDS = cfg.words || window.WORDS || []; const EMPH = new Set(cfg.emph || []); const capEnd = cfg.loop ? 1e9 : (cfg.capEnd ?? 1e9);
  const PH = []; { let cur = []; WORDS.forEach(w => { cur.push(w); if (/[.?,!…]$/.test(w.w) || cur.length >= (cfg.capWords || 3)) { PH.push(cur); cur = []; } }); if (cur.length) PH.push(cur); }
  PH.forEach((p, i) => { p.st = p[0].s; p.en = Math.min(PH[i + 1] ? PH[i + 1][0].s : 99, capEnd); });
  function capAt(t) { const e = $('cap'); const p = PH.find(p => t >= p.st - .05 && t < p.en); if (!p || t >= capEnd) { e.innerHTML = ''; return; }
    e.innerHTML = p.map(w => { const on = t >= w.s; const em = EMPH.has(w.w); const k = on ? clamp((t - w.s) / .1) : 0; return `<span style="color:${on ? (em ? '#FFC24B' : '#fff') : 'rgba(255,255,255,.45)'};transform:translateY(${(-10 * Math.sin(Math.PI * k)).toFixed(1)}px) scale(${(1 + .1 * Math.sin(Math.PI * k)).toFixed(3)})">${w.w}</span>`; }).join(''); }
  // chips [t0,t1,x,y,html|fn(t),rotDeg,cls]
  function chipsAt(CH, t) { $('chips').innerHTML = CH.filter(c => t >= c[0] && t < c[1]).map(c => { const s = t - c[0], o = c[1] - t; const k = spring(s * 1.1); const a = clamp(s / .08) * clamp(o / .12);
    const h = typeof c[4] === 'function' ? c[4](t) : c[4];
    return `<div class="chip ${c[6] || ''}" style="left:${c[2]}px;top:${c[3]}px;opacity:${a};transform:translate(-50%,-50%) rotate(${c[5] || 0}deg) scale(${(k * (o < .12 ? .9 + .1 * o / .12 : 1)).toFixed(3)})">${h}</div>`; }).join(''); }
  // ---------- run ----------
  function run(build) {
    const V = build(S); const K = V.cam, TT = V.titles || [], CH = V.chips || [];
    if (cfg.loop) { const f = K[0], l = K[K.length - 1]; if (!(f[1] === l[1] && [2, 3, 4].every(i => Math.abs(f[i] - l[i]) < 1e-3))) console.warn('LOOP: last camera key differs from the first', f, l); }
    $('hdr').textContent = cfg.header || '';
    function frame(t) { uid = 0; CAM = camAt(K, t); S.cam = CAM;
      $('world').innerHTML = V.draw(t, CAM) || ''; $('hud').innerHTML = V.hud ? V.hud(t, CAM) : '';
      $('turb').setAttribute('seed', String(1 + Math.floor(t * FPS) % 6));
      titleAt(TT, t); capAt(t); chipsAt(CH, t);
      const mid = V.mid ? V.mid(t) : null; $('mid').innerHTML = mid ? mid.html : ''; if (mid && mid.top) $('mid').style.top = mid.top + 'px';
      $('hdr').style.opacity = (V.hideHeader && V.hideHeader(t)) ? 0 : 1; }
    document.fonts.load('600 40px Fredoka').then(() => document.fonts.ready).then(() => { frame(0);
      window.renderFrame = f => new Promise(ok => { frame((f - 1) / FPS); requestAnimationFrame(() => ok()); }); window.seek = frame; window.ready = true; });
  }
  const S = { W, H, FPS, clamp, lerp, sm, out3, in2, inout, outBack, spring, env, pop, squash, rng, R, mixHex, blink,
    g, tone, ell, rr, path, line, text, glow, bg, ellD, rrD, linId, glowId, nid, face, hippo, hippoHead, pip, HP, PP,
    img, blurId, texture, puppet, motes, grade, magnifier, pill, meter, gauge, card, bubbles, puff, ring, stars, sparkle, qmark, cross, speed, layer, camAt, run, cam: CAM };
  return S;
}
