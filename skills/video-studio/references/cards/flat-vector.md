# Style Card: Flat Vector (`flatvector`)

## Signature
Editorial flat illustration built from large, clean silhouette masses and `2–3` flat value planes per object (base tone, shadow plane, highlight plane) with almost no outlines and zero gradients, set against a cohesive topic-driven palette.

## Geometry
- Bold geometric silhouettes constructed from clean curves and straight architectural planes; roundness is dictated by the subject (crisp corners for hardware/code, smooth curves for organic forms).
- Clear figure-ground separation: foreground subject fills at least a third of the `1080x1920` frame height, framed by mid-ground props and a clean background block.

## Edges
- Razor-sharp adjacent colour planes where light meets shadow (`0 px` stroke).
- Thin accent hairlines (`2 px`) are used only for functional connectors, UI wireframes or measurement callouts, never as a default outline around every shape.

## Shading
- Strictly `2–3` flat colour values per material (for example: base cobalt `#2563EB`, shadow plane `#1E40AF`, lit plane `#60A5FA`).
- Cast shadows are crisp geometric shapes in a darkened background tone (`opacity: 0.16`), never blurry Gaussian drop shadows or glossy 3D specular highlights.

## Motion
- **Masked reveals:** objects unfold from clipping masks (`clipPath` inset or circle expand over `10–14 frames` with `outCubic` easing).
- **Shape morphs & sliding planes:** shadow and light planes shift as the camera pans, giving depth without 3D meshes; cards morph smoothly from a full-frame hero into a comparison grid.
- **Parallax camera:** multi-plane horizontal or vertical camera moves (`3–4` depth layers moving at `0.4x`, `0.75x`, `1.0x`, `1.2x`) plus continuous `3 %` drift on holds.

## Type
- Clean modern grotesk or editorial sans (`Plus Jakarta Sans`, `DM Sans` or `Inter`, weight `600–700`, `52–68 px` headlines, `36–42 px` captions) set in high-contrast ink against flat background zones.

## Sound
- **Bed:** crisp, modern electronic or upbeat indie-tech instrumental (`118–126 BPM`).
- **Effects (`launch` / `crisp` preset):** clean UI pops (`pop`), soft paper/cloth swishes (`whoosh.short`), warm wood knocks (`tock`, `land.light`), and pitched marimba/bell accents (`bell`) on reveals.

## Avoid
- Putting black outlines around every shape (turns flat vector into clip art).
- Faux-3D airbrush gradients or lens flares.
- Generic "corporate Memphis" rubber-limbed stock-illustration characters unrelated to the script.

## Failures to check on style frames
1. Are objects defined by `2–3` flat value planes (shadow, base, light) without outlines or gradients?
2. Does the palette stay within `4–5` deliberate colour swatches across the entire film?
3. Do transitions use masked geometric reveals and parallax planes rather than simple opacity fades?
