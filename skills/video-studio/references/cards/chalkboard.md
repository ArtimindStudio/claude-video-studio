# Style Card: Chalkboard (`chalkboard`)

## Signature
Matte slate chalkboard surface (`#1B2220` to `#212926`) with subtle dusty eraser ghosts, drawn in warm ivory chalk (`#F4F1EA`) plus one single accent chalk colour (warm yellow `#FACC15`, chalk cyan `#67E8F9`, or dusty pink `#F472B6`). Concepts draw themselves in natural human stroke order as the narrator speaks.

## Geometry
- Hand-drawn diagrams, flowcharts, mechanisms and named subjects sketched directly on the board.
- Depict the actual subjects named in the script (a browser window, a waveform, a server rack, a hand holding a card), never generic stick figures.
- Use hand-sketched circles, underlines, brackets and arrows to annotate the key number or turn.

## Edges
- Broken, textured chalk strokes built from 2–3 slightly jittered passes (seeded PRNG `mulberry32` offset by `±1.2 px`) with dry grain gaps along the edge.
- Never render clean, single-pass mathematical Bézier curves or sharp geometric rectangles.

## Shading
- Parallel diagonal chalk hatching (`4–6 px` spacing) or dusty smudged fills (`opacity: 0.18–0.30`) to give mass to important shapes.
- No smooth CSS gradients or glossy highlights.

## Motion
- **Stroke-order draw-on:** every shape and arrow draws on in the order a teacher's hand would sketch it (box top -> right -> bottom -> left, then label, then connecting arrow).
- **Subtle line boil:** active callouts gently boil every 3–4 frames using a seeded jitter offset (`±0.8 px`) while the camera drifts slowly (`2–3 %` push).
- **Eraser wipe transitions:** between major sections, a broad diagonal smudged wipe clears the centre of the board, leaving a faint chalk ghost (`opacity: 0.07`) underneath the new drawing.

## Type
- Hand-lettered chalk display font or dry-stroke serif/sans (`38–56 px`), written a few words at a time in reading order.
- Key terms underlined twice in the single accent chalk colour as the word is spoken.

## Sound
- **Bed:** quiet classroom/studio room tone with a warm, low acoustic or lo-fi rhythmic pulse.
- **Effects:** dry chalk scratch per stroke group, crisp chalk tap (`tock` / `tick.crisp`) when bullet dots or nodes land, soft knock on underlines, and a soft dusty swish (`whoosh.short`) on eraser wipes.

## Avoid
- Clean vector icons dropped onto a green background.
- Constant 30 fps random unseeded flicker on every line (causes visual fatigue and fails deterministic rendering).
- A giant wooden chalk tray taking up the bottom 20 % of the vertical frame.

## Failures to check on style frames
1. Do the lines look like dry chalk with multi-pass texture, or clean digital SVG strokes?
2. Is the accent chalk limited to the single key evidence per beat?
3. Are the subjects specific to the script rather than generic stick figures?
