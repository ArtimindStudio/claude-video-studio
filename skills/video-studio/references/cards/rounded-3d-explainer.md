# Style Card: Rounded 3D Explainer (`zackdfilms`)

## Signature
Tactile vinyl/clay 3D explainer in `three.js`: generous rounded bevels, hero objects rendered with `MeshPhysicalMaterial` (`roughness: 0.42`, `clearcoat: 0.35`), matte pastel or warm neutral studio environments, broad soft shadows, and a clear 3-step camera grammar (establish -> mechanism close-up -> payoff).

## Geometry
- Recognizable, simplified 3D models of the exact subject named in the script (a cross-section of a lock, a network router, a human organ diagram, a battery cell) with chunky, touchable proportions.
- Cutaway cross-sections and exploded views that expose the internal mechanism directly to the camera.

## Edges
- Generous, smooth bevels (`radius 8–15 %` of part thickness) on all boxes, cylinders and cutaways so every piece reads like moulded vinyl or smooth clay.
- Clean seam gaps (`2–4 %` clearance) between interlocking parts.

## Shading
- **Hero parts:** `THREE.MeshPhysicalMaterial({ roughness: 0.42, metalness: 0.05, clearcoat: 0.35, clearcoatRoughness: 0.25 })` in saturated, high-contrast teaching colours (coral `#F43F5E`, amber `#F59E0B`, cobalt `#3B82F6`, mint `#10B981`, ivory `#F8FAFC`).
- **Environment:** matte seamless cyclorama floor and backdrop (`roughness: 0.9`, `#EAE6DF` or `#1E242B`) with warm directional key light (`#FFF7ED`), soft sky fill and `PCFSoftShadowMap`.

## Motion
- **Three-step camera grammar:** (1) establish the whole object in medium-full view, (2) push and orbit into a macro close-up as the housing slides open to reveal the moving part, (3) pull back or cut to the completed payoff state.
- **Tactile physics:** parts pop into place with a slight elastic bounce (`outBack` / `spring`), pistons and levers move in clear causal order, and inactive outer shells slide or fade to `20 %` opacity during cutaways.

## Type
- Friendly, high-legibility rounded or geometric sans (`Plus Jakarta Sans` or `DM Sans`, weight `700`, `44–56 px`) in the lower caption safe zone, plus clean leader lines pointing to internal parts on cutaway beats.

## Sound
- **Bed:** curious, rhythmic marimba/plucked-synth explainer bed (`116–124 BPM`).
- **Effects:** squishy tactile pops (`pop`), soft thumps (`land`, `land.light`), quick cutaway whooshes (`whoosh.short`), crisp mechanism clicks (`tock`, `click`), and a clear pitched reveal ding (`bell`) when the mechanism completes.

## Avoid
- Replacing recognizable subjects with featureless spheres and capsules ("blob soup") that only make sense if you read the label.
- Heavy depth-of-field blur that hides the internal mechanism being explained.
- Dark, muddy lighting that kills the vinyl/clay surface read.

## Failures to check on style frames
1. Can you tell what the 3D object is with the text turned off?
2. Do hero parts have the vinyl/clay surface (`roughness ~0.42`, `clearcoat ~0.35`) against a matte background?
3. Does the shot sequence move from establish -> cutaway mechanism close-up -> payoff?
