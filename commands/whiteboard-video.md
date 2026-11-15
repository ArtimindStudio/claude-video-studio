---
description: Build a 1080x1920 30fps Whiteboard sketch explainer video with progressive marker stroke draw-on and violet annotations.
argument-hint: <topic, script, or scene description>
---

Build a **Whiteboard sketch** vertical video (`1080x1920`, `30 fps`) for:

$ARGUMENTS

Follow these rules:
1. Read `~/.claude/skills/video-studio/SKILL.md` and `~/.claude/skills/video-studio/references/whiteboard-style.md`.
2. Inspect the working reference scene at `~/.claude/skills/video-studio/kit/scene_v2/whiteboard.html` (or `~/.claude/skills/lowpoly-video/kit/scene_v2/whiteboard.html` if Pro is installed).
3. Palette & geometry: warm white board (`#FAF8F4`), crisp black marker paths (`#18181B`, `3.5px` round caps), one single accent colour (`#7C3AED` electric violet) for the key circle/arrow annotation, and hand-lettered labels.
4. Motion: progressive stroke draw-on in stroke order during the first `1.6s`, followed by continuous secondary motion (steam, typing, arrows) with zero static holds over `12 frames`.
5. Expose deterministic `window.__seek(f)` and render to MP4 with:
   `node ~/.claude/skills/video-studio/scripts/render_html.mjs scene.html --frames <N> --fps 30 --out out.mp4`
