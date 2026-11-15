# Style Chooser

Style is grammar, not a colour palette. Every style sets six things at once — **geometry, edges, shading, motion, type and sound** — and the film holds all six from the first frame to the last.

## 1. Choose by topic

| Your topic | Start with | Card in `03_styles/cards/` |
|:---|:---|:---|
| **AI tools, product launches, interfaces** | House editorial, flat vector (or library: `dark-keynote`, `living-screencast`, `swiss-motion`) | `house-editorial.md`, `flat-vector.md` |
| **Ideas, mindset, philosophy, essays** | Minimal line art, glow sketch (or library: `one-line`, `ink-wash`) | `minimal-line-art.md`, `glow-sketch.md` |
| **Teaching a concept, system or process** | Chalkboard, rounded 3D explainer (or library: `whiteboard`, `iso-infographic`) | `chalkboard.md`, `rounded-3d-explainer.md` |
| **Numbers, benchmarks, hard evidence** | House editorial, flat vector (or library: `dataviz`, `data-physical`, `caption-news`) | `house-editorial.md`, `flat-vector.md` |
| **Story, nostalgia, gaming, physical mechanisms** | Pixel art, PS2 low-poly, comic art, cinematic 3D | `pixel-art.md`, `ps2-low-poly.md`, `comic-art.md`, `cinematic-3d.md` |

## 2. The ten core short-video styles

| Style | Card file | Signature | Moves like | Sounds like | Avoid |
|:---|:---|:---|:---|:---|:---|
| **House editorial** | `cards/house-editorial.md` | Cream paper `#F2EFEC`, one violet `#7C3AED`, serif italic headlines | Blur swaps (12 f in, 8 f out), staggered builds (4 f gap), word-by-word captions | Soft UI pops, knocks, a light tech bed at 120–128 BPM | Glow, glass, background cards behind text |
| **Minimal line art** | `cards/minimal-line-art.md` | White lines (1.5–3 px) and dot nodes (4–7 px) on pure black, big empty space | Lines draw on, dots travel paths, slow zoom, deliberate pauses | Sparse mallet/celesta notes on reveals, airy swells, near-silences | Gradients, noisy starfields, pseudo-3D, invisible strokes |
| **Chalkboard** | `cards/chalkboard.md` | Ivory chalk on a real dusty board, one accent colour (yellow/cyan/pink) | Stroke-by-stroke drawing in real order, circles/arrows annotate, eraser wipes | Chalk scratch per stroke group, tap on dots, soft knock on underline | Perfect Bézier curves, gradients, constant flicker, giant chalk tray |
| **Glow sketch** | `cards/glow-sketch.md` | Dotted luminous contours (`1 10` dash, 5–6 px) on near black `#07060B`, warm gold on key proof | Slow contour tracing, rare pulses, parallax depth planes | Soft shimmers, glock/celesta on light-ups, airy reverse swells | Solid neon tubes, purple-on-black mud, bloom everywhere |
| **Pixel art** | `cards/pixel-art.md` | True integer pixels scaled nearest-neighbour (6x at 1080 wide), 1 px outlines, 3–5 shade bands | Stepped motion on twos, whole-pixel squash, smooth camera | Chiptune blips, square-wave hits, coin/confirm pings | Blurry resampling, sub-pixel drift, smooth gradients |
| **PS2 low-poly** | `cards/ps2-low-poly.md` | Low-poly three.js meshes, low-res textures, Lambert lighting, bilinear upscale | Over-shoulder game-cutscene framing, slow push, keyframe acting | Muffled game foley, menu blips, low reverb room tone | Glossy modern PBR materials, pixel sprites, high-frequency noise |
| **Comic art** | `cards/comic-art.md` | Bold imperfect ink outlines, flat red/blue/yellow/cream/black, Ben-Day dot shading | Snappy pop-ins, panel wipes, impact holds, speed lines | Punchy hits, paper whooshes on panel turns, print-press thunks | A yellow burst in every shot, thin outlines, UI text over panels |
| **Flat vector** | `cards/flat-vector.md` | Large clean silhouette masses, 2–3 flat value planes per object, almost no outlines | Polished easing, masked reveals, shape morphs, parallax | Clean UI pops, soft swishes, wood knocks | Outlines everywhere, faux 3D shine, generic stock-art people |
| **Cinematic 3D** | `cards/cinematic-3d.md` | three.js `MeshPhysicalMaterial` with real roughness/metalness, key/fill/rim light, ACES | Realistic arcs and inertia, close-up to tracking to wide camera grammar | Weighty sub hits, real-sounding whooshes, mechanical foley, risers | Blank mannequins where identity matters, extreme bloom |
| **Rounded 3D explainer** | `cards/rounded-3d-explainer.md` | Soft vinyl/clay 3D (`roughness ~0.42`, `clearcoat ~0.35`), rounded bevels, warm key light | Establish shot, mechanism close-up, payoff; smooth camera focus | Squishy pops, soft thumps, quick cutaway whooshes, reveal ding | Featureless blobs replacing real subjects, heavy blur hiding action |

## 3. Library styles (68 code-built styles in Lemo-Opuscar)

When you install Lemo-Opuscar (`$LEMO_OPUSCAR_HOME`), you can also load any of its 68 `styles/<slug>/STYLE.md` specs:

| Group | Slugs |
|:---|:---|
| **Tech and product** | `dark-keynote`, `glass-product`, `living-screencast`, `desktop-flythrough`, `hologram-hud`, `teardown`, `circuit-board`, `swiss-motion`, `pictogram-motion`, `iso-infographic` |
| **Data and evidence** | `dataviz`, `data-physical`, `satellite-briefing`, `lidar-survey`, `white-model`, `microscope`, `visual-investigation`, `transit-map`, `briefing-board`, `telestrator` |
| **Hand-made explainer** | `whiteboard`, `chalkboard`, `watercolor`, `urban-sketch`, `crayon-book`, `one-line`, `isometric-picture-book`, `memphis-diorama`, `paper-popup`, `papercut-red`, `paper-lantern`, `shadow-puppet` |
| **Print and graphic** | `risograph`, `silkscreen-poster`, `halftone-dossier`, `woodcut`, `engraving`, `blueprint`, `art-deco`, `spy-titles`, `stained-glass`, `impasto`, `ink-wash`, `ukiyoe` |
| **Animation and toon** | `cel-anime-80s`, `rubber-hose`, `midcentury-toon`, `scifi-toon`, `game-show`, `microgame` |
| **3D and game** | `brick-toy`, `lowpoly-island`, `hd-2d`, `pixel-rpg`, `tilt-shift`, `printed-long-take`, `ascii-crt`, `backrooms` |
| **Edit and documentary** | `caption-news`, `news-package`, `newsreel`, `kino-montage`, `countdown`, `city-symphony`, `archive-lighttable`, `silent-film` |
