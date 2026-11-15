/**
 * MotionKit for HTML seek pages (window.renderFrame(f) / seek(t)).
 *
 * Pure functions of frame `f` (or seconds `t`). No wall-clock timers, no unseeded
 * randomness, no state carried from the previous frame.
 *
 * Exports (on `window.MotionKit` and as ES module exports):
 *   clamp, outCubic, inCubic, outBack, spring, prog,
 *   blurIn, blurOut, life, BlurSwap, flyIn, drift, stagger, focus,
 *   CountUp, WordHeadline, SpokenCaption, ChapterNav, styleString, applyMotion
 */
(function (root) {
  const clamp = (x, lo = 0, hi = 1) => Math.min(Math.max(x, lo), hi);
  const outCubic = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const inCubic = (x) => Math.pow(clamp(x), 3);
  const outBack = (x, s = 1.4) => {
    const u = clamp(x) - 1;
    return 1 + u * u * ((s + 1) * u + s);
  };
  const spring = (x, k = 9, d = 0.55) => {
    const u = clamp(x);
    return 1 - Math.exp(-k * d * u) * Math.cos(k * Math.sqrt(1 - d * d) * u);
  };

  // Progress from 0 to 1 over `dur` frames starting at frame `from`.
  const prog = (frame, from, dur, easeFn = outCubic) =>
    Number.isFinite(from) && dur > 0 ? easeFn(clamp((frame - from) / dur)) : 0;

  // Enter: rise, sharpen and settle over `dur` frames (default 12 frames at 30 fps).
  const blurIn = (frame, from, dur = 12, opts = {}) => {
    const p = prog(frame, from, dur, outCubic);
    const y = opts.y !== undefined ? opts.y : 28;
    const scale = opts.scale !== undefined ? opts.scale : 0.96;
    const blur = opts.blur !== undefined ? opts.blur : 14;
    return {
      opacity: p,
      blur: (1 - p) * blur,
      y: (1 - p) * y,
      scale: scale + (1 - scale) * p,
      filter: `blur(${((1 - p) * blur).toFixed(2)}px)`,
      transform: `translateY(${((1 - p) * y).toFixed(2)}px) scale(${(scale + (1 - scale) * p).toFixed(4)})`,
    };
  };

  // Exit: quicker than entrance (default 8 frames), drifts up and softens so the next state can overlap it.
  const blurOut = (frame, at, dur = 8, opts = {}) => {
    const p = prog(frame, at, dur, inCubic);
    const y = opts.y !== undefined ? opts.y : -18;
    const blur = opts.blur !== undefined ? opts.blur : 16;
    return {
      opacity: 1 - p,
      blur: p * blur,
      y: p * y,
      scale: 1 - 0.03 * p,
      filter: `blur(${(p * blur).toFixed(2)}px)`,
      transform: `translateY(${(p * y).toFixed(2)}px) scale(${(1 - 0.03 * p).toFixed(4)})`,
    };
  };

  // Combined entrance and exit for an element that lives from frame `from` to frame `to`.
  const life = (frame, from, to, inDur = 12, outDur = 8, opts = {}) =>
    frame < to ? blurIn(frame, from, inDur, opts) : blurOut(frame, to, outDur, opts);

  // Swap states inside one container without a blank frame.
  // states: [{ id, from, ...data }] -> returns active states with their `motion` object at `frame`.
  const BlurSwap = (frame, states, inDur = 12, outDur = 8) => {
    const active = [];
    for (let i = 0; i < states.length; i++) {
      const s = states[i];
      const nextFrom = i + 1 < states.length ? states[i + 1].from : Infinity;
      if (frame >= s.from && frame <= nextFrom + outDur) {
        active.push({
          index: i,
          state: s,
          motion: life(frame, s.from, nextFrom, inDur, outDur),
        });
      }
    }
    return active;
  };

  // Fast move (> 300 px) with directional motion blur that lands sharp.
  const flyIn = (frame, from, dur = 11, opts = {}) => {
    const dx = opts.dx !== undefined ? opts.dx : 0;
    const dy = opts.dy !== undefined ? opts.dy : 900;
    const rotate = opts.rotate !== undefined ? opts.rotate : 0;
    const fromRotate = opts.fromRotate !== undefined ? opts.fromRotate : rotate * 3;
    const p = prog(frame, from, dur, outCubic);
    const prev = prog(frame - 1, from, dur, outCubic);
    const speed = (p - prev) * Math.hypot(dx, dy);
    const blur = Math.min(speed * 0.22, 26);
    const stretch = 1 + Math.min(speed / 900, 0.1);
    const vertical = Math.abs(dy) >= Math.abs(dx);
    const sx = vertical ? 1 : stretch;
    const sy = vertical ? stretch : 1;
    const tx = (1 - p) * dx;
    const ty = (1 - p) * dy;
    const deg = fromRotate + (rotate - fromRotate) * p;
    return {
      opacity: frame < from ? 0 : 1,
      blur,
      x: tx,
      y: ty,
      rotate: deg,
      scaleX: sx,
      scaleY: sy,
      filter: `blur(${blur.toFixed(2)}px)`,
      transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) rotate(${deg.toFixed(2)}deg) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
    };
  };

  // Slow push during a hold (default 3.5 % over the section) so no frame ever freezes.
  const drift = (frame, from, to, amount = 0.035) =>
    1 + amount * clamp((frame - from) / Math.max(1, to - from));

  // Stagger items in reading order (default 4 frames apart at 30 fps).
  const stagger = (index, from, gap = 4) => from + index * gap;

  // Dim and desaturate inactive items when one item is in focus (t = 0..1).
  const focus = (isActive, t = 1) => {
    const k = clamp(t);
    return isActive
      ? { opacity: 1, saturate: 1, filter: 'none' }
      : { opacity: 1 - 0.62 * k, saturate: 1 - 0.7 * k, filter: `saturate(${(1 - 0.7 * k).toFixed(2)})` };
  };

  // Alive number counter that ticks from 0 to `to` over `dur` frames.
  const CountUp = (frame, to, from, dur = 24) =>
    Math.round(to * prog(frame, from, dur, outCubic)).toLocaleString('en-US');

  // Word-by-word headline state; words >= italicFrom use the accent treatment.
  const WordHeadline = (frame, text, from, opts = {}) => {
    const gap = opts.gap !== undefined ? opts.gap : 3;
    const italicFrom = opts.italicFrom !== undefined ? opts.italicFrom : Math.ceil(text.split(/\s+/).length / 2);
    return text.split(/\s+/).map((w, i) => ({
      word: w,
      index: i,
      accent: i >= italicFrom,
      motion: blurIn(frame, stagger(i, from, gap), 10, { y: 18, blur: 10 }),
    }));
  };

  // Word-synced caption state: phrase sits at 0.3 opacity and each word turns solid (1.0) as spoken.
  // words: [{ w, t0, t1 }] or [{ w, start, end }], fps default 30.
  const SpokenCaption = (frame, words, from, opts = {}) => {
    const fps = opts.fps || 30;
    const emphasis = opts.emphasis instanceof Set ? opts.emphasis : new Set(opts.emphasis || []);
    const container = blurIn(frame, from, 6, { y: 8, blur: 6, scale: 1 });
    const items = words.map((item, i) => {
      const tStart = item.t0 !== undefined ? item.t0 : item.start;
      const startFrame = Math.round(tStart * fps);
      const said = clamp((frame - (startFrame - 1)) / 4);
      const hot = emphasis.has(i) || Boolean(item.hot);
      return {
        word: item.w,
        index: i,
        said,
        hot,
        opacity: 0.3 + 0.7 * said,
        y: (1 - said) * 3,
      };
    });
    return { container, items };
  };

  // Orientation strip state for films with 3 or more parts.
  const ChapterNav = (frame, labels, starts) =>
    labels.map((label, i) => {
      const nextStart = i + 1 < starts.length ? starts[i + 1] : Infinity;
      const active = prog(frame, starts[i], 10) * (1 - prog(frame, nextStart, 8));
      return { label, index: i, active };
    });

  // Apply a motion object (`{ opacity, filter, transform }`) directly to a DOM element.
  const applyMotion = (el, m) => {
    if (!el || !m) return;
    if (m.opacity !== undefined) el.style.opacity = String(m.opacity);
    if (m.filter !== undefined) el.style.filter = m.filter;
    if (m.transform !== undefined) el.style.transform = m.transform;
  };

  const MotionKit = {
    clamp,
    outCubic,
    inCubic,
    outBack,
    spring,
    prog,
    blurIn,
    blurOut,
    life,
    BlurSwap,
    flyIn,
    drift,
    stagger,
    focus,
    CountUp,
    WordHeadline,
    SpokenCaption,
    ChapterNav,
    applyMotion,
  };

  root.MotionKit = MotionKit;
})(typeof window !== 'undefined' ? window : globalThis);
