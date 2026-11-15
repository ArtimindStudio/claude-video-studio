---
description: Direct and render a glow flat-vector animated video in pure SVG (two-tone shapes, radial glows, riggable characters, multi-plane parallax camera).
argument-hint: <script or topic> [--loop]
---

Read and follow `~/.claude/skills/flat-video/SKILL.md` and `~/.claude/skills/video-studio/references/cards/flat-vector.md`.

User request: `$ARGUMENTS`

1. Scaffold a new film folder from `~/.claude/skills/lowpoly-video/kit/engines/flat/`.
2. Author `src/scenes.js` with two-tone SVG primitives (`ell`, `rr`, `tone`, `glow`, `motes`, `face`, `layer`, `pill`) and multi-plane camera moves (`cam`).
3. Render preview stills (`render_gpu.mjs --preview`), inspect hierarchy and glow contrast, then run `sh build.sh` to produce `final.mp4`.
