---
name: flat-video
description: Direct and render a glow flat-vector (Kurzgesagt-inspired original grammar) animated video in pure SVG and DOM. Features two-tone shaded shapes, soft radial glows, riggable expressive characters, multi-plane parallax camera, and pill HUD overlays. Invoked via /flat-video or when the user asks for a flat-vector explainer video.
---

# Glow Flat-Vector Video (`/flat-video`)

Build deterministic 30 fps flat-vector explainer videos in pure SVG (`kit/engines/flat/`). Every frame is a pure function of time `t` (`window.renderFrame(f)`).

## Quick start

1. Copy the starter engine into your film folder:
   ```bash
   mkdir -p my-film && cp -R ~/.claude/skills/lowpoly-video/kit/engines/flat/* my-film/
   ```
2. Author `my-film/src/scenes.js` exporting `config` and `export default function build(S)`:
   - **Two-tone SVG primitives (`S`):** `ell(cx, cy, rx, ry, lightHex, darkHex)`, `rr(x, y, w, h, r, lightHex, darkHex)`, `tone(pathD, lightHex, darkHex)`, `path(d, fill, opts)`, `line(...)`, `glow(cx, cy, r, hex, alpha)`, `bg(topHex, botHex)`, `motes(t, seed, ...)`, `grade(topHex, botHex, op)`.
   - **Characters & Faces (`S`):** `face({eyeR, gap, mood, blink, look, blush})`, `hippo(opts)`, `bird(opts)`, `bacteria(opts)`.
   - **Multi-plane Parallax Camera:** `cam: [[t, set, cx, cy, zoom], ...]`, `layer(depthFactor, svgMarkup)`, `pill({x, y, text, color, k})`.
3. Preview stills first, inspect them, then render with `sh build.sh`:
   ```bash
   cd my-film
   node ~/.claude/skills/lowpoly-video/scripts/render_gpu.mjs --html src/index.html --seconds 3 --width 1080 --height 1920 --fps 30 --output render/silent.mp4 --preview
   DUR=3 LOOP=1 sh build.sh
   ```
