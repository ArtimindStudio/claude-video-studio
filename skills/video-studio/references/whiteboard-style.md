# Style 01: Whiteboard sketch (`/whiteboard-video`)

- **Engine:** Deterministic HTML + Canvas 2D (`window.__seek(f)` at `30 fps`, `1080x1920`)
- **Reference scene:** `~/.claude/skills/video-studio/kit/scene_v2/whiteboard.html`
- **Starter template:** `~/.claude/skills/video-studio/kit/templates/seek-page-starter.html`
- **Palette:** Warm white board (`#FAF8F4`), black marker (`#18181B`, `3-4 px` round caps/joins), soft slate shading (`#E4E2DD`), and one single violet callout ink (`#7C3AED`).
- **Motion grammar:**
  1. Progressive path draw-on in the first `1.6 s` (`f = 0..48`) in natural stroke order (frame -> character -> props -> violet circle callout).
  2. Continuous ambient motion during holds (steam curls, typing hands, rain streaks) so no 12-frame span is frozen.
  3. Hand-lettered labels and arrows stay inside the `1080x1920` safe box (`top >= 160 px`, `bottom <= 1620 px`, `right <= 920 px`).
