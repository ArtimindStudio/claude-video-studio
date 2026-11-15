---
description: Render SFX from cues.json with earshot's sound bank, mix with voice/music, and run earshot listening QA (measure, timeline, sheet.png, critique) into qa/sound/.
argument-hint: <path/to/final.mp4> [path/to/cues.json]
---

Read `~/.claude/skills/video-studio/references/sound.md`, `~/.claude/skills/earshot/SKILL.md`, and `~/.claude/skills/real-sound/SKILL.md`.

Target: `$ARGUMENTS`

1. If `cues.json` is provided and `audio/sfx.wav` is not yet built, run `sfx_from_cues.py` with `$EARSHOT_PY`.
2. Run `sh ~/.claude/skills/video-studio/scripts/sound_check.sh <final.mp4> [cues.json]`.
3. Open `qa/sound/sheet.png` with your image viewer tool and report measured LUFS, true peak dBTP, sync accuracy, and critique verdict.
