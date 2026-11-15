# Style library: 10 high-quality styles Claude can make (2026-11-12)

Chosen from five sources studied on 2026-11-12. Pick from here first; `styles.md` keeps the full specs of the
older ten and the 68-style Opuscar index.

## Sources and what each taught

| Source | What it is | Route | What we took |
|:---|:---|:---|:---|
| neuraltech.ai post (IG `DflvMnUE5Jd`) | one 5 s chai pour redrawn in 89 styles by Claude Opus 5.5, 39 kept | pure code, every frame drawn | the "same scene, many styles" test; each style card states medium, motion cadence (on twos / threes), length, best use |
| buildwithdarius.ai reel (IG `DfgBxYnvWGX`) | one scene in 10 styles: pixel, PS2, comic, lego, claymation, paper cutout, retro anime, low-poly, risograph, miniature diorama | image + video models (Higgsfield) driven by Claude | which looks audiences recognise at a glance; the model route for photoreal-material looks (clay, diorama) |
| bang-motion (GitHub) | motion-designer skill: one `index.html` per film, 10 looks × 19 concepts | HTML/CSS/SVG | anti-slideshow rules: one continuous world, moving camera, persistent subject, text inside the scene, three candidates then pick |
| huashu-art-motion (GitHub) | 36 shipped art styles with quality ratings + 9 explainer grammars | Canvas code, generated character frames | honest quality ratings and known weaknesses per style; grammars (3b1b, keynote UI, finance chart, Kurzgesagt-like, Vox collage, whiteboard, storytime, kinetic type) |
| claude-drawing-skill (GitHub) | 83 painting styles in numpy + Pillow, stage-by-stage draw-on | Python, CPU | per-style failure checklists, draw-on stages that become animation, stills for covers |

## How we chose

1. **Proven in code**: shipped in at least two sources, or rated ★★★ by huashu.
2. **Reads at phone size** within one second.
3. **Fits our topics** (AI tools, how-tos, ideas, news) and our formats (9:16 shorts, carousels, covers).
4. **Distinct grammar**: no two styles differ only by palette.
5. **Sound palette exists** so earshot can place real-feeling effects.

## The ten

| # | Style | Look | Motion | Sound | Best for | Build route | Evidence |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | **Whiteboard draw-on** | marker lines on white, one accent colour, hand-lettered labels | strokes draw in stroke order; camera travels the board, pulls out to the whole argument at the end | marker squeak per stroke group, cap pop, soft tap on points | explainers, tutorials, frameworks | HTML seek page, SVG path draw-on | IG 1 (card 1), huashu y3, drawing chalk/ballpoint |
| 2 | **Ukiyo-e woodblock** | flat colour blocks, carved ink outline, bokashi sky gradients, paper grain | on threes (8–10 drawings/s) for figures, smooth camera pans like a scroll | wood block knock, koto/shamisen pluck, wind | calm stories, history, intros | Canvas 2D, flat fills + line layer + paper texture | IG 1 (card 2), Opuscar ukiyoe, drawing ukiyoe |
| 3 | **Stained glass** | coloured panes in black lead lines, light from behind | on twos; panes light up in sequence, light sweeps across | glass chimes, bell, low organ-like drone | premium, festive, launch moments | Canvas 2D Voronoi panes + lead stroke + glow pass | IG 1 (card 3), Opuscar stained-glass, drawing stainedglass |
| 4 | **8-bit pixel art** | 240×135 logical grid, 14–16 colour palette, 1 px outlines, HUD | stepped 10–15 fps sprites, smooth camera, blocks pop coins | chiptune, square-wave blips, coin/confirm | gaming, tech, "your body right now" science | three.js or Canvas at low res, nearest-neighbour scale; our `/pixel-video` | IG 1 (card 4), IG 2, huashu 14_8bit ★★★, `/pixel-video` |
| 5 | **Red papercut** | one red on warm paper, the cut is the drawing, holes are the light | jointed cut-outs, gentle sway, layers slide like a shadow box | paper rustle, scissors snip, light percussion | culture, festive, story posts | SVG with mask cut-outs, multiply shadow | IG 1 (card 8), Opuscar papercut-red, drawing papercut |
| 6 | **Glow flat vector** (Kurzgesagt-like, original) | deep violet/indigo ground, flat two-tone shapes, soft glow, grain, rig-able characters | camera moves between scales; one state change per sentence; ambient particles drift | soft pops, shimmers, warm pads | science and "why" explainers with a host | SVG pure function of time; our `/flat-video` | huashu y1, bang flat vector, `/flat-video` |
| 7 | **Dark keynote UI** | near-black gradient, hairline grid, one brand accent, real product UI large | one screen, one thing; UI parts lift out, camera pushes to what gets clicked; numbers land on the word | clean clicks, soft whooshes, a riser into the reveal | AI tool launches, product demos | HTML/CSS with real screenshots rebuilt as live parts | bang product tour, huashu t2 (warns against the glass-card template), Opuscar dark-keynote |
| 8 | **Visual journalism collage** | black or paper desk, real photos and documents with source tags, highlighter, red rings, dashed lines | camera moves across the desk like a reporter; highlight sweeps, stamps, red lines connect | paper slides, pen scratch, camera shutter, low hits | news, AI industry stories, opinion | HTML collage, real licensed images, Vox-style reveals | bang visual journalism, huashu y2 Vox |
| 9 | **Kinetic poster type** | huge cropped words, solid colour fields, one focus word at a time | each key word slams in on a beat; colour blocks cut on the beat; max 4 words per hero line | punchy hits, swishes, tight beat-led music | hooks, quotes, lists, announcements | HTML/CSS type on a beat grid | bang poster color-block, huashu y5 |
| 10 | **Low-poly 3D** | faceted geometry, key/fill/rim light, gradient skies, soft AO | diorama camera orbits and dollies; objects pop in with overshoot | woody knocks, soft whooshes, ambient bed | what-if stories, places, maps, history | three.js on the GPU; our `/lowpoly-video` | IG 2, drawing lowpoly, `/lowpoly-video` |

### Two alternates

- **1930s rubber hose**: pie-cut eyes, noodle arms, everything bounces on the beat, 12 fps step, film scratches.
  huashu ★★★, drawing-skill. Great for humour; narrow topic fit.
- **Risograph print**: two or three overprinted inks, halftone, slight misregistration on warm paper. IG 2,
  drawing editorial, Opuscar risograph. Good for editorial carousels and covers.

### Not chosen for the code route, and why

- **Claymation, miniature diorama, lego, PS2, retro anime** (IG 2) look best with image and video models,
  because the material realism is the point. Make them through the model route (Higgsfield or similar),
  with Claude directing; label them as model-made.
- **Single-painter styles** (Van Gogh, Monet, Klimt...): huashu rates most ★★ with known weak figures, and they
  suit art-history pieces more than our topics.
- **Stage-by-stage paintings** (ink wash, watercolour, oil pastel): excellent stills from drawing-skill; use them
  for covers and draw-on intros, not as full-motion styles.

## Rules every style keeps

- One continuous world, a camera that moves, a subject that persists, text inside the scene (bang-motion).
- Every scene alive: one main action plus two looping motifs (huashu).
- Motion cadence is part of the style: pixel 10–15 fps steps, ukiyo-e on threes, stained glass on twos, vector
  smooth; the camera stays smooth in all of them.
- Show three directions before committing to a new look; directions differ in composition, not only colour.
- Learn the visual language, never copy a creator's characters, compositions or logos. "Kurzgesagt-like" means
  the grammar, not their art.
- Same-scene test before first use: render one 5 s scene in the style and compare it side by side with real
  references; ship only if it reads as the real thing (IG 1 kept 39 of 89 this way).

## Next step to make it real

Render one shared 5 s test scene (aiartimind's own subject) in all ten styles with the video-studio skill,
keep the ones that pass the side-by-side check, and turn each into a style card with its prompt, palette, cadence,
sound palette and failure checklist. Those frames also fill chapter 5 of the Claude video guide.

## Test renders (2026-11-12)

All ten rendered from one shared 5 s scene (a cyclist riding into the sunset, after a Pinterest front-view
cycling loop): `production_hub/claude-video-style-library/04_data/scene/scene.js`, one wrapper page per style.
Videos live on the Kingston drive at `artimind-media/claude-video-style-library/04_video/` (`00_all_styles_grid.mp4`
shows all ten side by side). The catalogue, with each video and a preview frame attached, is the Teable table
"Claude Video Style Library" (`tbluZbaebSjJDspLFTQ`); refill it with `04_data/teable_style_library.py --attach`.

## v2 lineup and test renders (2026-11-12, later the same day)

Retired from the code library: stained glass, red papercut, kinetic poster type, visual journalism (less suited to
short-form storytelling). Added: **stickman storytelling** (after kaomei/stickman-video-director, cozy-storytelling
grammar), **storytime doodle cartoon**, **cozy watercolour (lo-fi)**, **soft 3D clay**.

| # | Style | Built with |
|:---|:---|:---|
| 1 | Whiteboard | canvas `scene_v2/scene.js` |
| 2 | Ukiyo-e | canvas |
| 3 | 8-bit pixel | `/pixel-video` engine (three.js + pixel pass) |
| 4 | Stickman storytelling | canvas |
| 5 | Storytime doodle | canvas |
| 6 | Glow flat vector | `/flat-video` engine (SVG) |
| 7 | Dark keynote UI | canvas |
| 8 | Cozy watercolour | canvas |
| 9 | Soft 3D clay | canvas |
| 10 | Low-poly 3D | `/lowpoly-video` engine (three.js on the GPU) |

Shared scene "Night writer": a creator typing at 3 AM, the cat asleep, rain on the window, steam from the mug;
every motion periodic in 3 s so each clip loops (last-vs-first-frame SSIM 0.93–0.98). Renders: Kingston drive
`artimind-media/claude-video-style-library/04_video/v2/` plus `00_all_styles_grid.mp4`. Teable table updated with
`04_data/teable_update_v2.py`.
