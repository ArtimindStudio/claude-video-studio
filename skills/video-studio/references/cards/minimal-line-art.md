# Style Card: Minimal Line Art (`dankoe`)

## Signature
Pure black canvas `#000000`, thin white strokes (`#FFFFFF`, `1.5–3 px` at `1080` width) and crisp circular dot nodes (`4–7 px` radius), surrounded by generous negative space. Strictly 2D constellation diagrams and silhouette node graphs that clarify abstract ideas.

## Geometry
- **Physical subjects:** sample the recognizable outer silhouette into `30–40` coordinate nodes connected in contour order, with sparse internal cross-links.
- **Abstract concepts:** `2–3` distinct geometric entities (circles, triangles, balance beams, trajectories) whose spatial relationship visibly transforms across the beat (separation, convergence, alignment, orbit).
- Use orbit rings or grid axes only when they represent a real variable or constraint in the script.

## Edges
- Crisp vector strokes (`1.5–3 px` at `1080x1920`), round caps and joins (`stroke-linecap: round; stroke-linejoin: round`).
- Secondary guide rings use dashed strokes (`stroke-dasharray: 3 9`, opacity `0.35`).

## Shading
- None. Strictly pure black `#000000` background and `#FFFFFF` ink (with optional muted grey `#666666` for inactive paths).
- Zero gradients, zero drop shadows, zero 3D extrusions.

## Motion
- **Path draw-on:** lines trace smoothly from node to node using `stroke-dashoffset` or `clipPath` (`outCubic` easing).
- **Travelling nodes:** bright dots travel along established paths to show flow, cause and effect, or signal transfer.
- **Camera:** slow, continuous push-in (`drift` 3–5 %) or smooth pan following a travelling node from one diagram cluster to the next.
- **Deliberate pauses:** let the completed diagram breathe for 1.0–1.4 s while the camera drifts and nodes pulse gently (`scale 1.0 -> 1.15`).

## Type
- Clean geometric sans or monospace (`JetBrains Mono` or `DM Sans`), small uppercase node labels (`18–22 px`, letter-spacing `+0.08em`, `#888888`) and calm centered serif or sans captions (`38–44 px`, `#FFFFFF`) in the lower safe zone.

## Sound
- **Bed:** low, warm ambient drone or minimal felt-piano pad.
- **Effects (`calm` / `minimal` preset):** sparse soft mallet or celesta notes (`bell` / `mallet`) when key nodes lock into place, airy swells (`swell`) on camera pans, and at least one near-silence right before the central turn.

## Avoid
- Random decorative starfields or floating dust particles that prove nothing.
- Pseudo-3D rotating wireframes or glowing neon bloom.
- Hairline strokes thinner than `1.5 px` that vanish on mobile compression.

## Failures to check on style frames
1. Does the diagram visually prove the exact relationship in the sentence, or is it generic sacred geometry?
2. Are all strokes at least `1.5 px` wide and high-contrast at thumbnail size?
3. Is at least 65 % of the `1080x1920` frame left as clean black negative space?
