---
description: Direct and render a storytime doodle cartoon video (8 fps boiling outlines, flat bright fills, expressive character poses, handwritten captions and sticker callouts).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/style-library.md` (#5 Storytime doodle), and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.doodle`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` Canvas 2D scene with 8 fps seeded outline boil (`rng(seed + Math.floor(t * 8))`), bold `#2A2A2A` ink contours, and handwritten callouts. Render `--preview` stills first, inspect them, then render the full MP4.
