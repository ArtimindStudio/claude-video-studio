# Style Card: House Editorial (`house`)

## Signature
Warm cream paper `#F2EFEC`, deep ink `#0F071D` (or `#141413`), muted sub-text `#5E546F`, and one Electric Violet accent `#7C3AED`. Full-bleed `1080x1920` canvas with title, diagram or interface card, and word-synced caption grouped tightly around the optical centre. Dark purple statement frames (`#0F071D`) are reserved for major structural turns.

## Geometry
- Clean editorial cards (`#FFFFFF`), live charts, comparison tables and rebuilt interface components centered in the `1080x1920` frame (`padding: 120px 80px`, `gap: 36px–64px`).
- Icons sit inside white rounded containers (`borderRadius = size * 0.26`) at three strict sizes only: hero (`300 px`), tile (`84 px`) and inline (`34 px`).
- Unread secondary interface copy is drawn as rounded grey skeleton bars (`#D7CFD9`, `18 px` height).

## Edges
- Hairline borders (`1.5 px` to `2 px` solid `#D1CFC5` or `#D7CFD9`), card corner radii `24 px` to `36 px`.
- Zero outer black letterboxing, zero scale-down viewport wrappers.

## Shading
- Flat paper and crisp white panels. Soft, low-opacity elevation shadow only on floating tiles and cards (`0 10px 26px rgba(15, 7, 29, 0.10)`).
- No neon glow, no frosted glassmorphism, no gradient boxes behind body text.

## Motion
- **No hard cuts inside a topic:** `BlurSwap` overlaps outgoing (`blurOut` over 8 frames, `y: -18 px`, `blur: 16 px`) and incoming (`blurIn` over 12 frames, `y: 28 -> 0 px`, `scale: 0.96 -> 1.0`, `blur: 14 -> 0 px`) states.
- **Nothing rests:** every hold pushes in slowly (`drift` 2–4 % over the beat, ~8 % across a long section).
- **Progressive build:** groups enter in reading order, staggered `4 frames` apart (`container -> title -> content -> icon`).
- **Alive numbers:** counters tick up (`CountUp`), bars fill on the spoken word, focus dims inactive rows (`opacity: 0.38`, `saturate(0.3)`).

## Type
- **Headlines:** `Playfair Display` (or `Source Serif 4` / `Georgia`), bold italic `72–74 px`, word-by-word reveal (`WordHeadline`, 3-frame stagger), with the second half in `#7C3AED`.
- **Body and labels:** `Plus Jakarta Sans` (or `DM Sans`), uppercase mono/sans labels (`letter-spacing: 2–3 px`, `#8C8198`), frameless sub-text (`32–36 px`, `#5E546F`).
- **Captions:** `SpokenCaption` in the lower safe zone (above the bottom 12 %): phrase sits at `0.3` opacity and each word turns `1.0` opacity as spoken, with key emphasis words in bold italic `#7C3AED`.

## Sound
- **Bed:** upbeat tech drive music bed at `120–128 BPM`, continuous under the film, ducked `6–12 dB` under voice-over.
- **Effects (`launch` preset):** `pop` on arriving cards/chips (`>= 114 ms` apart), `tick` on list rows and counters (`>= 66 ms` apart), `whoosh.short` on fast moves (`peak +37 ms`), `hit` or `bell` on the key reveal.

## Avoid
- Rounded gradient boxes behind sub-text captions.
- Bare brand icons floating without a container or recoloured into monochrome.
- Hard cuts that leave an empty cream frame between two cards.

## Failures to check on style frames
1. Is any element within 7 % of the left/right edges or inside the bottom 12 % platform UI zone?
2. Did two states cut without an 8-to-12-frame `BlurSwap` overlap?
3. Are numbers static instead of counting up on the spoken word?
