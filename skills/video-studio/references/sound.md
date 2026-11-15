# Sound

Sound is half the film. You cannot hear: every claim about audio carries an earshot number.

## 1. Targets (measured on 7 professional launch films)

| Metric | Target |
|---|---|
| Music presence | under (nearly) the whole film; pick the track first, cut picture to it |
| Tempo | 108-136 BPM (median 123); 120-128 for aiartimind tech shorts |
| Integrated loudness | -14 LUFS master; true peak <= -1 dBTP (-1.5 safer for AAC) |
| Loudest 3 s vs integrated | +1.1..+3.5 LU (steady body, no huge spikes) |
| First sound | within 0.04-0.48 s; no silent cold open |
| Ending | last 3 s at body level; fade 0.1-0.5 s; dead air < 0.1 s |
| Rhythm | 2.5-8 onsets/s overall but only ~1.2-1.7 salient hits/s |
| Accents | NOT on every cut: on the reveal, the logo, key UI actions, the turn |
| Voice | compressed, then ~10 dB over music by RMS; duck music 6-12 dB under VO |

## 2. Layers and directing rules

- Three layers: ambience/bed, foley/SFX tied to on-screen actions, music.
- Every visible action that matters has a sound in the style's material (paper, wood, plastic, glass, chalk, pixel).
- At least one near-silence before the turn or peak; the first sound after it is one of the most important.
- Use sound as a transition twice: bring the next scene's sound in early (J-cut) or let it run over (L-cut).
- Music edits on bar lines with short crossfades; cut whole bars from the middle; keep the track's own ending.
  Put the drop on the hero reveal.
- Before a big hit, step the music down 6-12 dB for 0.3-0.5 s and bring it back with the hit (not constant ducking).
- One material palette per film. Style sound palettes are in `styles.md`.

## 3. Voice-over (when the film speaks)

The voice comes first: its real length sets the film's length (`directing.md` §1).

- **User recording**: use it as it is.
- **ElevenLabs** (default for aiartimind, key `ELEVENLABS_API_KEY`): model `eleven_multilingual_v2`, a voice
  matched to the content (house narrator: James `uh5qBlKfjqFl7XXhFnJi`), tempo 1.1x after synthesis
  (`ffmpeg -af atempo=1.1`). One master take keeps the delivery even; per-line clips only when lines must
  move independently. Spell numbers out in the TTS text, write digits in captions.
  aiartimind: `python scripts/eleven_tts.py <slug> [--text-file f] [--voice ID] [--tempo 1.1]` (cached by
  request hash, cost logged). Elsewhere: `POST https://api.elevenlabs.io/v1/text-to-speech/<voice_id>`
  with `{"text", "model_id", "voice_settings"}` and the `xi-api-key` header.
- **Offline / no key**: Kokoro (English) or edge-tts (Chinese) through the Opuscar `core/tts/` tools.
- **Check every take**: transcribe with faster-whisper; diff against the script; the word timestamps become
  `timeline.json`. Re-generate any line that does not match.
- **Mix**: compress the voice first, then sit it ~10 dB over the music by RMS; duck music 6-12 dB under it.

## 4. Cue list from the picture

Every sound sits on a frame the picture code computes: a contact frame, a pop-in's 50 % frame, a move's velocity
peak, the frame a word becomes readable. Write `cues.json` from the same timeline:

```json
[{"t": 0.10, "role": "hit"}, {"t": 1.43, "role": "pop"}, {"t": 2.80, "role": "whoosh.short"},
 {"t": 6.00, "role": "riser"}, {"t": 6.80, "role": "drop"}, {"t": 9.20, "role": "bell", "pitch": "E5"}]
```

Role guide (earshot `launch` kit, offsets measured from pro films and applied automatically):

| Picture event | Role | Sync |
|---|---|---|
| chip / card / row / bubble arrives | `pop` (runs >= 114 ms apart) | onset +4 ms |
| hover, small highlight, list tick | `tick`, `tick.crisp` | onset, runs >= 66 ms |
| element lands with weight | `land`; light: `land.light` | +30 ms; tap leads -60 ms |
| wood/plastic contact, stamp | `tock` | leads -40 ms |
| hard cut / section punch | `hit`; bass drop at the reveal: `drop` | onset |
| fast move, card throw, whip-pan | `whoosh.short` | peak +37 ms after the cut |
| big scene change, logo slam | `whoosh.long` | peak lands on the thump |
| build into reveal | `riser` (peak -23 ms before), `swell` (peak +42 ms after) | peak |
| typing | `key`, `key.space`, `key.return` (>= 87 ms apart) | onset +8 ms |
| button press / confirm | `click`, `click.confirm` | click leads -11 ms |
| snap zoom, freeze frame, screenshot | `snap` | onset |
| reveal / success / number lands | `bell` with a pitch in key of the music | leads -20 ms |
| caption word / text pluck | `text` | onset, >= 110 ms apart |

Density: music-led films carry ~3-13 effects per 10 s. Fewer, better placed, beats a hit on every cut.

## 5. Two ways to get sounds

**A. Code bank (fast, deterministic, no licence issues)** - earshot's 252 sounds made in code:
```bash
$EARSHOT_PY -I <skill>/scripts/sfx_from_cues.py --cues cues.json --out audio/sfx.wav --duration 32.5 --music audio/music.wav
$EARSHOT_PY -m earshot sfx list --kind whoosh                         # browse
$EARSHOT_PY -m earshot sfx render whoosh_fast/crisp -o w.wav --dur 0.8 --apex 0.32   # aim one sound
$EARSHOT_PY -m earshot sfx check w.wav                                # clicks, cut tails, clipping
```
Families: ui_pop, knock, cut_hit, mallet (glock/celesta/marimba/pluck), drip, shutter, reverse_swell, whoosh_fast,
whoosh_big, riser, swish, glitch, notify, typing_key, click, tap, toggle, sub_drop, impact, logo_sting, shimmer, zip.

**B. Real licensed recordings (premium launch films, foley-heavy styles)** - the `real-sound` process:
source from Freesound (CC0/CC BY), Mixkit, the host's own SFX library; for each candidate:
```bash
$EARSHOT_PY -m earshot rank "a soft felt mallet hit on a wooden block" downloads/ --top 5
$EARSHOT_PY -m earshot find best.wav "a single clean mallet hit" --top 3        # trims (start/end s)
$EARSHOT_PY -m earshot realness best.wav --start 1.12 --end 1.48               # use only "real or pro-produced"
```
Keep a manifest with source URL and licence per file; list every one in `CREDITS.md`. Code never "improves" a
real recording beyond trim, level, pan, EQ, pitch by resampling.

Pixel, chiptune, glitch and sci-fi styles: synthesized sound is correct; read realness as information.

## 6. Mix and master (ffmpeg)

```bash
# VO + music (ducked under VO) + SFX, then two-pass loudnorm to -14 LUFS / -1.5 dBTP
ffmpeg -i audio/vo.wav -i audio/music.wav -i audio/sfx.wav -filter_complex \
 "[1:a]volume=0.25[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=300[md];\
  [0:a][md][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.89[mx]" -map "[mx]" -ar 48000 audio/premix.wav
ffmpeg -i audio/premix.wav -af loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json -f null - 2>&1 | tail -12   # pass 1
ffmpeg -i audio/premix.wav -af loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=..:measured_TP=..:measured_LRA=..:measured_thresh=..:offset=..:linear=true -ar 48000 audio/mix.wav
ffmpeg -i video.mp4 -i audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest final.mp4
```
Opuscar alternative: `sh $LEMO_OPUSCAR_HOME/core/render/mux.sh video.mp4 mix.wav final.mp4 30 [grain]`.

## 7. Listen (always, before calling sound done)

```bash
sh <skill>/scripts/sound_check.sh final.mp4 cues.json     # writes qa/sound/{summary.txt,timeline,critique,sheet.png}
```
- Open `sheet.png`: cue markers green = within a frame, amber = within 100 ms, red = no sound. Gaps, pile-ups,
  masking and late hits show at a glance.
- `timeline`: sync offset_ms per cue (negative = early); only better-than-chance sync means anything.
- `critique`: verdict (launch-grade / close / needs work); fix critical rows first, re-render, re-check.
- A/B one change at a time: `earshot ab before.wav after.wav --query "warm punchy kick"`.
Report with numbers: "critique close, 21/23 in range; -14.1 LUFS, -1.6 dBTP; 14/15 cues within a frame".
