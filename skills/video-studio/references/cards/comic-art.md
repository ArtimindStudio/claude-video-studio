# Style Card: Comic Art (`comicart`)

## Signature
Bold, variable-width black ink outlines (`#111111`), flat primary print colours (crimson red `#E11D48`, cobalt blue `#2563EB`, cadmium yellow `#FACC15`, warm newsprint cream `#F5F0E6`), Ben-Day halftone dot shading, and multi-panel graphic compositions.

## Geometry
- Dynamic comic panel grids (full-bleed hero panel, diagonal split panels, or 2-to-3 stacked panels separated by `16 px` cream gutters and `5 px` black ink borders).
- Subjects are staged with strong foreshortening, clear silhouettes and held impact poses.
- Speech bubbles, caption boxes, speed lines and bursts appear only when they carry actual words or impacts from the script — never invent unscripted dialogue.

## Edges
- Bold, slightly imperfect ink outlines (`4–8 px` outer contour, `2–3 px` interior detail lines) with tapered brush caps and ink-pool corners.
- Heavy black drop-shadow blocks (`6–10 px` solid `#111111` offset at `45°`) behind caption boxes and panels.

## Shading
- Solid ink blacks ("spotted blacks" filling deep shadow shapes) combined with Ben-Day halftone dot patterns (`6–10 px` dot pitch at `45°` screen angle) for midtones.
- Zero smooth airbrush gradients or soft Gaussian drop shadows.

## Motion
- **Snappy pop-ins:** panels and characters snap into place with `outBack` overshoot (`8–10 frames`) and hold a strong pose while the camera drifts slowly (`2–3 %`) or pans across the panel sequence.
- **Panel wipes:** diagonal ink-slash wipes or new panels sliding over the gutter (`flyIn` with motion blur over `8 frames`) keep multiple steps visible on one page.
- **Impact holds & speed lines:** on the turn or key number, speed lines radiate behind the subject and the frame shakes for `3 frames` (`±8 px` seeded offset).

## Type
- Uppercase comic display lettering (`Bangers`, `Anton` or bold condensed italic sans, `48–72 px`) inside rectangular yellow (`#FACC15`) or cream (`#F5F0E6`) narrative caption boxes bordered in `3 px` black ink.

## Sound
- **Bed:** punchy drums and upright bass or driving garage/funk groove (`118–130 BPM`).
- **Effects:** crisp paper whooshes (`whoosh.short`) on panel turns, heavy print-press thunks (`hit`, `land`) when panels lock, and sharp pops (`pop`) on caption boxes.

## Avoid
- Putting a yellow explosion burst behind every single shot (save bursts for the single emotional peak).
- Thin `1 px` vector outlines or soft pastel gradients.
- Floating plain UI text directly over busy panel artwork without a comic caption box.

## Failures to check on style frames
1. Do the ink outlines have bold outer weight (`4–8 px`), spotted black shadows and Ben-Day halftone dots?
2. Is every text element housed inside a bordered comic caption box or speech bubble?
3. Are bursts and speed lines reserved for the real impact beats rather than repeated on every frame?
