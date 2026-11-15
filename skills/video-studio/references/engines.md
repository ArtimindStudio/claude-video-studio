# Engines

| Engine | Pick when | Frame contract | Render |
|---|---|---|---|
| **HTML seek page** (Canvas 2D / SVG / three.js) | any style in `styles.md`, no React project, agent-neutral default | `window.renderFrame(f)` 1..N (`t=(f-1)/fps`), `window.ready=true` after fonts/images | `node <skill>/scripts/render_html.mjs` |
| **Opuscar core** | a library style, or you need readcheck, stills sweeps, two-pass mux with grain | `window.DUR`, `window.render(t)`, `window.READY`, optional `window.EV`, `window.TEXTS(t)` | `cd $LEMO_OPUSCAR_HOME && node core/render/video.mjs <proj> --fps 24 --size 1080x1920` |
| **Remotion** | aiartimind house style, MotionKit, word-synced captions from `master_words.json` | `useCurrentFrame()`; no `Math.random()` without seed | `npx remotion render <entry> <Comp> out.mp4 --concurrency=1` |

Rules for every engine:
- Lay the page out for the real frame size (`innerWidth` x `innerHeight`); never centre-crop a landscape layout.
- Seeded PRNG (`mulberry32(hash(id))`) for particles and jitter. Precompute layout once.
- Fonts self-hosted in the project (Google Fonts OFL), loaded before `ready`.
- Grain in ffmpeg, not in the page (page grain makes every frame slow and incompressible).
- Animate on twos where the style wants it (pixel, stop-motion, cel), but keep the camera smooth every frame.
- 3D: three.js, soft area lights + low-intensity HDRI, render at 2x and downsample for DOF/AO.

## Minimal seek page

```html
<canvas id="c"></canvas>
<script>
const W = innerWidth, H = innerHeight, FPS = 30, N = Math.round(DURATION * FPS);
const c = document.getElementById('c'); c.width = W; c.height = H; const g = c.getContext('2d');
const ease = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
window.renderFrame = f => { const t = (f - 1) / FPS; g.clearRect(0, 0, W, H); /* draw from t only */ };
document.fonts.ready.then(() => { window.ready = true; });
</script>
```

Render: preview first, look at the stills, then the MP4.

```bash
node <skill>/scripts/render_html.mjs --html $P/src/index.html --seconds 24 --width 1080 --height 1920 \
  --fps 30 --output $P/final_silent.mp4 --preview          # stills in previews/
node <skill>/scripts/render_html.mjs ... --audio $P/audio/mix.wav --audio-kind narration   # final
```
Needs Node 18+, ffmpeg + ffprobe, and a `playwright` whose Chromium is installed. It loads playwright from
`$PLAYWRIGHT_DIR` (else the working directory). Known-good: `PLAYWRIGHT_DIR=$LEMO_OPUSCAR_HOME` after Opuscar
`setup.sh deps`. A project playwright without its browser fails at launch: set `PLAYWRIGHT_DIR` or run
`npx playwright install chromium` there (with the user's go-ahead).

## Fallbacks

- No Playwright: use Opuscar core (its `setup.sh deps` installs a headless browser) or Remotion if present.
- No earshot: do measurement-only QA with `ffmpeg -af ebur128` and `astats`, and say sound was not listened to.
- No ffmpeg: stop and tell the user; deliver source + preview stills, never claim a video.
- Cloud / no local drive: write treatment, timeline and source; queue render and sound QA for a local session.
