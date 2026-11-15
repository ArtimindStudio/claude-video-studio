# Style Card: PS2 Low-Poly (`ps2`)

## Signature
Early-2000s console cutscene aesthetic built in `three.js`: low-polygon meshes with visible silhouette facets, low-resolution painted textures (`64x64` to `256x256`), Lambert/Gouraud vertex lighting, atmospheric distance fog, and a low internal render resolution (`360x640` or `540x960`) upscaled with bilinear filtering to `1080x1920`.

## Geometry
- Expressive low-poly 3D environments and subjects (`150–800` triangles per hero prop/character) where silhouette planes clearly define the form.
- Game-cutscene staging: over-the-shoulder shots, dramatic low-angle establishes, slow dolly pushes and deliberate camera cuts between speakers or mechanisms.

## Edges
- Crisp polygon facet edges with vertex colour gradients across triangles; no sub-surface scattering or high-poly bevels.
- Optional subtle letterbox bars (`6 %` top and bottom) or retro HUD frame when the story calls for a cutscene monitor look.

## Shading
- `THREE.MeshLambertMaterial` or `THREE.MeshBasicMaterial` with vertex colours, baked shadow blobs on the floor, and linear depth fog (`THREE.Fog`) that blends distant geometry into the sky colour.
- Mild colour quantization/banding; zero glossy PBR clearcoat or ray-traced reflections.

## Motion
- **Keyframe cutscene acting:** decisive poses with anticipation, linear-to-stepped interpolation, head turns and prop gestures timed to spoken nouns.
- **Camera grammar:** slow continuous dolly push on holds, whip-pan or hard angle cut on section changes, and low-poly billboard particles (dust motes, sparks, data cubes).

## Type
- Early-2000s geometric sans or condensed HUD typography (`28–44 px`) with a semi-transparent dark dialogue gradient strip at the bottom safe zone and a pulsing confirm triangle at the end of each spoken phrase.

## Sound
- **Bed:** moody breakbeat, atmospheric synth pad or low-reverb room tone (`110–126 BPM`).
- **Effects:** muffled console foley, menu select blips (`click`, `click.confirm`), low thumps (`land`), and mechanical triggers (`tock`).

## Avoid
- Glossy modern `MeshPhysicalMaterial` with metallic reflections and HDRI environment maps.
- Mixing 2D flat pixel-art sprites into a 3D bilinear-filtered scene.
- High-frequency procedural noise textures that shimmer at low internal resolution.

## Failures to check on style frames
1. Does the frame read as an authentic low-poly 3D cutscene with Lambert lighting and depth fog, or modern shiny 3D?
2. Is the camera framed like a director's cutscene (over-shoulder, close-up insert, low-angle hero) rather than a flat orthographic diagram?
3. Are subtitles readable inside the lower safe zone against a subtle cutscene backing bar?
