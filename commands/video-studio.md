---
description: Check your Claude Video Studio setup or start a deterministic code-rendered video from a topic or script.
argument-hint: <topic, brief, or "doctor">
---

Run the **Claude Video Studio** workflow for:

$ARGUMENTS

Steps:
1. Read `~/.claude/skills/video-studio/SKILL.md` and `~/.claude/skills/video-studio/references/MOTION_RULES_POSTER.md`.
2. If the argument is `doctor` or `check`, run `sh ~/.claude/skills/video-studio/scripts/doctor.sh` and report the status of every tool.
3. In **Starter Lite**, build deterministic `window.__seek(f)` HTML/Canvas scenes using `~/.claude/skills/video-studio/kit/templates/seek-page-starter.html` or the `/whiteboard-video` grammar (`~/.claude/skills/video-studio/kit/scene_v2/whiteboard.html`), then render via `node ~/.claude/skills/video-studio/scripts/render_html.mjs`.
4. If the **Complete Studio Edition (Pro)** is installed (`~/.claude/skills/lowpoly-video/kit`), you also have access to all 17 slash commands (`/lowpoly-video`, `/pixel-video`, `/flat-video`, `/ukiyoe-video`, `/stickman-video`, `/doodle-video`, `/keynote-video`, `/watercolor-video`, `/clay-video`, `/chalkboard-video`, `/dankoe-video`, `/glowsketch-video`, `/comicart-video`, `/editorial-short`, `/sound-check`), the 10 style cards, MotionKit, and `sfx_from_cues.py`.
