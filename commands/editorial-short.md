---
description: Direct and render a house editorial 9:16 vertical short (#F2EFEC warm paper, #0F071D ink, #7C3AED electric violet, Playfair Display italic + Plus Jakarta Sans, blur-swaps, staggered builds, word-by-word captions).
argument-hint: <script or topic>
---

Read `~/.claude/skills/video-studio/SKILL.md`, `~/.claude/skills/video-studio/references/cards/house-editorial.md`, and use the motion primitives in `~/.claude/skills/lowpoly-video/kit/motion/html/motion-kit.js` (or `kit/motion/remotion/MotionKit.tsx`).

User request: `$ARGUMENTS`

Build a deterministic 9:16 editorial film that obeys the 5 motion laws (`blurSwap`, `drift`, `flyIn`, `stagger`, `CountUp`, `spokenCaption`). Render `--preview` frames first, inspect them, then export the full MP4 and run `sound_check.sh`.
