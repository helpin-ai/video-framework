// Helpers for narrated films (see videos/launch-film): voice-timed anchors, eases, path drawing, rects, cameras.
// Everything is a pure function of t.
import { P, L, brandEase } from './motion.js';
import { css } from './components.js';

export const E = brandEase;
/** Eased progress of t through [a, a + d]. */
export const ease = (t, a, d = 0.6, f = E) => f(P(t, a, a + d));

/** Anchors from a vo.json written by bin/vo.mjs: W(id, i) = start of word i; WP(id, prefix) = first word starting with prefix. */
export function voice(VO) {
  const LN = Object.fromEntries(VO.lines.map((l) => [l.id, l]));
  const W = (id, i = 0) => LN[id].words[i].s;
  const WP = (id, prefix) => (LN[id].words.find((w) => w.w.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(prefix.toLowerCase())) || LN[id].words[0]).s;
  const S = (id) => LN[id].start, END = (id) => LN[id].end;
  return { LN, W, WP, S, END, total: VO.total };
}

/** Opacity for a section on [a, b) with eased fades. */
export const secOp = (t, [a, b], fi = 0.45, fo = 0.45) => (t < a || t >= b ? 0 : Math.min(E(P(t, a, a + fi)), 1 - E(P(t, b - fo, b))));

/** Paths with pathLength="1": prepare once, then drawP(path, k). */
export function initPaths(root = document) {
  root.querySelectorAll('[pathLength]').forEach((p) => { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
}
export const drawP = (p, k) => { p.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, k))); };

export const setRect = (el, [x, y, w, h]) => css(el, { left: `${Math.round(x)}px`, top: `${Math.round(y)}px`, width: `${Math.round(w)}px`, height: `${Math.round(h)}px` });
/** World camera: design point (cx, cy) lands at the screen centre at scale s (transform-origin 0 0). */
export const cam = (el, [cx, cy, s], W = 1920, H = 1080) => { el.style.transform = `translate(${Math.round(W / 2 - cx * s)}px, ${Math.round(H / 2 - cy * s)}px) scale(${s.toFixed(4)})`; };
/** Point on a cubic bezier. */
export const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map((i) => v * v * v * p0[i] + 3 * v * v * u * p1[i] + 3 * v * u * u * p2[i] + u * u * u * p3[i]); };

/** Rise-in for one element: fade, a short lift, pixel-still once settled. Optional exit at `out`. */
export function inOut(el, t, at, { dy = 20, dur = 0.55, out = Infinity, outDur = 0.4, blur = 0 } = {}) {
  const k = E(P(t, at, at + dur)), o = E(P(t, out - outDur, out));
  const on = t >= at && t < out, m = Math.max(1 - k, o);
  css(el, { opacity: String(on ? k * (1 - o) : 0), transform: m > 0.001 ? `translateY(${Math.round((1 - k) * dy - o * dy * 0.5)}px)` : 'none',
    filter: blur && on && m > 0.001 ? `blur(${(m * blur).toFixed(2)}px)` : 'none' });
  return on;
}
/** Pop with a small overshoot (for chips and stamps). */
export function stamp(el, t, at, { from = 0.6, s = 2 } = {}) {
  const k = Math.min(1, P(t, at, at + 0.32));
  const b = 1 + (s + 1) * (k - 1) ** 3 + s * (k - 1) ** 2;
  css(el, { opacity: String(P(t, at, at + 0.08)), transform: k < 1 ? `scale(${L(from, 1, b).toFixed(3)})` : 'none' });
}
/** Mix two hex colours. */
export function mixHex(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(L(v, pb[i], k))).join(', ')})`;
}
/** Colour at t from keyframes [[time, '#hex'], ...] (eased between). */
export function colorAt(t, frames) {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) if (t <= frames[i][0]) return mixHex(frames[i - 1][1], frames[i][1], E(P(t, frames[i - 1][0], frames[i][0])));
  return frames.at(-1)[1];
}

/** Frame path of a generated plate (bin/genvideo.mjs) at plate-local time lt, clamped to the clip. */
export function plateFrame(PLATES, name, id, lt) {
  const p = PLATES[id], f = Math.max(1, Math.min(p.frames, Math.floor(lt * p.fps) + 1));
  return `../../out/${name}/plates/${id}/f${String(f).padStart(4, '0')}.jpg`;
}
/** Point an <img> at a frame. Returns a decode promise when the frame changed: return it from render() so the
 *  renderer waits for the pixels before capturing. */
export function showFrame(img, src) {
  if (img.dataset.src === src) return null;
  img.dataset.src = src; img.src = src;
  return img.decode().catch(() => {});
}
