---
description: Direct and render an ukiyo-e woodblock print animated video (indigo bokashi gradients, carved ink outlines, flat colour blocks, figure stepped on threes at 10 fps, smooth camera).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/style-library.md` (#2 Ukiyo-e woodblock), and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.ukiyoe`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` Canvas 2D page with bokashi gradients, carved `#1B1724` ink outlines, stepped figure motion (`Math.floor(t * 10) / 10`), smooth rain/camera, red hanko seal, and woodblock paper grain. Render `--preview` stills first, inspect them, then export MP4 with sound.
