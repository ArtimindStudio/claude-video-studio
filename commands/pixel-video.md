---
description: Direct and render a true pixel-art video using the pixel-video engine (nearest-neighbour grid, 4x4 Bayer dither, locked palette, bitmap pixel captions, chiptune bed).
argument-hint: <script or topic> [--loop]
---

Read and follow `~/.claude/skills/pixel-video/SKILL.md` and `~/.claude/skills/video-studio/references/cards/pixel-art.md`.

User request: `$ARGUMENTS`

1. Scaffold a new film folder from `~/.claude/skills/lowpoly-video/kit/engines/pixel/`.
2. Lock a 16–24 colour palette in `config.pixel`, build the scene in `src/scenes.js` (`blob`, `halo`, `eyes`, `S.P`), and configure bitmap pixel caption cards (`cards`).
3. Render preview stills (`render_gpu.mjs --preview`), verify crisp nearest-neighbour pixels with zero blur, then run `sh build.sh` (synthesizes chiptune bed via `chiptune.py`, mixes SFX, and runs QA).
