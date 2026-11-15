---
name: pixel-video
description: Direct and render an 8-bit / 16-bit pixel-art 3D-to-pixel video in Three.js with nearest-neighbour block sampling, 4x4 Bayer ordered dithering, custom palette snapping, bitmap pixel captions, and chiptune audio. Invoked via /pixel-video or when the user asks for a pixel-art video.
---

# Pixel-Art Video (`/pixel-video`)

Build deterministic 30 fps pixel-art videos (`kit/engines/pixel/`) using Three.js geometry rendered through `makePixelPost` (`pixelpost.js`): nearest-neighbour block sampling (`size: 4` or `5`), locked 16-to-32 colour palette snapping, and `4x4` ordered Bayer dithering, paired with crisp bitmap pixel captions (`Silkscreen` + `Press Start 2P`) and synthesized chiptune audio (`scripts/chiptune.py`).

## Quick start

1. Copy the starter engine into your film folder:
   ```bash
   mkdir -p my-film && cp -R ~/.claude/skills/lowpoly-video/kit/engines/pixel/* my-film/
   ```
2. Configure `my-film/src/scenes.js`:
   - `config.pixel = { size: 5, dither: 1, palette: [...] }`
   - Use organic & voxel builders in `S`: `blob(r, hex, {eyes, stretch, emissive, glow})`, `halo(r, hex, alpha)`, `shapeMesh(...)`, `tube(...)`, `eyes(...)`, `cell(...)`, `rugae(...)`, plus all `S.P` props (`house`, `person`, `tree`, `boat`, `lamp`).
   - Add pixel caption cards via `cards: [[t0, t1, 'LINE ONE|#*BIG GOLD LINE*|_SMALL SUBLINE']]` or word-synced `words.js`.
3. Preview stills, inspect pixel crispness (zero bilinear blur, uniform pixel grid), then run `sh build.sh`:
   ```bash
   cd my-film
   node ~/.claude/skills/lowpoly-video/scripts/render_gpu.mjs --html src/index.html --seconds 3 --width 1080 --height 1920 --fps 30 --output render/silent.mp4 --preview
   DUR=3 LOOP=1 sh build.sh
   ```
