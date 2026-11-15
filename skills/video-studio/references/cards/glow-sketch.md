# Style Card: Glow Sketch (`glowsketch`)

## Signature
Deep near-black canvas `#07060B`, luminous dotted contour lines (`stroke-dasharray: 1 10`, round caps, `5–6 px` stroke width at `1080` width) over a faint solid guide stroke (`1.5 px`, opacity `0.18`). Cool ivory/ice white `#E8EEF5` for structure and warm gold `#F5B841` reserved strictly for the key evidence or turning point.

## Geometry
- Recognizable contours of real objects, architectural forms, hands, instruments or system topologies.
- Two to three depth planes (foreground subject, mid-plane connectors, distant reference grid) separated by scale and opacity so parallax camera moves read clearly.
- Concentric signal rings or pulse waves appear only when the narration describes transmission, impact or measurement.

## Edges
- Dotted bead contours (`stroke-linecap: round; stroke-dasharray: 1 10; stroke-width: 5.5px`) paired with a thin underlying continuous path (`1.5px`, opacity `0.18`) so the silhouette never breaks apart.
- Restrained local glow (`shadowBlur: 10–14px` in the stroke colour) on the active focal element only.

## Shading
- Translucent dark silhouette fills (`rgba(7, 6, 11, 0.85)`) inside foreground forms so background lines occlude cleanly behind them.
- No heavy full-screen bloom, no muddy purple-on-black gradients.

## Motion
- **Contour tracing:** dotted paths trace progressively along the silhouette (`stroke-dashoffset` animated with `outCubic`), followed by the warm gold highlight sweeping across the proof element.
- **Parallax depth:** continuous slow camera pan and push-in (`drift` 4 %) where foreground contours move at `1.0x`, mid-plane at `0.65x`, and background guides at `0.35x`.
- **Rare pulses:** a single gold pulse travels along a connector on the spoken noun; nothing flashes continuously.

## Type
- High-contrast editorial serif or clean geometric sans in `#F8FAFC` (`44–64 px`), with the key number or spoken emphasis word in warm gold `#F5B841`.
- Small technical callout labels in `JetBrains Mono` (`20 px`, `#94A3B8`).

## Sound
- **Bed:** deep atmospheric synth pad with subtle rhythmic pulse (`112–122 BPM`).
- **Effects:** soft shimmers and glockenspiel/celesta notes (`bell`) when gold contours light up, airy reverse swells (`swell`) leading into section transitions, and crisp ticks (`tick`) on data callouts.

## Avoid
- Solid neon laser tubes instead of dotted contour beads.
- Flooding the entire frame with bloom so text and dots turn into a blurry haze.
- Generic glowing orbs floating in space instead of recognizable subjects.

## Failures to check on style frames
1. Are the contours built from round dotted beads (`1 10` dash) over a faint solid guide, or plain solid lines?
2. Is warm gold `#F5B841` used only on the single focal proof of the beat?
3. Can you immediately identify the subject by its silhouette at thumbnail size?
