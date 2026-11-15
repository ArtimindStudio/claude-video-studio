---
description: Direct and build a high-quality video in code (choose from 10+ proven styles, prove the look on 3 stills, build deterministic motion, place and verify sound with earshot, render MP4).
argument-hint: <topic, script, or style + idea>
---

Read and follow `~/.claude/skills/video-studio/SKILL.md` (or `.claude/skills/video-studio/SKILL.md`).

User request: `$ARGUMENTS`

1. If the user named a style, lock it in `project.json` and read its style spec in `references/style-library.md` and `references/cards/`. If not, recommend the best-fitting style from `references/STYLE_CHOOSER.md`.
2. Write `TREATMENT.md`, `timeline.json`, and `cues.json`.
3. Render 3 style-frame previews first (`--preview`), inspect every PNG visually, then render the full MP4, mix audio (`sfx_from_cues.py` + music bed), and run `sound_check.sh`.
