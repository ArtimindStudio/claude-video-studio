---
name: lowpoly-video
description: Direct and render a low-poly 3D orthographic diorama video in Three.js with key/fill/rim lighting, GTAO ambient occlusion, bloom, colour grade, rising titles, word-synced captions, and spring chips. Invoked via /lowpoly-video or when the user asks for a low-poly 3D diorama film.
---

# Low-Poly 3D Video (`/lowpoly-video`)

Build deterministic 30 fps low-poly 3D orthographic diorama videos in Three.js (`kit/engines/lowpoly/`). Every frame is a pure function of time `t` (`window.renderFrame(f)`).

## Quick start

1. Copy the starter engine into your film folder:
   ```bash
   mkdir -p my-film && cp -R ~/.claude/skills/lowpoly-video/kit/engines/lowpoly/* my-film/
   ```
2. Author `my-film/src/scenes.js` exporting `config` and `export default function build(S)`:
   - **Sets (`SETS.A .. SETS.L`):** Each scene world lives at its own X offset (`put(obj, 'A', x, y, z)`). Camera keys in the same set interpolate smoothly; changing sets makes a clean cut.
   - **Stage builders (`S`):** `island(set, radius, waterHex, opts)`, `ground(set, size, hex)`, `hexPatch(set, radius, styleFn)`, `box(w,h,d,hex)`, `cyl(r,h,seg,hex)`, `prism(w,h,d,mat)`, `glowM(hex, base, intensity)`.
   - **Prop library (`S.P`):** `P.temple()`, `P.house()`, `P.cypress()`, `P.tree()`, `P.boat()`, `P.lamp()`, `P.brazier()`, `P.person({shirt, pants, hair, skin})`, `P.smoke(...)`, `P.planet(...)`.
   - **Animations (`S.anim`):** `anim(obj, t0, 'pop' | 'rise' | 'drop' | 'fn', opts)`.
   - **Camera & Sky:** `cam: [[t, set, tx, ty, tz, frustum, azDeg, elDeg], ...]`, `sky: [[t, topHex, botHex, sunI, sunHex, hemiI, stars], ...]`.
   - **DOM Overlays:** `titles: [[t0, t1, 'TEXT']]`, `chips: [[t0, t1, x, y, html, rotDeg]]`, `labels(t, cs)`, and word-synced captions from `words.js`.
3. Preview key frames first, inspect the PNGs, then build the final MP4:
   ```bash
   cd my-film
   node ~/.claude/skills/lowpoly-video/scripts/render_gpu.mjs --html src/index.html --seconds 3 --width 1080 --height 1920 --fps 30 --output render/silent.mp4 --preview
   DUR=3 LOOP=1 sh build.sh
   ```

See `references/loop.md` for seamless loop rules (`LOOP=1`).
