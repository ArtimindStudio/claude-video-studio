# Motion bar

Keep the style's look; upgrade how it moves. Numbers at 30 fps (scale for 24/60).

## The 13 techniques

| # | Do | Rule |
|---|---|---|
| 1 | No hard cuts inside a topic | Old state blurs, drifts up, fades ~8 f while the new one blurs in over it. Hard cut only at a change of subject, still overlapped |
| 2 | Nothing rests | No identical frame > 12 f. Every hold pushes in 2-4 % (about 8 % across a long section) or an inner element keeps moving |
| 3 | Fast moves blur | Anything travelling > ~300 px is motion-blurred 2-3 f and lands sharp. Blur is motion only, never resting decoration |
| 4 | Change follows speech | A new image, state or highlight every 0.5-1.5 s, on a spoken noun; never > 1.5 s without a visible change |
| 5 | One container, changing content | Keep the card/frame in place, swap what is inside |
| 6 | Progressive build | Groups enter in reading order, 3-6 f apart: container, title, content, decoration |
| 7 | Focus | When one item is discussed the rest dim and desaturate; highlights sweep row by row |
| 8 | Alive numbers and UI | Counters tick, bars fill, text types, ticks pop, each on its word. No value appears final |
| 9 | Captions follow the voice | Phrase sits grey, each word turns solid as spoken; key word accented. 1-3 words per phrase on shorts |
| 10 | Headlines build | Word by word, second half in accent or lighter treatment |
| 11 | Orientation | A small chapter strip when the video has 3+ parts |
| 12 | Layout morphs | Pile to grid, grid to one item, image punches to full frame and back; keep the card footprint |
| 13 | Overlap at section changes | Next header starts 4-6 f before the old stage leaves; no empty-canvas frame. Section change 12-15 f total |

Exits are faster than entrances (8 f vs 12 f). Out is quiet (blur + fade in place), in has direction (small rise
and scale). Backgrounds change colour over 6-10 f through the in-between colour, never flash-cut.
Fixed zones: nav, header, stage and caption keep their coordinates for the whole video; captions and nav are
layers above scene transitions.

## Icons

Four jobs only: subject hero (~1/3 frame width, may stand free), owner badge, connected-app chip (60-90 px),
row marker (30-36 px). Always in one container language (same radius ratio, hairline, soft shadow). Never tint
a brand mark; label unfamiliar logos. Icons arrive last with a small overshoot, connectors draw toward them.
Unread small text is grey skeleton bars; real text only at readable size.

## Easing and timing kit (engine-neutral)

```js
const clamp = x => Math.min(Math.max(x, 0), 1);
const outCubic = x => 1 - (1 - clamp(x)) ** 3;
const outBack = (x, s = 1.4) => { x = clamp(x) - 1; return 1 + x * x * ((s + 1) * x + s); };
const spring = (x, k = 9, d = 0.55) => 1 - Math.exp(-k * d * clamp(x)) * Math.cos(k * Math.sqrt(1 - d * d) * clamp(x));
const prog = (t, t0, dur) => clamp((t - t0) / dur);
// blurIn: opacity outCubic(p), translateY (1-p)*24px, scale 0.96+0.04p, blur (1-p)*12px over 12 f
// drift: scale 1 + 0.08 * (t - t0) / sectionDur
// stagger: item i starts at t0 + i * 4/30
```

Remotion projects: use `MotionKit.tsx` exports (`blurIn`, `blurOut`, `life`, `BlurSwap`, `flyIn`, `StackThrow`,
`drift`, `stagger`, `focus`, `CountUp`, `WordHeadline`, `SpokenCaption`, `ChapterNav`, `IconTile`, `IconChip`,
`Connector`, `Skeleton`, `tintAt`) if the project has them.

## Layout for 9:16

Full bleed 1080x1920, no letterbox. Group title, graphic and caption around the optical centre
(`justify-content:center; gap:36-64px; padding:120-140px 80px`). Margins ~7 % horizontal; keep captions out of
the bottom 10-15 % (platform UI) and the top ~8 %. Re-layout per format; never crop.

## Motion QA

- `ffmpeg -i final.mp4 -vf freezedetect=n=0.001:d=0.45 -an -f null - 2>&1 | grep freeze` : no hold > 1.5 s, each
  ends on a word-timed change (slow drift may be flagged; it is a finder, not a verdict).
- Step each transition at 12 fps: an overlap, never an empty stage.
- Every state change lands within 2 frames of its word.
