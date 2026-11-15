# Motion Rules Poster (30 fps Reference)

Keep this page open while building and reviewing every beat. Numbers below are at **30 fps** (scale proportionally for 24 or 60 fps).

## The 13 Motion Rules

| # | Rule | In practice (30 fps) | MotionKit primitive |
|:---|:---|:---|:---|
| **1** | **No hard cuts inside a topic** | The old state blurs (`0 -> 16 px`), drifts up (`-18 px`) and fades over **8 frames** while the new one blurs in (`14 -> 0 px`, `+28 -> 0 px`, `scale 0.96 -> 1.0`) over **12 frames** | `BlurSwap`, `life`, `blurIn`, `blurOut` |
| **2** | **Nothing rests** | No identical frame for more than **12 frames** (`0.40 s`). Every hold pushes in **2–4 %** (~**8 %** across a long section) or an inner element keeps moving | `drift(frame, from, to, 0.035)` |
| **3** | **Fast moves blur** | Anything travelling more than **~300 px** is motion-blurred for **2–3 frames** (up to `26 px` blur + `10 %` stretch) and lands sharp. Blur is motion only, never decoration | `flyIn`, `StackThrow` |
| **4** | **Change follows speech** | A new image, state or highlight lands every **0.5–1.5 s** (`15–45 frames`), tied to a spoken noun; never > 1.5 s without a visible change | Timeline `words` + `beats` |
| **5** | **One container, changing content** | Keep the card or frame in place; swap what is inside it | `BlurSwap` |
| **6** | **Build in reading order** | Items arrive one at a time, **3–6 frames** apart (default **4 frames**): `container -> title -> content -> icon` | `stagger(i, from, 4)` |
| **7** | **Focus** | When one item is discussed, the others dim (`opacity 0.38`) and desaturate (`saturate 0.30`); highlights sweep row by row | `focus(isActive, t)` |
| **8** | **Alive numbers** | Counters tick up, bars fill, text types, ticks pop on the spoken word; no value appears already final | `CountUp` |
| **9** | **Captions follow the voice** | Phrase sits muted (`0.3` opacity) and each word turns solid (`1.0`) over **4 frames** as spoken; key word italicized in the accent colour (`1–3 words` per phrase on shorts) | `SpokenCaption` |
| **10** | **Headlines build** | Revealed word by word (**3 frames** apart), with the second half in the accent colour or italic treatment | `WordHeadline` |
| **11** | **Orientation** | Show a small chapter strip when the film has **3 or more parts** | `ChapterNav` |
| **12** | **Layouts morph** | A pile becomes a grid, a grid becomes one item, an image punches to full frame and back while keeping the card footprint | `StackThrow` + `BlurSwap` |
| **13** | **Overlap section changes** | The next header starts **4–6 frames** before the old stage leaves (**12–15 frames** total transition); never leave an empty canvas frame | `life` + `tintAt` (6–10 f background blend) |

## Asymmetric Timing & Safe Zones

- **Exits are faster than entrances:** `8 frames` out (`EASE_IN`) vs `12 frames` in (`EASE_OUT`). Out is quiet (blur + fade in place); in has direction (rise + scale settle).
- **Background colour shifts:** blend over `6–10 frames` (`tintAt`), never flash-cut.
- **9:16 Vertical Layout (`1080x1920`):**
  - Full bleed `1080x1920` with zero letterboxing.
  - Group headline, stage card and caption around the optical centre (`padding: 120–140px 80px`, `gap: 36–64px`).
  - Keep **7 %** horizontal margins (`~75 px` left/right).
  - Keep captions out of the **bottom 10–15 %** (`y < 1630`) where platform buttons sit and out of the **top 8 %** (`y > 155`).
- **Four icon jobs only:** subject hero (`300 px`), owner badge (`84 px` tile), connected-app chip (`60–90 px`), or row marker (`30–36 px`). Never recolour a brand mark; draw unread small UI text as grey `Skeleton` bars.
