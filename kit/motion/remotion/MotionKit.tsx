import React from "react";
import {Easing, Img, interpolate, interpolateColors, staticFile, useCurrentFrame} from "remotion";

// MotionKit: reusable motion primitives for Remotion vertical and horizontal films.
// Rules it encodes:
//   1. No hard cuts inside a topic (BlurSwap overlaps 8-frame exit with 12-frame entrance)
//   2. Nothing rests longer than 12 frames (drift pushes holds slowly)
//   3. Fast moves (> 300 px) blur in transit and land sharp (flyIn)
//   4. Groups build in reading order (stagger 4 frames apart)
//   5. Numbers count up and captions follow each spoken word (CountUp, WordHeadline, SpokenCaption)

export const KIT = {
  paper: "#F2EFEC",
  ink: "#0F071D",
  muted: "#8C8198",
  violet: "#7C3AED",
  line: "#D7CFD9",
  white: "#FFFFFF",
  serif: "'Playfair Display', 'Source Serif 4', Georgia, serif",
  sans: "'Plus Jakarta Sans', 'DM Sans', Helvetica, Arial, sans-serif",
};

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.5, 0, 0.9, 0.4);

export const prog = (frame: number, from: number, dur: number, easing = EASE_OUT) =>
  Number.isFinite(from) ? interpolate(frame, [from, from + dur], [0, 1], {easing, ...clamp}) : 0;

export type Motion = Pick<React.CSSProperties, "opacity" | "filter" | "transform">;

// Enter: rise, sharpen and settle over `dur` frames (default 12 frames at 30 fps).
export const blurIn = (frame: number, from: number, dur = 12, o: {y?: number; scale?: number; blur?: number} = {}): Motion => {
  const p = prog(frame, from, dur);
  const {y = 28, scale = 0.96, blur = 14} = o;
  return {opacity: p, filter: `blur(${(1 - p) * blur}px)`, transform: `translateY(${(1 - p) * y}px) scale(${scale + (1 - scale) * p})`};
};

// Exit: quicker than the entrance (default 8 frames), drifts up and softens so the next state can overlap it.
export const blurOut = (frame: number, at: number, dur = 8, o: {y?: number; blur?: number} = {}): Motion => {
  const p = prog(frame, at, dur, EASE_IN);
  const {y = -18, blur = 16} = o;
  return {opacity: 1 - p, filter: `blur(${p * blur}px)`, transform: `translateY(${p * y}px) scale(${1 - 0.03 * p})`};
};

// One call for an element that lives from frame `from` until frame `to`.
export const life = (frame: number, from: number, to: number, inDur = 12, outDur = 8): Motion =>
  frame < to ? blurIn(frame, from, inDur) : blurOut(frame, to, outDur);

// Swap content inside a container that stays put. The old state blurs out while the new one blurs in.
export const BlurSwap: React.FC<{states: {from: number; node: React.ReactNode}[]; style?: React.CSSProperties; outDur?: number}> = ({states, style, outDur = 8}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "relative", ...style}}>
      {states.map((s, i) => {
        const next = states[i + 1]?.from ?? Infinity;
        if (frame < s.from || frame > next + outDur) return null;
        return (
          <div key={i} style={{position: "absolute", inset: 0, ...life(frame, s.from, next, 12, outDur)}}>
            {s.node}
          </div>
        );
      })}
    </div>
  );
};

// A move with motion blur: blur and a slight stretch scale with speed, then it lands sharp.
export const flyIn = (
  frame: number,
  from: number,
  dur: number,
  o: {dx?: number; dy?: number; rotate?: number; fromRotate?: number} = {},
): Motion => {
  const {dx = 0, dy = 900, rotate = 0, fromRotate = rotate * 3} = o;
  const p = prog(frame, from, dur);
  const prev = prog(frame - 1, from, dur);
  const speed = (p - prev) * Math.hypot(dx, dy);
  const blur = Math.min(speed * 0.22, 26);
  const stretch = 1 + Math.min(speed / 900, 0.1);
  const vertical = Math.abs(dy) >= Math.abs(dx);
  return {
    opacity: frame < from ? 0 : 1,
    filter: `blur(${blur}px)`,
    transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy}px) rotate(${fromRotate + (rotate - fromRotate) * p}deg) scale(${vertical ? 1 : stretch}, ${vertical ? stretch : 1})`,
  };
};

// Slow push during a hold, so a resting frame is never frozen.
export const drift = (frame: number, from: number, to: number, amount = 0.035) =>
  1 + amount * interpolate(frame, [from, to], [0, 1], clamp);

// Items of one group enter in reading order (default 4 frames apart).
export const stagger = (index: number, from: number, gap = 4) => from + index * gap;

// Dim everything except the item in focus. `t` is 0 (all equal) to 1 (fully focused).
export const focus = (isActive: boolean, t: number): React.CSSProperties =>
  isActive ? {opacity: 1} : {opacity: 1 - 0.62 * t, filter: `saturate(${1 - 0.7 * t})`};

export const CountUp: React.FC<{to: number; from: number; dur?: number; style?: React.CSSProperties}> = ({to, from, dur = 24, style}) => {
  const frame = useCurrentFrame();
  return <span style={{fontVariantNumeric: "tabular-nums", ...style}}>{Math.round(to * prog(frame, from, dur)).toLocaleString("en-US")}</span>;
};

// Cards thrown onto a pile: each lands rotated, with blur while it travels.
export const StackThrow: React.FC<{
  from: number;
  gap?: number;
  width: number;
  height: number;
  items: React.ReactNode[];
  style?: React.CSSProperties;
}> = ({from, gap = 7, width, height, items, style}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "relative", width, height, ...style}}>
      {items.map((node, i) => {
        const rotate = ((i * 37) % 11) - 5;
        const side = i % 2 ? 1 : -1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 28,
              overflow: "hidden",
              background: KIT.white,
              border: `2px solid ${KIT.line}`,
              boxShadow: "0 24px 60px rgba(15,7,29,0.18), 0 4px 12px rgba(15,7,29,0.10)",
              ...flyIn(frame, stagger(i, from, gap), 11, {dx: side * 120, dy: 760, rotate}),
            }}
          >
            {node}
          </div>
        );
      })}
    </div>
  );
};

// Headline revealed word by word; `italicFrom` marks where the accent half begins.
export const WordHeadline: React.FC<{text: string; from: number; gap?: number; italicFrom?: number; size?: number; ink?: string; style?: React.CSSProperties}> = ({
  text,
  ink = KIT.ink,
  from,
  gap = 3,
  italicFrom = Infinity,
  size = 74,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: KIT.serif, fontWeight: 700, fontSize: size, lineHeight: 1.1, color: ink, textAlign: "center", ...style}}>
      {text.split(" ").map((w, i) => (
        <span key={i} style={{display: "inline-block", marginRight: "0.26em", fontStyle: "italic", color: i >= italicFrom ? KIT.violet : ink, ...blurIn(frame, stagger(i, from, gap), 10, {y: 18, blur: 10})}}>
          {w}
        </span>
      ))}
    </div>
  );
};

export type KitWord = {w: string; start: number; end: number};

// Word-synced caption: phrase sits muted on screen and each word turns to solid ink as it is spoken.
export const SpokenCaption: React.FC<{words: KitWord[]; fps: number; a: number; b: number; emphasis?: Set<number>; from: number; ink?: string; accent?: string; style?: React.CSSProperties}> = ({
  words,
  ink = KIT.ink,
  accent = KIT.violet,
  fps,
  a,
  b,
  emphasis,
  from,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: KIT.serif, fontWeight: 500, fontSize: 44, lineHeight: 1.25, textAlign: "center", ...blurIn(frame, from, 6, {y: 8, blur: 6, scale: 1}), ...style}}>
      {words.slice(a, b).map((w, k) => {
        const i = a + k;
        const said = interpolate(frame, [Math.round(w.start * fps) - 1, Math.round(w.start * fps) + 3], [0, 1], clamp);
        const hot = emphasis?.has(i);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.26em",
              color: hot ? accent : ink,
              opacity: 0.3 + 0.7 * said,
              transform: `translateY(${(1 - said) * 3}px)`,
              ...(hot ? {fontStyle: "italic", fontWeight: 700, fontSize: 54} : {}),
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// Small orientation strip for films with 3 or more parts.
export const ChapterNav: React.FC<{labels: string[]; starts: number[]; style?: React.CSSProperties}> = ({labels, starts, style}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: "flex", justifyContent: "center", gap: 12, ...style}}>
      {labels.map((label, i) => {
        const on = prog(frame, starts[i], 10) * (1 - prog(frame, starts[i + 1] ?? Infinity, 8));
        return (
          <div key={label} style={{position: "relative", padding: "8px 18px", borderRadius: 999, fontFamily: KIT.sans, fontWeight: 700, fontSize: 18, letterSpacing: 2, color: KIT.muted}}>
            <div style={{position: "absolute", inset: 0, borderRadius: 999, background: KIT.ink, opacity: on, transform: `scale(${0.9 + 0.1 * on})`}} />
            <span style={{position: "relative", color: on > 0.5 ? KIT.white : KIT.muted}}>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

// Pop with a small overshoot: for icons, status dots and badges. Never for body text.
export const popIn = (frame: number, from: number, dur = 12): Motion => {
  const p = prog(frame, from, dur, Easing.bezier(0.34, 1.56, 0.64, 1));
  const o = prog(frame, from, 5);
  return {opacity: o, filter: `blur(${(1 - o) * 6}px)`, transform: `scale(${0.6 + 0.4 * p})`};
};

// Background that changes colour over `dur` frames (6-10 f) between sections instead of flash-cutting.
export const tintAt = (frame: number, stops: {at: number; color: string}[], dur = 10) => {
  let color = stops[0].color;
  for (let i = 1; i < stops.length; i++) {
    if (frame >= stops[i].at) color = interpolateColors(Math.min(frame, stops[i].at + dur), [stops[i].at, stops[i].at + dur], [stops[i - 1].color, stops[i].color]);
  }
  return color;
};

const TILE_SHADOW = "0 10px 26px rgba(15,7,29,0.10), 0 2px 6px rgba(15,7,29,0.06)";
export const iconSrc = (slug: string, variant = "default") => staticFile(`icons/${slug}/${variant}.svg`);

// Three icon sizes only. Every icon sits in a container; none float bare.
export const ICON = {hero: 300, tile: 84, inline: 34} as const;

export const IconTile: React.FC<{slug: string; variant?: string; src?: string; size?: number; from?: number; style?: React.CSSProperties}> = ({slug, variant, src, size = ICON.tile, from = 0, style}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{width: size, height: size, borderRadius: size * 0.26, background: KIT.white, border: `1.5px solid ${KIT.line}`, boxShadow: TILE_SHADOW, display: "flex", alignItems: "center", justifyContent: "center", ...popIn(frame, from), ...style}}>
      <Img src={src ?? iconSrc(slug, variant)} style={{width: size * 0.56, height: size * 0.56}} />
    </div>
  );
};

export const IconChip: React.FC<{slug: string; variant?: string; src?: string; label: string; from: number; liveAt?: number; active?: boolean; row?: boolean; style?: React.CSSProperties}> = ({
  slug,
  variant,
  src,
  label,
  from,
  liveAt,
  active,
  row,
  style,
}) => {
  const frame = useCurrentFrame();
  const live = liveAt === undefined ? 0 : prog(frame, liveAt, 6);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: row ? "row" : "column",
        alignItems: "center",
        gap: row ? 10 : 12,
        padding: row ? "10px 18px" : "22px 30px",
        borderRadius: row ? 999 : 24,
        background: KIT.white,
        border: `${active ? 3 : 1.5}px solid ${active ? KIT.violet : KIT.line}`,
        boxShadow: TILE_SHADOW,
        fontFamily: KIT.sans,
        fontWeight: 700,
        fontSize: row ? 22 : 26,
        color: KIT.ink,
        ...blurIn(frame, from, 12, {y: 20, scale: 0.9}),
        ...style,
      }}
    >
      <Img src={src ?? iconSrc(slug, variant)} style={{width: row ? ICON.inline : 56, height: row ? ICON.inline : 56}} />
      {label}
      {liveAt !== undefined && <div style={{position: "absolute", right: 12, top: 12, width: 12, height: 12, borderRadius: 6, background: "#22C55E", opacity: live, transform: `scale(${0.4 + 0.6 * live})`}} />}
    </div>
  );
};

// Grey bar that stands in for unread small UI text; real copy replaces it only where it matters.
export const Skeleton: React.FC<{width: number | string; from: number; height?: number; style?: React.CSSProperties}> = ({width, from, height = 18, style}) => {
  const frame = useCurrentFrame();
  return <div style={{width, height, borderRadius: height / 2, background: KIT.line, transformOrigin: "left", transform: `scaleX(${prog(frame, from, 14)})`, opacity: 0.8, ...style}} />;
};

// Dotted connector that draws from a parent to a child.
export const Connector: React.FC<{d: string; from: number; dur?: number; width: number; height: number; style?: React.CSSProperties}> = ({d, from, dur = 14, width, height, style}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, from, dur);
  return (
    <svg width={width} height={height} style={{position: "absolute", left: 0, top: 0, ...style}}>
      <path d={d} fill="none" stroke={KIT.muted} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="2 9" pathLength={100} style={{clipPath: `inset(0 ${100 - p * 100}% 0 0)`}} opacity={0.8} />
    </svg>
  );
};
