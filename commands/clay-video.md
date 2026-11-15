---
description: Direct and render a soft 3D clay explainer video (rounded pastel forms, radial key-light gradients, specular highlights, soft contact shadows).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/cards/rounded-3d-explainer.md`, and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.clay`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` scene with rounded clay forms, radial key-light shading, specular oval highlights, and soft drop shadows. Verify `--preview` stills first, then export the full MP4 with squishy pop/ding SFX.
