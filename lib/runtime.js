// Video runtime. A video is a list of scenes on one clock; the whole frame is
// render(t). The same page is the live preview (with transport controls) and,
// with ?render=1, the frame-exact target that bin/render.mjs steps through.

import { P } from './motion.js';

const params = new URLSearchParams(location.search);
const RENDER = params.has('render');
const pending = [];

/** Delay frame 0 until `promise` settles (e.g. a siteView loading). Call before defineVideo. */
export function waitFor(promise) { pending.push(promise); }

/**
 * defineVideo({
 *   width, height, fps, bpm?, audio?,
 *   scenes: [{ id, start, end, el?, render(ctx) }],
 *   render?(ctx),            // global layer, runs every frame after scenes
 * })
 *
 * Each scene's render receives ctx = { t, lt, p, dur, scene, video }:
 *   t   global time (s)     lt  time since scene start
 *   p   0..1 through scene  dur scene length
 * A scene's element (default #<id>) is hidden outside [start, end).
 * Set `hold: [before, after]` to keep it visible a little outside that window
 * for overlapping transitions.
 */
export function defineVideo(cfg) {
  const size = params.get('size')?.split('x').map(Number);
  const video = {
    width: size?.[0] || cfg.width || 1920,
    height: size?.[1] || cfg.height || 1080,
    fps: cfg.fps || 30,
    bpm: cfg.bpm || null,
    audio: cfg.audio || null,
    scenes: cfg.scenes.map((s) => ({ hold: [0, 0], ...s })),
    t: 0,
  };
  video.duration = cfg.duration ?? Math.max(...video.scenes.map((s) => s.end));
  video.frames = Math.round(video.duration * video.fps);

  const stage = document.querySelector('#stage') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'stage' }));
  stage.style.width = `${video.width}px`;
  stage.style.height = `${video.height}px`;
  document.documentElement.dataset.orientation = video.width >= video.height ? 'landscape' : 'portrait';
  for (const s of video.scenes) s.node = typeof s.el === 'string' ? document.querySelector(s.el) : s.el || document.getElementById(s.id);

  // Renders are synchronous unless a scene returns a promise (e.g. siteView.update);
  // seek() waits for those before the frame is captured.
  function render(t) {
    video.t = t;
    const waits = [];
    for (const s of video.scenes) {
      const visible = t >= s.start - s.hold[0] && t < s.end + s.hold[1];
      if (s.node) s.node.style.visibility = visible ? 'visible' : 'hidden';
      if (!visible || !s.render) continue;
      const dur = s.end - s.start;
      const r = s.render({ t, lt: t - s.start, p: P(t, s.start, s.end), dur, scene: s, video });
      if (r?.then) waits.push(r);
    }
    const g = cfg.render?.({ t, p: t / video.duration, video });
    if (g?.then) waits.push(g);
    return waits.length ? Promise.all(waits) : null;
  }

  // Everything the renderer needs. seek() resolves once the frame is painted.
  const ready = Promise.all([
    document.fonts.ready,
    ...[...document.images].map((img) => img.decode().catch(() => {})),
    ...pending,
  ]);
  window.__video = {
    width: video.width, height: video.height, fps: video.fps,
    duration: video.duration, frames: video.frames, audio: video.audio,
    scenes: video.scenes.map(({ id, start, end }) => ({ id, start, end })),
    ready,
    seek: async (t) => {
      await render(t);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    },
  };

  if (RENDER) {
    document.documentElement.classList.add('rendering');
    ready.then(() => render(0));
  } else {
    ready.then(() => mountPreview(video, render));
  }
  return video;
}

function mountPreview(video, render) {
  const fit = () => {
    const bar = 64;
    const s = Math.min(innerWidth / video.width, (innerHeight - bar) / video.height);
    const stage = document.querySelector('#stage');
    stage.style.transform = `scale(${s})`;
    stage.style.left = `${(innerWidth - video.width * s) / 2}px`;
  };
  addEventListener('resize', fit);
  fit();

  const ui = document.createElement('div');
  ui.className = 'hv-transport';
  ui.innerHTML = `
    <button data-act="play" title="Space">▶</button>
    <span class="hv-time">0.00</span>
    <input type="range" min="0" max="${video.duration}" step="${1 / video.fps}" value="0">
    <span class="hv-scenes">${video.scenes.map((s, i) => `<button data-seek="${s.start}" title="${i + 1}">${s.id}</button>`).join('')}</span>`;
  document.body.appendChild(ui);
  const [btn, time, range] = [ui.querySelector('[data-act]'), ui.querySelector('.hv-time'), ui.querySelector('input')];
  const audio = video.audio ? Object.assign(new Audio(video.audio), { preload: 'auto' }) : null;

  const initial = Number(location.hash.slice(1)) || 0;
  let t = Math.min(initial, video.duration), playing = false, last = 0;
  const frame = (x) => Math.round(x * video.fps) / video.fps;
  const draw = () => {
    render(t);
    range.value = t;
    time.textContent = `${t.toFixed(2)}s · f${Math.round(t * video.fps)}`;
    btn.textContent = playing ? '❚❚' : '▶';
  };
  const seek = (x) => {
    t = Math.min(video.duration, Math.max(0, x));
    if (audio) audio.currentTime = t;
    history.replaceState(null, '', `#${t.toFixed(2)}`);
    draw();
  };
  const toggle = () => {
    playing = !playing;
    if (playing && t >= video.duration) seek(0);
    last = performance.now();
    if (audio) playing ? audio.play().catch(() => {}) : audio.pause();
    draw();
  };
  const tick = (now) => {
    if (playing) {
      t = audio && !audio.paused ? audio.currentTime : t + (now - last) / 1000;
      last = now;
      if (t >= video.duration) { t = video.duration; playing = false; audio?.pause(); }
      draw();
    }
    requestAnimationFrame(tick);
  };

  btn.onclick = toggle;
  range.oninput = () => seek(Number(range.value));
  ui.querySelector('.hv-scenes').onclick = (e) => e.target.dataset.seek && seek(Number(e.target.dataset.seek));
  addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'range') return;
    const step = e.shiftKey ? 1 : 1 / video.fps;
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); seek(frame(t) + step); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(frame(t) - step); }
    else if (e.key === 'Home') seek(0);
    else if (/^[1-9]$/.test(e.key) && video.scenes[e.key - 1]) seek(video.scenes[e.key - 1].start);
  });
  seek(t);
  requestAnimationFrame(tick);
}
