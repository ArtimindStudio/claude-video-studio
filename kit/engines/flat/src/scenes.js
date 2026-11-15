// Style library test v2 on the /flat-video engine: "Night writer" (3 s seamless loop, no voice).
// A creator types at 3 AM, the cat sleeps, rain runs down the window, steam curls from the mug.
export const config = { header: '', emph: [], loop: true, capEnd: 0 };

export default function build(S) {
  const { ell, rr, path, line, text, glow, bg, layer, face, pill, motes, grade, rng, mixHex } = S;
  const TAU = Math.PI * 2, fr = x => x - Math.floor(x), sinL = (t, per, ph = 0) => Math.sin(TAU * (t / per + ph));
  const DESK = 1420, WX = 190, WY = 250, WW = 700, WH = 640;
  const r = rng(9), CITY = [], LIT = [], RAIN = [];
  for (let x = WX; x < WX + WW;) { const w = 50 + r() * 70, h = 110 + r() * 250; CITY.push([x, w, h]); for (let y = WY + WH - h + 20; y < WY + WH - 20; y += 36) for (let xx = x + 12; xx < x + w - 14; xx += 24) if (r() < .45) LIT.push([xx, y, r()]); x += w + 6; }
  for (let i = 0; i < 60; i++) RAIN.push([WX + r() * WW, r(), 30 + r() * 46]);
  // gentle push in and back out, same at both ends (loop)
  const cam = [[0, 'A', 540, 1010, 1.17], [1.5, 'A', 540, 1030, 1.23], [3, 'A', 540, 1010, 1.17]];

  function draw(t) {
    const tap = 4 * Math.sin(TAU * t / .25), by = tap * .5, breath = 1 + .045 * sinL(t, 1.5), tail = .35 * sinL(t, 3);
    const bl = (() => { const p = t % 3; return p > 1.9 && p < 2.06 ? Math.sin(Math.PI * (p - 1.9) / .16) : 0; })();
    // far: room and window
    let far = bg('#1E1050', '#5A2E96', -200, -200, 1480, 2400);
    let win = rr(WX - 18, WY - 18, WW + 36, WH + 36, 34, '#3B2490', '#2A1A6E');
    win += `<clipPath id="wc"><rect x="${WX}" y="${WY}" width="${WW}" height="${WH}" rx="18"/></clipPath><g clip-path="url(#wc)">`;
    win += bg('#141A4A', '#3B2C7A', WX, WY, WW, WH) + glow(760, 380, 160, '#FFE3A3', .55) + ell(760, 380, 52, 52, '#FFF3C4', '#F2DFA0');
    for (const [x, w, h] of CITY) win += rr(x, WY + WH - h, w, h + 10, 6, '#2A1C66', '#22155A');
    for (const [x, y, ph] of LIT) if (fr(t / 3 + ph) > .15) win += `<rect x="${x}" y="${y}" width="11" height="15" rx="2" fill="#FFC24B" opacity=".9"/>`;
    for (const [x, ph, len] of RAIN) { const u = fr(t / .75 + ph), y = WY - 60 + u * (WH + 80); win += line(x - u * 40, y, x - u * 40 - 12, y + len, '#B9C8FF', 3, .65); }
    win += '</g>' + line(WX + WW / 2, WY, WX + WW / 2, WY + WH, '#3B2490', 16) + line(WX, WY + WH * .55, WX + WW, WY + WH * .55, '#3B2490', 16);
    far += win + glow(540, 1180, 560, '#FF6FB5', .38) + motes(t, 3, 0, 300, 1080, 1300, 30, '#FFE3A3', { dir: 1 });
    // creator
    let mid = rr(372, 1128 + by, 336, 330, 150, '#E58BB5', '#C76A98') + rr(510, 1070 + by, 60, 70, 20, '#F6C7A8', '#E2A889');
    mid += ell(540, 985 + by, 120, 126, '#F6C7A8', '#E2A889');
    mid += path(`M418,${995 + by} Q414,${880 + by} 540,${852 + by} Q666,${880 + by} 662,${995 + by} Q640,${930 + by} 560,${925 + by} Q470,${925 + by} 418,${995 + by}Z`, '#2B1B4D');
    mid += `<g transform="translate(540,${990 + by})">${face({ eyeR: 15, gap: 40, mood: 'happy', blink: bl, look: [0, .5], blush: true, ink: '#2A1640' })}</g>`;
    mid += glow(540, 1010, 240, '#7FFFF3', .28);
    // laptop, desk, mug
    mid += rr(318, 1160, 444, 262, 26, '#3FD0C9', '#2BA6A0') + ell(540, 1290, 24, 24, '#FFE3A3') + glow(540, 1290, 60, '#FFE3A3', .6);
    mid += rr(-40, DESK, 1160, 600, 0, '#3B2490', '#2E1C78') + `<rect x="-40" y="${DESK}" width="1160" height="14" fill="#5A3AB0"/>` + rr(290, DESK - 14, 500, 26, 10, '#2BA6A0');
    mid += rr(130, 1270, 140, 152, 26, '#FFC24B', '#E0A030') + path(`M270,1305 q52,0 52,36 q0,36 -52,36`, 'none', { stroke: '#E0A030', w: 16 }) + ell(200, 1278, 62, 12, '#7A3E1A');
    for (let i = 0; i < 3; i++) { const u = fr(t / 1.5 + i / 3), x = 180 + i * 22, y = 1250 - u * 220, sw = 18 * sinL(t, 1.5, i / 3);
      mid += path(`M${x},${y + 60} C${x + sw},${y + 30} ${x - sw},${y + 10} ${x + sw * .5},${y - 30}`, 'none', { stroke: '#FFFFFF', w: 9, op: Math.sin(Math.PI * u) * .75 }); }
    // cat, breathing, tail swishing
    const cy = DESK - 62 * breath;
    let cat = path(`M1010,${DESK - 40} Q1065,${DESK - 130 + 40 * tail} ${960 + 50 * tail},${DESK - 155}`, 'none', { stroke: '#E07A3A', w: 28 });
    cat += ell(870, cy, 150, 66 * breath, '#FF9F5A', '#E07A3A');
    cat += path(`M702,${DESK - 100} L712,${DESK - 162} L746,${DESK - 120}Z`, '#E07A3A') + path(`M756,${DESK - 122} L792,${DESK - 160} L798,${DESK - 98}Z`, '#E07A3A');
    cat += ell(748, DESK - 70, 60, 56, '#FF9F5A', '#E07A3A') + `<g transform="translate(748,${DESK - 70})">${face({ eyeR: 11, gap: 20, mood: 'sleep', sleep: true, ink: '#3A1F1A', mouthY: 22, mouthW: 8 })}</g>`;
    for (let i = 0; i < 3; i++) { const u = fr(t / 3 + i / 3); cat += text(700 + u * 60, DESK - 190 - u * 220, 'z', 30 + u * 30, '#FFE3A3', { wt: 700 }).replace('<text', `<text opacity="${Math.sin(Math.PI * u).toFixed(3)}"`); }
    return layer(.3, far) + layer(1, mid + cat) + grade('#5A2E96', '#FF6FB5', .25);
  }
  const hud = t => pill({ x: 540, y: 150, text: '3:12 AM · STILL WRITING', color: '#FFC24B', k: 1 });
  return { cam, draw, hud, chips: [] };
}
