---
description: Direct and render a stickman storytelling video (plain white circle head, dot eyes, black stick limbs, white cartoon gloves inside a warm cel-shaded 2D world).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/style-library.md` (#4 Stickman storytelling), and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.stickman`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` Canvas 2D scene using the stickman storytelling grammar. Verify 3 preview frames (`--preview`) before full MP4 render and SFX mix.
