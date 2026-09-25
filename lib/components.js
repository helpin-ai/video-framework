// Reusable Helpin pieces. Each builder returns a DOM node plus an update(k|t)
// function that is pure in its input, so it can be called from any scene render.

import { P, L, clamp, brandEase, backOut, easeIn, easeInOut, rand } from './motion.js';

const SVG = 'http://www.w3.org/2000/svg';

// The 8 pieces of the Helpin symbol (helpin/website/public/brand/kit/helpin-symbol-white.svg).
const SYMBOL_PIECES = [
  'M55.818,41.273 H26.727 A8.727,8.727 0 0 1 26.727,23.818 H55.818 Z',
  'M79.091,26.041 A8.727,8.727 0 0 1 79.091,39.050 Z',
  'M20.909,73.959 A8.727,8.727 0 0 1 20.909,60.950 Z',
  'M44.182,58.727 H73.273 A8.727,8.727 0 0 1 73.273,76.182 H44.182 Z',
  'M26.041,20.909 A8.727,8.727 0 0 1 39.050,20.909 Z',
  'M41.273,44.182 V73.273 A8.727,8.727 0 0 1 23.818,73.273 V44.182 Z',
  'M58.727,55.818 V26.727 A8.727,8.727 0 0 1 76.182,26.727 V55.818 Z',
  'M73.959,79.091 A8.727,8.727 0 0 1 60.950,79.091 Z',
];

/**
 * Helpin symbol whose pieces fly in from around it.
 *   const sym = helpinSymbol({ size: 220 }); el.append(sym.node);
 *   sym.assemble(k)  // k 0..1: 0 scattered/invisible, 1 locked together
 */
export function helpinSymbol({ size = 200, color = '#FFFFFF', spread = 180 } = {}) {
  const node = document.createElementNS(SVG, 'svg');
  node.setAttribute('viewBox', '13.636 13.636 72.727 72.727');
  node.setAttribute('width', size);
  node.setAttribute('height', size);
  node.classList.add('symbol');
  const paths = SYMBOL_PIECES.map((d, i) => {
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('d', d);
    p.setAttribute('fill', color);
    node.appendChild(p);
    const a = (i / SYMBOL_PIECES.length) * Math.PI * 2 + rand(i) * 0.6;
    return { p, dx: Math.cos(a) * spread, dy: Math.sin(a) * spread, rot: (rand(i + 9) - 0.5) * 180 };
  });
  const scale = 72.727 / size; // px → viewBox units
  return {
    node,
    assemble(k) {
      paths.forEach(({ p, dx, dy, rot }, i) => {
        const e = backOut(clamp((k - i * 0.04) / 0.72), 1.3);
        const m = 1 - e;
        p.style.transform = `translate(${dx * m * scale}px, ${dy * m * scale}px) rotate(${rot * m}deg) scale(${L(0.4, 1, e)})`;
        p.style.opacity = clamp(e * 2);
      });
    },
  };
}

/**
 * Kinetic stack of lines revealed one after another, camera-following the
 * newest line so the stack stays centred.
 *   const k = kineticLines(el, ['Line one.', 'Line two.'], { at: [0.3, 1.3], lineHeight: 110 });
 *   k.update(lt)
 */
export function kineticLines(container, lines, { at, lineHeight = 110, className = 'h1', rise = 40 } = {}) {
  const block = document.createElement('div');
  block.style.cssText = 'position:absolute;left:0;right:0;text-align:center;will-change:transform';
  const els = lines.map((text) => {
    const d = document.createElement('div');
    d.className = className;
    d.style.height = `${lineHeight}px`;
    d.innerHTML = text;
    block.appendChild(d);
    return d;
  });
  container.appendChild(block);
  const times = at || lines.map((_, i) => 0.3 + i * 0.8);
  return {
    block,
    update(t) {
      let shown = 0;
      els.forEach((el, i) => {
        const k = brandEase(P(t, times[i], times[i] + 0.6));
        if (t >= times[i]) shown++;
        el.style.opacity = k;
        el.style.transform = `translateY(${(1 - k) * rise}px)`;
        el.style.filter = k < 1 ? `blur(${(1 - k) * 8}px)` : 'none';
      });
      // Ease the camera between "n lines" and "n+1 lines" centred.
      let centreLines = 1;
      times.forEach((ti, i) => { if (i > 0) centreLines += easeInOut(P(t, ti - 0.1, ti + 0.5)); });
      const h = container.clientHeight || 1080;
      block.style.top = `${h / 2 - (centreLines * lineHeight) / 2}px`;
    },
  };
}

/**
 * Typewriter into an element, with a caret that blinks when idle.
 *   type(el, 'curl … | bash', lt, { start: 0.5, cps: 30 })
 */
export function type(el, text, t, { start = 0, cps = 28, caret = true } = {}) {
  const n = Math.max(0, Math.floor((t - start) * cps));
  const done = n >= text.length;
  const blinkOn = !done || Math.floor(t * 2) % 2 === 0;
  el.innerHTML = escapeHtml(text.slice(0, n)) + (caret && t >= start && blinkOn ? '<span class="caret"></span>' : '');
  return done;
}

/** Flowing vortex lines, a lighter take on the website's hero background. */
export function vortex(container, { count = 26, color = 'rgba(156,219,179,.22)', width, height } = {}) {
  const w = width || container.clientWidth || 1920;
  const h = height || container.clientHeight || 1080;
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
  const paths = Array.from({ length: count }, (_, i) => {
    const p = document.createElementNS(SVG, 'path');
    p.setAttribute('fill', 'none');
    p.setAttribute('stroke', color);
    p.setAttribute('stroke-width', 1.4 + rand(i) * 1.2);
    p.setAttribute('pathLength', '1');
    svg.appendChild(p);
    return p;
  });
  container.appendChild(svg);
  const cx = w / 2, cy = h / 2;
  return {
    node: svg,
    /** draw 0..1 reveals the lines; t drives the slow rotation. */
    update(t, draw = 1) {
      paths.forEach((p, i) => {
        const r0 = 90 + i * (Math.max(w, h) / count) * 0.62;
        const turn = t * 0.06 + i * 0.37;
        let d = '';
        for (let s = 0; s <= 48; s++) {
          const a = turn + (s / 48) * Math.PI * 1.6;
          const r = r0 * (1 + 0.18 * Math.sin(a * 2 + i));
          d += `${s ? 'L' : 'M'}${(cx + Math.cos(a) * r * 1.35).toFixed(1)},${(cy + Math.sin(a) * r * 0.78).toFixed(1)}`;
        }
        p.setAttribute('d', d);
        const k = brandEase(clamp(draw * 1.4 - i / count * 0.4));
        p.style.strokeDasharray = '1';
        p.style.strokeDashoffset = String(1 - k);
      });
    },
  };
}

/**
 * Blur-and-rise entrance: fades `el` in while it rises `dist` px and un-blurs.
 *   rise(el, lt, 0.2)            // starts at 0.2 s, 0.55 s long
 */
export function rise(el, t, start, dur = 0.55, dist = 26, blur = 10) {
  const k = brandEase(P(t, start, start + dur));
  css(el, { opacity: k, transform: `translateY(${(1 - k) * dist}px)`, filter: k < 1 ? `blur(${(1 - k) * blur}px)` : 'none' });
}

/** Blur-out exit for a whole scene or element; call only once t >= start. */
export function leave(el, t, start, dur = 0.4) {
  const k = easeIn(P(t, start, start + dur));
  css(el, { opacity: 1 - k, filter: k > 0 ? `blur(${k * 12}px)` : 'none' });
}

/**
 * Scripted terminal output. script = [[time, html, typedCommand?], ...] in the
 * same clock as `t`; lines with a command type it at `cps`. A blinking caret
 * follows the last line, solid while typing or before `caretSolidUntil`.
 *   terminal($('#term'), SCRIPT, lt, { cps: 80, caretSolidUntil: 1.75 })
 */
export function terminal(el, script, t, { cps = 60, caretSolidUntil = 0, caretColor } = {}) {
  const out = [];
  for (const [at, html, cmd] of script) {
    if (t < at) break;
    if (cmd) out.push(`${html}${escapeHtml(cmd.slice(0, Math.min(cmd.length, Math.floor((t - at) * cps))))}`);
    else out.push(html || '&nbsp;');
  }
  const style = caretColor ? ` style="background:${caretColor}"` : '';
  const caret = Math.floor(t * 2.5) % 2 === 0 || t < caretSolidUntil ? `<span class="caret"${style}></span>` : '';
  el.innerHTML = out.map((l, i) => `<div>${l}${i === out.length - 1 ? caret : ''}</div>`).join('');
}

/**
 * Point inside `el` in stage pixels, from layout offsets (ignores transforms,
 * so it is the settled position). fx/fy pick the spot, 0..1 across the box.
 * Use it to aim a cursor or callout at a real element instead of guessing.
 */
export function stagePoint(el, fx = 0.5, fy = 0.5) {
  let x = el.offsetWidth * fx, y = el.offsetHeight * fy;
  while (el && el.id !== 'stage') { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
  return { x, y };
}

/**
 * Two families of parallel lines crossing in an X, like the launch reel's end
 * card. Returns update(k) where k 0..1 draws the lines in from the centre out.
 */
export function lineBundles(svg, { count = 26, gap = 11, slope = 0.62, cx = 960, cy = 470, spread = 80, alpha = [0.22, 0.4],
  colors = ['160,225,185', '120,210,160'] } = {}) {
  const lines = [];
  [[-slope, 0], [slope, 1]].forEach(([m, fam]) => {
    for (let i = 0; i < count; i++) {
      const mid = count / 2, off = (i - mid) * gap;
      const x = cx + (fam ? -spread : spread), y = cy + off;
      const x0 = x - 1100, x1 = x + 1100;
      const p = document.createElementNS(SVG, 'path');
      p.setAttribute('d', `M${x0},${y + m * (x0 - x)} L${x1},${y + m * (x1 - x)}`);
      p.setAttribute('stroke', `rgba(${colors[fam]},${alpha[0] + alpha[1] * (1 - Math.abs(i - mid) / mid)})`);
      p.setAttribute('stroke-width', '1.4');
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke-dasharray', '1');
      svg.appendChild(p);
      lines.push({ p, d: Math.abs(i - mid), fam });
    }
  });
  return {
    /** t: seconds since the draw started. */
    update(t) {
      for (const { p, d, fam } of lines) {
        const k = brandEase(P(t, 0.02 + (fam ? 0.08 : 0) + d * 0.012, 1.3 + d * 0.012));
        p.style.strokeDashoffset = String(fam ? -(1 - k) : 1 - k);
      }
    },
  };
}

/**
 * Number counter: formats `from`→`to` over [start, end] with an ease, e.g. 0 → 10,000.
 *   counter(el, lt, 0.5, 1.7, 0, 10000)
 */
export function counter(el, t, start, end, from, to, { ease = easeInOut, locale = 'en-US', suffix = '' } = {}) {
  const v = Math.round(L(from, to, ease(P(t, start, end))));
  el.textContent = v.toLocaleString(locale) + suffix;
  return v;
}

/**
 * Rolling word: a slot-machine roll between words in a fixed-height line (e.g. inside a pill).
 * Build once with rollWord(el, words); call .update(t, times) where times[i] is when word i lands.
 */
export function rollWord(el, words, { lineHeight = 1.2 } = {}) {
  el.style.cssText += `;display:inline-block;overflow:hidden;height:${lineHeight}em;vertical-align:bottom`;
  const track = document.createElement('span');
  track.style.cssText = 'display:block;will-change:transform';
  track.innerHTML = words.map((w) => `<span style="display:block;width:max-content;height:${lineHeight}em;line-height:${lineHeight}em;white-space:nowrap">${w}</span>`).join('');
  el.appendChild(track);
  return {
    update(t, times, dur = 0.45) {
      let pos = 0;
      times.forEach((at, i) => { if (i > 0) pos += brandEase(P(t, at - dur, at)); });
      track.style.transform = `translateY(${-pos * lineHeight}em)`;
      // widen/narrow to the incoming word
      const i = Math.min(words.length - 1, Math.floor(pos)), k = pos - i;
      const w0 = track.children[i].scrollWidth, w1 = track.children[Math.min(words.length - 1, i + 1)].scrollWidth;
      el.style.width = `${L(w0, w1, k)}px`;
    },
  };
}

/**
 * Zoom-through transition: scale an element up around a point while it blurs and fades,
 * as if the camera flies through it into the next scene.
 */
export function zoomThrough(el, t, start, dur = 0.45, { origin = '50% 50%', scale = 7, blur = 18 } = {}) {
  const k = easeIn(P(t, start, start + dur));
  css(el, { transformOrigin: origin, transform: `scale(${L(1, scale, k)})`, filter: k > 0 ? `blur(${k * blur}px)` : 'none', opacity: 1 - P(t, start + dur * 0.5, start + dur) });
}

/** Mouse cursor (SVG arrow). Position it with css(el, { transform: `translate(x, y)` }). */
export function cursor(host) {
  const el = document.createElementNS(SVG, 'svg');
  el.setAttribute('viewBox', '0 0 24 24');
  el.style.cssText = 'position:absolute;left:0;top:0;width:36px;height:36px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35));z-index:5';
  el.innerHTML = '<path d="M4 2l15 11.5-6.6.9 3.9 7.6-2.9 1.4-3.8-7.7L4 20z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/>';
  host.appendChild(el);
  return el;
}

/** Helper for setting several inline styles at once. */
export const css = (el, styles) => Object.assign(el.style, styles);

const escapeHtml = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
