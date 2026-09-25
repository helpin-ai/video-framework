// Pure timing helpers. Every function here maps numbers to numbers, so a
// frame is always a pure function of time and renders identically everywhere.

export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/** Progress of t through [a, b], clamped to 0..1. */
export const P = (t, a, b) => (b === a ? (t >= b ? 1 : 0) : clamp((t - a) / (b - a)));

/** Linear interpolation from a to b at k (0..1). */
export const L = (a, b, k) => a + (b - a) * k;

/** Map t from [a, b] into [c, d] with an optional ease, clamped. */
export const map = (t, a, b, c, d, ease = linear) => L(c, d, ease(P(t, a, b)));

export const linear = (k) => k;
export const easeIn = (k) => k * k * k;
export const easeOut = (k) => 1 - (1 - k) ** 3;
export const easeInOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
export const expoIn = (k) => (k <= 0 ? 0 : 2 ** (10 * k - 10));
export const expoOut = (k) => (k >= 1 ? 1 : 1 - 2 ** (-10 * k));
export const expoInOut = (k) =>
  k <= 0 ? 0 : k >= 1 ? 1 : k < 0.5 ? 2 ** (20 * k - 10) / 2 : (2 - 2 ** (-20 * k + 10)) / 2;
export const backOut = (k, s = 1.70158) => 1 + (s + 1) * (k - 1) ** 3 + s * (k - 1) ** 2;
/** The site's signature curve, cubic-bezier(.16, 1, .3, 1). */
export const brandEase = bezier(0.16, 1, 0.3, 1);

/** Damped spring from 0 to 1 that settles in roughly `dur` seconds; bounce 0 = no overshoot. */
export const spring = (t, dur = 0.8, bounce = 0.25) => {
  if (t <= 0) return 0;
  const k = t / dur;
  return 1 - Math.exp(-6 * k) * Math.cos(2 * Math.PI * bounce * 2 * k);
};

/** CSS-style cubic-bezier easing. */
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u) => ((ax * u + bx) * u + cx) * u;
  const sy = (u) => ((ay * u + by) * u + cy) * u;
  const dx = (u) => (3 * ax * u + 2 * bx) * u + cx;
  return (k) => {
    if (k <= 0) return 0;
    if (k >= 1) return 1;
    let u = k;
    for (let i = 0; i < 8; i++) {
      const e = sx(u) - k;
      if (Math.abs(e) < 1e-6) break;
      const d = dx(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    return sy(clamp(u));
  };
}

/**
 * Keyframed value. frames = [[time, value, ease?], ...] sorted by time; the ease
 * on a frame shapes the segment arriving at it. Values may be numbers or arrays.
 */
export function keys(t, frames) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1, ease = easeInOut] = frames[i];
    if (t <= t1) {
      const [t0, v0] = frames[i - 1];
      const k = ease(P(t, t0, t1));
      return Array.isArray(v0) ? v0.map((x, j) => L(x, v1[j], k)) : L(v0, v1, k);
    }
  }
  return frames[frames.length - 1][1];
}

/** Fade/slide envelope: 0 → 1 over [a, a+inDur], 1 → 0 over [b-outDur, b]. */
export const envelope = (t, a, b, inDur = 0.4, outDur = 0.4, ease = brandEase) =>
  Math.min(ease(P(t, a, a + inDur)), outDur > 0 ? 1 - easeIn(P(t, b - outDur, b)) : 1);

/** Start time for item i of a staggered group. */
export const stagger = (start, i, gap = 0.08) => start + i * gap;

/** Number of characters visible when typing `text` from `start` at `cps`. */
export const typed = (text, t, start, cps = 28) =>
  text.slice(0, Math.max(0, Math.floor((t - start) * cps)));

/** Deterministic pseudo-random in 0..1 for a given seed (no Math.random in frames). */
export const rand = (seed) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Beat grid: beats(bpm)(n) → seconds of beat n. */
export const beats = (bpm) => (n) => (n * 60) / bpm;
