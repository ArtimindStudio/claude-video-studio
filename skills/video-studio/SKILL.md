---
name: video-studio
description: Direct and build a high-quality video entirely in code, in any visual style (aiartimind editorial, Dan Koe line art, chalkboard, pixel art, ZackD clay 3D, comic, flat vector, glow sketch, PS2, CGI, toy bricks, plus 68 library styles such as ukiyo-e, watercolor, swiss-motion, dark-keynote, teardown), with motion graphics that never rest and sound effects placed and checked on the cut. Use when asked for a video, reel, short, explainer, promo, launch film or animation, when a script or idea should be animated in a named style, when a video needs SFX, a music edit or a sound check, or when an existing render needs motion or sound QA. Works in Claude Code, Antigravity and Codex.
---

# Video Studio

One skill for code-made video: story, style, motion, sound, render, QA. It compacts four sources
(Lemo-Opuscar directing, Animation Studio styles, earshot listening, real-sound supervision) and the
aiartimind motion bar into one process. Paths below are relative to this skill folder (`<skill>`).

**Agent-neutral.** Any agent with a shell can run it (Claude Code, Antigravity, Codex). Where a step says
"look at", open the PNG with your image viewer tool. Where it says "sub-task", use sub-agents if your agent
has them, otherwise do it yourself in sequence.

## Hard rules

1. **You cannot see motion or hear sound. Measure both.** Never say a frame reads well without opening a still,
   and never say audio fits without an earshot number (`z +3.1`, `-14.2 LUFS`, `sync 92 % within a frame`).
2. **The picture is a pure function of time.** `render(t)` or `renderFrame(f)` draws any frame alone, in any
   order. No wall clock, no unseeded random, no state from the previous frame.
3. **One timeline drives everything.** Beats, word timings, cuts, SFX cues and captions read the same JSON.
4. **Style is grammar, not a palette.** Geometry, edges, shading, motion and sound must all belong to the style.
5. **Script is locked.** Keep the user's words, order, names and facts. Visuals prove the exact claim.
6. **No copying.** References teach technique; never reuse their characters, shots, melodies, logos or fonts.
7. **Real files or nothing.** Report only a render you probed with `ffprobe`. Never present stills as a video.

## Process

| # | Step | Output | Read |
|---|---|---|---|
| 0 | Intake: script / idea, style, format, length, VO, captions, assets. Ask at most one blocking question | `project.json` | `references/directing.md` §1 |
| 1 | Pick the style and the engine | style line in `project.json` | `references/styles.md`, `references/engines.md` |
| 2 | Treatment: benchmark, 3 candidate structures, logline, shot list, beat sheet, cue map, sound table | `TREATMENT.md` | `references/directing.md` §2-5 |
| 3 | Timeline: VO first (its real length sets duration), word timings, beats, cues | `timeline.json`, `cues.json` | `references/directing.md` §6 |
| 4 | Prove the look: 3 style frames (or model sheet) with the real drawing code; check them | `previews/*.png` | `references/styles.md` |
| 5 | Build every beat to the motion bar | source + `build.sh` | `references/motion.md` |
| 6 | Sound: music bed first, SFX kit from cues, mix, master -14 LUFS | `audio/` | `references/sound.md` |
| 7 | Render, mux, QA (picture + sound), one fix round | `final.mp4` | `references/qa.md` |
| 8 | Deliver: MP4, poster, SRT if spoken, TREATMENT, CREDITS, source with one-command build | project folder | `references/qa.md` §Deliver |

Defaults when the user is silent: 9:16 1080x1920 for shorts (16:9 1920x1080 for YouTube), 30 fps (24 for
film-like styles), length set by the VO or ~130-160 spoken words/min, captions on for social shorts, -14 LUFS.

## Tools (run `sh <skill>/scripts/doctor.sh` once per machine)

| Tool | Path | Use |
|---|---|---|
| HTML to MP4 renderer | `scripts/render_html.mjs` (set `PLAYWRIGHT_DIR=$LEMO_OPUSCAR_HOME`) | any `renderFrame(f)` page: `--preview` stills, then MP4 with audio |
| Sound check | `scripts/sound_check.sh <final.mp4> [cues.json]` | earshot timeline + sheet + critique + measure into `qa/sound/` |
| SFX from cues | `scripts/sfx_from_cues.py` | renders bank SFX for each cue, places them on the cut, writes `sfx.wav` |
| earshot | `$EARSHOT_PY -m earshot` (default `~/earshot/.venv/bin/python`) | describe / rank / realness / sfx / kit |
| Opuscar library | `$LEMO_OPUSCAR_HOME` (default `~/lemo-opuscar`) | 68 `styles/<slug>/STYLE.md`, `core/render/*` (still, video, readcheck, mux) |
| Remotion + MotionKit | the project's `remotion_studio/` if present | aiartimind house style (see `references/engines.md`) |

If a tool is missing, say which one and fall back (`references/engines.md` §Fallbacks); do not install system
software without the user's go-ahead.

## Project folder

Use the host project's storage rule if it has one (aiartimind: `production_hub/<slug>/`, read
`PRODUCTION_HUB_DATA_MANAGEMENT.md`). Otherwise `<cwd>/<slug>/`:

```
project.json  TREATMENT.md  timeline.json  cues.json
src/ (index.html or Remotion comp)  audio/ (vo, music, kit, sfx.wav, mix.wav)
previews/  qa/  final.mp4  poster.jpg  final.srt  CREDITS.md  build.sh
```
