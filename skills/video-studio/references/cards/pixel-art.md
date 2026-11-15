# Style Card: Pixel Art (`pixelart`)

## Signature
True 16-bit integer pixel art drawn on a low-resolution logical canvas (`180x320`, scaled `6x` with nearest-neighbour to `1080x1920`), with crisp `1 px` dark outlines, `3–5` discrete shade bands per material, and ordered Bayer dithering.

## Geometry
- Logical grid of `180x320` integer coordinates (`image-rendering: pixelated; ctx.imageSmoothingEnabled = false`).
- Hero sprites and UI dialogue boxes occupy at least a third of the logical frame height (`60–110` logical pixels tall) so silhouettes read immediately on a phone screen.
- All sprite coordinates, camera pans and UI borders snap to integer logical pixels (`Math.round(x)`).

## Edges
- `1 px` dark ink or selective-outline border (`#141020`) around characters, props and dialogue frames; interior edges use high-contrast shade steps without anti-aliasing.
- Zero sub-pixel rendering, zero bilinear blur.

## Shading
- Strictly `3–5` discrete colour ramps per object (shadow, midtone, base, highlight, rim) drawn from a locked 16-to-32 colour palette suited to the story.
- Transitions between large flat sky or floor bands use `2x2` or `4x4` ordered Bayer dithering, never smooth CSS gradients.

## Motion
- **Stepped sprite animation on twos:** character and object poses step at `12–15 fps` (every 2 frames at 30 fps) with whole-pixel squash and stretch (`1–2` logical pixels on impact) and pixel dust/spark particles.
- **Smooth camera:** camera pans and parallax background layers step cleanly every frame so the world never feels frozen.
- **UI reveals:** dialogue boxes open with stepped 4-frame scale pops and letter-by-letter typewriter text tied to speech.

## Type
- True bitmap pixel font rendered at integer multiples of its native pixel height (`8 px` or `16 px` logical height = `48 px` or `96 px` on the `1080x1920` output), with a `1 px` drop shadow in `#141020`.

## Sound
- **Bed:** 16-bit chiptune or FM-synth groove (`120–132 BPM`).
- **Effects:** synthesized chiptune blips, square-wave impacts (`hit`), rapid text ticks (`key` / `text` `>= 87 ms` apart), and coin/confirm pings (`bell` / `click.confirm`). Synthesized audio (`earshot` code bank) is native to this style.

## Avoid
- Drawing high-resolution text or smooth vector icons on top of upscaled pixel art.
- Mixing pixel sizes ("mixels" — e.g. `4x` sprites beside `6x` backgrounds).
- Sub-pixel floating-point transforms that cause shimmering pixel edges.

## Failures to check on style frames
1. Is every edge crisp nearest-neighbour (`imageSmoothingEnabled = false`) with zero blurry resampling?
2. Are all pixels uniform in size (`6x6` screen pixels per `1x1` logical pixel) across sprites, UI and text?
3. Are there any smooth gradients instead of discrete shade bands and ordered dither?
