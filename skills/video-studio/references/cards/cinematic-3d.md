# Style Card: Cinematic 3D (`cgimotion`)

## Signature
Physically based 3D rendered in `three.js` using `MeshPhysicalMaterial` with calibrated roughness and metalness, three-point cinematic lighting (warm key, cool fill, crisp rim), soft shadow maps, ACES Filmic tone mapping (`THREE.ACESFilmicToneMapping`), and restrained depth of field.

## Geometry
- Detailed architectural, mechanical or product geometry built from bevelled primitives, lathed profiles, extruded splines and instanced sub-components (fasteners, cooling fins, optical lenses, circuit traces).
- Location and time of day come directly from the script (for example: brushed anodized studio monolith, sunlit lab bench, dark server corridor).

## Edges
- Every 3D edge carries a micro-bevel (`bevelThickness: 0.02–0.05`, `bevelSegments: 3–5`) so specular rim lights catch the corners naturally; razor-sharp `90°` CG edges look fake.

## Shading
- `THREE.MeshPhysicalMaterial` with distinct material contrast in every shot: matte anodized metal (`roughness: 0.38, metalness: 0.85`), satin dielectric (`roughness: 0.45, metalness: 0.0, clearcoat: 0.15`), and emissive indicator accents.
- Three-point area/directional rig (`castShadow = true`, `PCFSoftShadowMap`, `2048x2048`) plus subtle studio environment reflection.

## Motion
- **Camera clarifies cause:** wide establishing shot for geography -> medium tracking shot following the moving mechanism -> macro close-up insert of the contact point -> scale reveal payoff.
- **Physical inertia:** all moving parts follow realistic acceleration and deceleration curves (`inOutCubic` or damped spring) with secondary follow-through on cables, indicators or shock mounts.
- **Continuous camera life:** slow crane or dolly push (`drift`) on every hold so specular highlights glide across bevels.

## Type
- Restrained keynote-grade sans (`DM Sans` or `Plus Jakarta Sans`, `52–68 px`) or clean HUD telemetry callouts (`JetBrains Mono`, `20 px`) anchored in screen space or tracked cleanly to a 3D world coordinate via a single `worldToScreen(vec3)` projection helper.

## Sound
- **Bed:** cinematic score or deep pulsing electronic bed (`110–124 BPM`).
- **Effects:** weighty sub drops (`drop`), real-sounding mechanical foley (`tock`, `click.confirm`, `land`), fast air whooshes (`whoosh.short`, `whoosh.long`), and cinematic risers (`riser`) peaking `-23 ms` before the reveal cut.

## Avoid
- Featureless grey mannequins where human identity matters (depict the real mechanism, device or architectural metaphor instead).
- Cranked bloom that washes out material roughness.
- Claiming photoreal camera footage when the scene is procedural 3D.

## Failures to check on style frames
1. Do edges catch a specular rim light via bevels, and can you distinguish at least two material roughness values?
2. Is `ACESFilmicToneMapping` active with soft shadows grounding every object on a surface?
3. Does the camera angle clarify how the mechanism works rather than sitting dead-centre at eye level?
