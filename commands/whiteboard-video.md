---
description: Direct and render a whiteboard marker draw-on explainer video (black marker linework on warm off-white, one violet accent, progressive stroke draw-on).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/style-library.md` (#1 Whiteboard draw-on), and reference implementation `~/.claude/skills/lowpoly-video/kit/scene_v2/scene.js` (`S.whiteboard`).

User request: `$ARGUMENTS`

Build a deterministic `window.renderFrame(f)` HTML/Canvas or SVG seek page where black marker strokes draw on progressively with one `#7C3AED` accent annotation and hand-lettered labels. Render `--preview` frames with `render_html.mjs`, inspect them, then render the full MP4 and mix marker/tap SFX cues.
