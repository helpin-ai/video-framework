// House style for use-case videos, matched to the launch reel: a quiet forest stage with line bundles, a
// left column (mono eyebrow, semibold headline with a sage second clause, a short lede) and product UI on the
// right. Words fade in with a soft blur, screens cross-dissolve, nothing flashes or shakes.
// Everything is a pure function of t, like the rest of the framework.
import { P, L, brandEase } from './motion.js';
import { helpinSymbol, lineBundles, css } from './components.js';

const soft = (t, a, dur = 0.7) => brandEase(P(t, a, a + dur));

/** Split HTML into words (an <em>…</em> stays one unit). Returns the spans for rise(). */
export function words(el, html) {
  el.innerHTML = html.split(/(?<!<em)\s+(?![^<]*<\/em>)/).map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
  return [...el.querySelectorAll('.w > span')];
}
/** Words fade up with a soft blur, staggered (the launch reel's reveal). Pixel-still once settled. */
export function rise(ws, t, start, gap = 0.08, dur = 0.8) {
  ws.forEach((w, i) => {
    const k = soft(t, start + i * gap, dur);
    w.style.opacity = String(k);
    w.style.transform = k >= 1 ? 'none' : `translateY(${((1 - k) * 0.28).toFixed(3)}em)`;
    w.style.filter = k >= 1 ? 'none' : `blur(${((1 - k) * 10).toFixed(2)}px)`;
  });
}
/** Reveal an element: fade, a short rise and a blur that clears. Optional exit at `out`. */
export function reveal(el, t, at, { dy = 24, dur = 0.7, out = Infinity, outDur = 0.45, blur = 10 } = {}) {
  const k = soft(t, at, dur), o = brandEase(P(t, out - outDur, out));
  const on = t >= at && t < out;
  const m = Math.max(1 - k, o);
  css(el, { opacity: String(on ? k * (1 - o) : 0), transform: m > 0.001 ? `translateY(${Math.round((1 - k) * dy - o * dy * 0.5)}px)` : 'none', filter: on && m > 0.001 ? `blur(${(m * blur).toFixed(2)}px)` : 'none' });
  return on;
}
/** Small UI element appearing (chips, rows, cards inside a screen): quiet rise, no overshoot. */
export function pop(el, t, at, { dist = 14, dx = 0, dur = 0.5 } = {}) {
  const k = soft(t, at, dur);
  css(el, { opacity: String(k), transform: k >= 1 ? 'none' : `translate(${Math.round((1 - k) * dx)}px, ${Math.round((1 - k) * dist)}px)` });
  return t >= at;
}
/** A screen shown on [tin, tout): cross-dissolves in and out with a small drift and a soft blur. */
export function push(el, t, tin, tout, { base = '', dy = 30, blur = 10 } = {}) {
  const k = soft(t, tin, 0.6), o = brandEase(P(t, tout - 0.45, tout));
  const on = t >= tin && t < tout, m = Math.max(1 - k, o);
  el.style.opacity = String(on ? k * (1 - o) : 0);
  el.style.transform = `${base} ${m > 0.001 ? `translateY(${Math.round((1 - k) * dy - o * dy * 0.5)}px)` : ''}`.trim() || 'none';
  el.style.filter = on && m > 0.001 ? `blur(${(m * blur).toFixed(2)}px)` : 'none';
  return on;
}
/** A centred type screen on [a, b): words fade in, the screen dissolves out. */
export function bigScreen(el, ws, t, a, b, gap = 0.1) {
  const on = t >= a && t < b, o = brandEase(P(t, b - 0.45, b));
  css(el, { opacity: String(on ? 1 - o : 0), filter: o > 0.001 ? `blur(${(o * 10).toFixed(2)}px)` : 'none' });
  if (on) rise(ws, t, a + 0.05, gap);
  return on;
}
/** Stacked lines (the launch opener): each line fades in; earlier lines dim. lines = [[el, words, at], ...]. */
export function stack(t, lines, { dim = 0.32 } = {}) {
  lines.forEach(([el, ws, at], i) => {
    rise(ws, t, at, 0.07);
    const next = lines[i + 1];
    const d = next ? soft(t, next[2], 0.6) : 0;
    el.style.opacity = String(L(1, dim, d));
  });
}
/** Flashes are gone from the house style; kept as a no-op so older scenes still run. */
export const flashAt = () => 0;

/**
 * The left column: per-station eyebrow, headline and lede that cross-dissolve.
 * steps = [{ at, eyebrow, head, lede }], shown until the next step or `end`.
 */
export function sideCopy($, steps, end) {
  const host = $('#side');
  const blocks = steps.map((s) => {
    const b = document.createElement('div');
    b.className = 'sidecopy';
    b.innerHTML = `<div class="eyebrow">${s.eyebrow || ''}</div><div class="h"></div>${s.lede ? `<div class="lede">${s.lede}</div>` : ''}`;
    host.appendChild(b);
    return { b, ws: words(b.querySelector('.h'), s.head), lede: b.querySelector('.lede'), eb: b.querySelector('.eyebrow'), s };
  });
  return (t) => blocks.forEach(({ b, ws, lede, eb, s }, i) => {
    const until = steps[i + 1]?.at ?? end;
    const on = t >= s.at && t < until, o = brandEase(P(t, until - 0.4, until));
    css(b, { opacity: String(on ? 1 - o : 0), filter: o > 0.001 ? `blur(${(o * 8).toFixed(2)}px)` : 'none' });
    if (!on) return;
    reveal(eb, t, s.at, { dy: 10 });
    rise(ws, t, s.at + 0.1, 0.07);
    if (lede) reveal(lede, t, s.at + 0.45, { dy: 12 });
  });
}

/**
 * The rig: product UI designed in 1920×1080 space, shown on the right like the launch reel's cards.
 * poses = [[at, cx, cy, s, sx?, sy?]]: the design point (cx, cy) lands at screen (sx, sy) (default x0, y0) at scale s; moves ease between poses
 * and hold still in between (no slow zooms on UI, so nothing shimmers).
 */
export function rig(el, poses, { x0 = 1290, y0 = 560, dur = 0.8 } = {}) {
  el.style.transformOrigin = '0 0';
  return (t) => {
    let i = 0;
    while (i + 1 < poses.length && t >= poses[i + 1][0]) i++;
    const cur = poses[i], prev = poses[Math.max(0, i - 1)];
    const k = i === 0 ? 1 : brandEase(P(t, cur[0], cur[0] + dur));
    const cx = L(prev[1], cur[1], k), cy = L(prev[2], cur[2], k), s = L(prev[3], cur[3], k);
    const sx = L(prev[4] ?? x0, cur[4] ?? x0, k), sy = L(prev[5] ?? y0, cur[5] ?? y0, k);
    el.style.transform = `translate(${Math.round(sx - cx * s)}px, ${Math.round(sy - cy * s)}px) scale(${s.toFixed(4)})`;
  };
}

/** Line bundles in the background (drawn once in the first seconds, then still). */
export function bundles($) {
  const svg = $('#bundles');
  const a = lineBundles(svg, { count: 24, gap: 12, slope: 0.5, cx: 1460, cy: 720, spread: 90, alpha: [0.03, 0.12] });
  return (t) => a.update(Math.min(t * 0.8 + 0.2, 6));
}

/** The shared end card: two tagline lines, then the Helpin mark and CTA. Needs #t1 #t2 #endmark #end-symbol #cta. */
export function endCard($, l1, l2) {
  const T1 = words($('#t1'), l1), T2 = words($('#t2'), l2);
  const mark = helpinSymbol({ size: 92, color: '#E8EEEA' });
  $('#end-symbol').append(mark.node);
  return (t, at, B) => {
    const on = t >= at;
    $('#tag').style.opacity = on ? '1' : '0';
    if (on) { rise(T1, t, at + 0.1); rise(T2, t, at + 2 * B); }
    mark.assemble(P(t, at + 4 * B, at + 6 * B));
    const mk = brandEase(P(t, at + 4 * B, at + 5.5 * B)), ck = brandEase(P(t, at + 5 * B, at + 6.5 * B));
    css($('#endmark'), { opacity: String(mk), transform: mk < 1 ? `translateY(${(1 - mk) * 16}px)` : 'none' });
    css($('#cta'), { opacity: String(ck), transform: ck < 1 ? `translateY(${(1 - ck) * 16}px)` : 'none' });
  };
}

/** CSS shared by the use-case videos (inject once). */
export const KIT_CSS = `
  #stage { background: radial-gradient(ellipse 70% 80% at 30% 35%, #0F3228, #081B16 60%, #06140F); color: #E8EEEA; }
  #dots { display: none; }
  #bundles { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  em { font-style: normal; color: var(--sage); }
  .w { display: inline-block; } .w > span { display: inline-block; }
  .scr { position: absolute; inset: 0; opacity: 0; }
  .mega { position: absolute; left: 0; width: 1920px; text-align: center; font-weight: 600; letter-spacing: -0.045em; line-height: 1.02; white-space: nowrap; color: #E8EEEA; }
  .sub2 { position: absolute; left: 0; width: 1920px; text-align: center; font-size: 36px; font-weight: 400; letter-spacing: -0.01em; color: #A9B8B0; }
  .topline { position: absolute; left: 0; width: 1920px; top: 70px; text-align: center; font-size: 84px; font-weight: 600; letter-spacing: -0.045em; line-height: 1.05; white-space: nowrap; }
  .card { position: absolute; background: #fff; color: var(--ink); border-radius: 22px; box-shadow: 0 40px 100px rgba(0, 0, 0, .45), 0 0 0 1px rgba(184, 221, 187, .10); }
  #side { position: absolute; left: 140px; top: 0; width: 640px; height: 1080px; }
  .sidecopy { position: absolute; left: 0; top: 330px; width: 640px; opacity: 0; }
  .sidecopy .eyebrow { font: 500 24px/1 var(--mono); letter-spacing: .3em; color: rgba(184, 221, 187, .75); margin-bottom: 30px; text-transform: uppercase; }
  .sidecopy .h { font-size: 76px; font-weight: 600; letter-spacing: -0.045em; line-height: 1.04; color: #E8EEEA; }
  .sidecopy .lede { margin-top: 28px; font-size: 30px; line-height: 1.4; color: #A9B8B0; max-width: 580px; }
  .lines { position: absolute; left: 140px; top: 390px; width: 900px; }
  .lines div { font-size: 66px; font-weight: 600; letter-spacing: -0.04em; line-height: 1.12; color: #E8EEEA; }
  #rigwrap { position: absolute; inset: 0; overflow: hidden; }
  #rig { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
  #tag { position: absolute; left: 0; width: 1920px; top: 280px; text-align: center; font-size: 110px; font-weight: 600; letter-spacing: -0.045em; line-height: 1.08; opacity: 0; }
  #endmark { position: absolute; left: 0; width: 1920px; top: 640px; display: flex; justify-content: center; align-items: center; gap: 22px; opacity: 0; }
  #endmark b { font-size: 84px; font-weight: 600; letter-spacing: -0.045em; color: #E8EEEA; }
  #cta { position: absolute; left: 0; width: 1920px; top: 790px; display: flex; justify-content: center; gap: 14px; opacity: 0; }
  #cta span { height: 56px; padding: 0 24px; display: inline-flex; align-items: center; gap: 12px; border-radius: 12px; font: 500 24px/1 var(--sans); }
  #cta .url { background: #E8EEEA; color: var(--forest); font-weight: 600; } #cta .t { border: 1px solid #2F5A45; color: #C9D6CF; }
  #cta .t i { width: 9px; height: 9px; border-radius: 50%; background: var(--sage); }
  #flash { display: none; }
  .cursor { position: absolute; left: 0; top: 0; opacity: 0; z-index: 9; }
  .cursor svg { width: 40px; height: 40px; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, .45)); }
`;
export const END_HTML = `<div id="tag"><div id="t1"></div><div id="t2"></div></div>
  <div id="endmark"><span id="end-symbol"></span><b>Helpin</b></div>
  <div id="cta"><span class="url">helpin.ai</span><span class="t"><i></i>Open source · Coming soon</span></div>`;
export const BUNDLES_HTML = '<svg id="bundles" viewBox="0 0 1920 1080"></svg>';
export const CURSOR_SVG = '<svg viewBox="0 0 24 24"><path d="M4 2l15 11.5-6.6.9 3.9 7.6-2.9 1.4-3.8-7.7L4 20z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>';
