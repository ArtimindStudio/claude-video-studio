---
description: Direct and render a dark keynote UI video (near-black canvas, hairline grid, violet accent, live metric cards, focus dimming, and count-up telemetry).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/style-library.md` (#7 Dark keynote UI), and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.keynote`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` scene (or Remotion `MotionKit.tsx` composition) on a `#09070F` hairline grid with `#8B5CF6` accents, live telemetry cards, and crisp typography. Render `--preview` stills first, inspect them, then export the full MP4 with UI clicks/whooshes.
