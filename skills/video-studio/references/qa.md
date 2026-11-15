# QA and delivery

## Review loop

1. **Look-proof stills** before the full build: opening, signature shot, one transition. Check against the style.
2. **Contact sheet** every 1-2 s after the build (Opuscar: `node core/render/still.mjs <proj> 1.5 12 --range 0:50:2`
   then `core/render/sheet.py`; or `ffmpeg -i final.mp4 -vf "fps=1,scale=270:-1,tile=6x5" qa/contact.png`). Open it.
3. **0.2 s strips** of every key action and transition (`ffmpeg -ss T -t 1.2 -i final.mp4 -vf "fps=5,scale=360:-1,tile=6x1" qa/strip_T.png`).
4. **Motion**: freezedetect + transition overlap check (`motion.md` §QA).
5. **Reading**: every text holds long enough (Opuscar `core/render/readcheck.mjs`, or the formula in `directing.md` §6).
6. **Sound**: `scripts/sound_check.sh` (`sound.md` §7).
7. **File**: `ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration final.mp4`;
   `ffmpeg -i final.mp4 -vf blackdetect=d=0.1:pix_th=0.05 -an -f null -` finds blank frames;
   `ffmpeg -i final.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -12` confirms loudness.
8. If the film has voice: transcribe the final mix (faster-whisper) and diff against the script.

**One fix round**: fix everything found, re-check once. Report anything bigger left in one line.

## Rubric (pass / fail, not praise)

1. Script fidelity: every essential noun, action and claim shown; meaning unchanged.
2. Style fidelity: geometry, edges, shading, materials, motion, camera and sound all in the style.
3. Hook: subject or result readable in the first 1-3 s.
4. Every beat advances information or action; no decorative filler or loops.
5. Continuity: same characters, props, colours, light across shots.
6. Legibility: no bad crops, overlaps, low contrast, captions over the subject; safe zones respected.
7. Motion bar: no hold > 1.5 s, no empty frames between states, changes on words, exits faster than entrances.
8. Sound: earshot critique "close" or better; accents on key moments within a frame; -14 LUFS, <= -1 dBTP;
   music under the film; no silent open, no dead tail.
9. Audio truth: supplied VO untouched except mix; no invented voices or uncredited music.
10. Proof: real H.264 MP4, right size/fps/duration, audio stream present; deterministic source saved.

Any fail: fix before calling it complete, or state exactly which failed and why.

## Deliver

- `final.mp4` (H.264, yuv420p, faststart, AAC 192k), `poster.jpg` (best frame or designed cover)
- `final.srt` when spoken
- `TREATMENT.md`, `project.json`, `timeline.json`, `cues.json`
- `CREDITS.md`: every third-party asset (music, SFX recordings, fonts, images, voice engine) with source and licence
- source + `build.sh` that rebuilds the film in one command
- `qa/` evidence (contact sheet, sound summary and sheet)

Tell the user where the folder and the film are, the earshot verdict and loudness, and anything not verified.
