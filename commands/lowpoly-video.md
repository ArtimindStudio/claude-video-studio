---
description: Direct and render a low-poly 3D diorama video using the Three.js orthographic engine (GTAO, bloom, key/fill/rim light, rising titles, spring chips).
argument-hint: <script or topic> [--loop] [--format 9x16|16x9]
---

Read and follow `~/.claude/skills/lowpoly-video/SKILL.md` and `~/.claude/skills/video-studio/references/cards/ps2-low-poly.md`.

User request: `$ARGUMENTS`

1. Scaffold a new film folder from `~/.claude/skills/lowpoly-video/kit/engines/lowpoly/` (ensure `src/fonts` and `src/vendor` resolve cleanly).
2. Design the sets (`A`, `B`, ...), camera keyframes (`cam`), sky gradients (`sky`), low-poly props (`S.P`, `island`, `hexPatch`, `box`, `cyl`), animations (`S.anim`), titles, and `cues.json`.
3. Render preview stills first (`render_gpu.mjs --preview`), visually inspect them for framing, lighting, and readability, then run `sh build.sh` to produce `final.mp4`.
