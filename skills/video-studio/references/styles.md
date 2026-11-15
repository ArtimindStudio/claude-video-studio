# Styles

**Start with `style-library.md`**: the 10 chosen high-quality styles (2026-11-12) with build routes and evidence.

Pick one. Implement its geometry, edges, shading, motion AND sound palette for every subject; a palette swap of
another style fails. Each style adapts to the script: it says how to draw whatever the user supplies, not a fixed
story or setting. "Inspired by" means the visual language, never a copy of a creator's videos or characters.

## A. Viral short styles (full spec here)

### house - aiartimind editorial (default for aiartimind)
Cream paper `#F2EFEC`, Electric Violet `#7C3AED`, Playfair Display italic headlines, dark purple statement
frames `#0F071D`, frameless sub-text `#5E546F`. Full-bleed 1080x1920, content grouped at optical centre.
No background cards, no glow, no glass. Icons in white tiles (hero / tile / inline sizes only). Motion: MotionKit
(`references/motion.md`). Sound: soft UI pops, knocks, short cut hits, swishes over a 120-128 BPM tech bed at
low level (`launch` kit). Read the host project's `DESIGN.md` / `ILLUSTRATION_STYLE_GUIDE.md` if present.

### dankoe - minimal constellation line art
Pure black, thin white lines 1.5-3 px, dot nodes 4-7 px at 1080 width, big negative space, strictly 2D.
Physical items: sample their outline into ~30-40 nodes connected in silhouette order. Abstract ideas: 2-3
elements whose relationship visibly changes. Motion: quiet path draw-on, dots travelling lines, slow zoom, pauses.
Orbit rings / sacred geometry only when they explain. Fails: gradients, noisy starfields, pseudo-3D, invisible strokes.
Sound: sparse; soft mallet/celesta notes on reveals, airy swells, near-silences; ambient drone bed.

### chalkboard - chalk explainer
Real board surface with eraser ghosts and dust; strokes are layered jittered passes with broken edges, never clean
vectors. Concepts draw themselves in stroke order; circle, arrow, annotate; hatching for mass. Ivory chalk plus
one accent (yellow/cyan/pink). Depict the named subjects, not generic stick figures. Motion: draw-on, wobble,
eraser wipe, pace to narration. Sound: chalk scratch per stroke group, tap on dots, eraser swish, soft knock on
underline. Fails: perfect curves, gradients, constant flicker, giant tray.

### glowsketch - luminous dotted contours
Near black `#07060b`, dotted contour lines (`stroke-dasharray: 1 10`, round caps, ~5-6 px at 1080) over a faint
solid guide; warm gold only on the key evidence. Subjects stay recognizable by contour. Motion: slow contour
tracing, rare pulses, parallax depth planes, rings only on meaningful beats. Sound: soft shimmers, glock/celesta
on light-ups, airy reverse swells. Fails: solid neon tubes, purple-on-black mud, bloom everywhere, generic orbs.

### pixelart - 16-bit sprites
Integer pixels on a small logical canvas scaled with nearest neighbour (e.g. 6x at 1080 wide), 1 px outlines,
3-5 shade bands, ordered dither, palette from the story. Motion on twos, whole-pixel squash, dust and sparks;
camera smooth. Pixel font at true logical size. Sound: chiptune blips, square-wave hits, coin/confirm pings
(synthesized is correct here). Fails: blurry resampling, sub-pixel drift, gradients, tiny silhouettes.

### ps2 - early-2000s low-poly cutscene
Low-poly three.js geometry, low-res textures, Lambert-style light, low internal resolution upscaled bilinear,
mild banding. Game-cutscene framing: over-shoulder, slow push, simple keyframe acting, low-poly particles.
Sound: muffled game foley, menu blips, low reverb room tone. Fails: glossy PBR, pixel sprites, texture noise.

### comicart - pop-art panels
Bold imperfect ink outlines, flat red/blue/yellow/cream/black, Ben-Day dots for shading, panel compositions,
held poses. Panels, speed lines, bursts, bubbles only as story devices; no invented dialogue. Motion: snappy
pop-in, panel wipes, impact holds, speed lines. Sound: punchy hits, paper whooshes on panel turns, print-press
thunks. Fails: a yellow burst in every shot, thin outlines, UI text over panels.

### flatvector - editorial flat illustration
Large clean silhouette masses, 2-3 flat value planes per object (shadow, base, light), almost no outlines, no
gradients; roundness depends on the subject. Limited palette from topic/brand. Motion: polished easing, masked
reveals, shape morphs, parallax, deliberate camera. Sound: clean UI pops, soft swishes, wood knocks.
Fails: outlines everywhere, faux 3D shine, stock-illustration people.

### cgimotion - cinematic 3D
three.js `MeshPhysicalMaterial` with real roughness/metalness, key/fill/rim, soft shadows, ACES, restrained DOF.
Location and hour from the script. Camera clarifies cause: close-up of the part, tracking for movement, wide for
geography. Realistic arcs and inertia. Sound: weighty sub hits, real-sounding whooshes, mechanical foley,
cinematic risers into reveals. Fails: mannequins where identity matters, extreme bloom, fake realism claims.

### legostyle - toy-brick stop motion
Everything built from intelligible bricks: stud pitch 1, brick height 1.2, plate 0.4, stud radius ~0.3 rise
~0.18, glossy moulded plastic, seams and clearances. Original figures only, no brand logos. Motion: snap with a
little bounce, limited hinge articulation, stop-motion holds, brick debris. Sound: plastic clicks and snaps,
clatter, small knocks (`knock/plastic`, `knock/snap`). Fails: smooth meshes with stud decals, floating studs.

### zackdfilms - rounded 3D explainer
Soft vinyl/clay 3D: rounded bevels, hero objects `MeshPhysicalMaterial` (roughness ~0.42, clearcoat ~0.35),
matte environments, broad soft shadows, warm key. Recognizable proportions, expressive faces. Camera grammar:
establish, mechanism close-up, payoff; focus on the described object. Sound: squishy pops, soft thumps, quick
whooshes on cutaways, clear "reveal" ding. Fails: blobs replacing subjects, blur hiding the story.

## B. Library styles (68, Lemo-Opuscar)

Read `$LEMO_OPUSCAR_HOME/styles/<slug>/STYLE.md` (it names fonts, palette, sound palette, native moves and
packages). Demo source only after `TREATMENT.md` exists: `sh <opuscar skill>/scripts/setup.sh demo <slug>`.
At least four of: structure, opening, signature shot, camera path, score shape, ending must differ from the demo.

| Group | Slugs |
|---|---|
| Tech / product | dark-keynote, glass-product, living-screencast, desktop-flythrough, hologram-hud, teardown, circuit-board, swiss-motion, pictogram-motion, iso-infographic |
| Data / evidence | dataviz, data-physical, satellite-briefing, lidar-survey, white-model, microscope, visual-investigation, transit-map, briefing-board, telestrator |
| Explainer / hand-made | whiteboard, chalkboard, watercolor, urban-sketch, crayon-book, one-line, isometric-picture-book, memphis-diorama, paper-popup, papercut-red, paper-lantern, shadow-puppet |
| Print / graphic | risograph, silkscreen-poster, halftone-dossier, woodcut, engraving, blueprint, art-deco, spy-titles, stained-glass, impasto, ink-wash, ukiyoe |
| Animation / toon | cel-anime-80s, rubber-hose, midcentury-toon, scifi-toon, game-show, microgame |
| 3D / game | brick-toy, lowpoly-island, hd-2d, pixel-rpg, tilt-shift, printed-long-take, ascii-crt, backrooms |
| Edit / documentary (real footage) | caption-news, news-package, newsreel, kino-montage, countdown, city-symphony, archive-lighttable, silent-film |

## C. Choosing

- AI tools, product launches, UI: house, dark-keynote, living-screencast, swiss-motion, flatvector.
- Ideas, philosophy, self-improvement: dankoe, one-line, ink-wash, glowsketch.
- Teaching a concept or process: chalkboard, whiteboard, iso-infographic, zackdfilms.
- Numbers and evidence: dataviz, data-physical, satellite-briefing, caption-news.
- Story, nostalgia, gaming: pixelart, ps2, comicart, legostyle, cel-anime-80s, rubber-hose.
If the user names no style, offer three that fit the topic with one line each and pick the first if they don't care.
