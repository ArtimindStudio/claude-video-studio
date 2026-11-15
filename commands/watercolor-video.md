---
description: Direct and render a cozy watercolour animated video (layered translucent washes that bleed past pencil lines, warm screen-blend lamp glow, drifting bokeh, multiply paper texture).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/style-library.md` (#8 Cozy watercolour), and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.watercolor`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` Canvas 2D scene with multi-pass blurred colour washes, soft pencil contours, warm radial screen glow, and multiply paper grain. Verify `--preview` stills first, then render the full MP4.
