# Seamless Loop Rules (`LOOP=1`)

When a short or background reel is built as a seamless loop (`LOOP=1` in `build.sh` and `loop: true` in `config`):

1. **Camera seam:** The last camera keyframe in `cam` must match the first keyframe (`set`, `tx`, `ty`, `tz`, `frustum`, `az`, `el`) within `1e-3`. `engine.js` warns if they differ.
2. **Sky seam:** The last sky keyframe in `sky` must equal the first sky keyframe (`top`, `bot`, `sunI`, `sun`, `hemi`, `stars`).
3. **Periodic continuous motions:** Any `anim(..., 'fn', { fn: (o, t) => ... })` or `sinL(t, period, phase)` must use a period that divides the loop duration `DUR` (e.g., `0.25 s`, `0.75 s`, `1.5 s`, `3.0 s` for a `3.0 s` loop).
4. **Object un-build (`o.out`):** Any object that pops, rises, or drops in after `t = 0` must either set `o.out = DUR - 0.35` so it un-builds before the loop seam, or start at `t0 = 0` already in place.
5. **Verification:** `sh "$LOWPOLY_SKILL/scripts/loop_check.sh" .` extracts `qa/first.png` and `qa/last.png` and computes SSIM (target `>= 0.93`).
