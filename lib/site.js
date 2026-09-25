// Real Helpin website previews inside a video, frame-exact.
//
//   const inbox = siteView($('#shot'), { path: '/products/ai-agents', focus: '#agent-coding .awa-window' });
//   waitFor(inbox.ready);
//   ... scene render: return inbox.update(lt - 0.2);   // seconds of the preview's own clock
//
// The page is proxied by bin/server.mjs (same origin, clock injected by lib/site-clock.js).
// update(t) steps the page's virtual clock one video frame at a time up to t, letting React
// flush between steps, so CSS transitions and timers land exactly where they would in a
// browser. Going backwards reloads the page and fast-forwards (preview scrubbing only).

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function siteView(container, { path, focus, width = 1440, height = 900, offsetY = 96, fps = 30, hide = [] } = {}) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('scrolling', 'no');
  iframe.style.cssText = `position:absolute;left:0;top:0;width:${width}px;height:${height}px;border:0;background:transparent;pointer-events:none`;
  container.appendChild(iframe);
  let last = 0;
  let win = null;
  let queue = Promise.resolve();

  async function load() {
    const loaded = new Promise((r) => { iframe.onload = r; });
    if (iframe.src) iframe.contentWindow.location.reload(); else iframe.src = path;
    await loaded;
    win = iframe.contentWindow;
    const doc = win.document;
    let el = null;
    for (let i = 0; i < 400 && !(el = doc.querySelector(focus)); i++) await sleep(25);
    if (!el) throw new Error(`siteView: ${focus} not found on ${path}`);
    // Wait for React to hydrate the focus element, so its timers start from virtual time 0.
    const hydrated = () => [el, ...el.querySelectorAll('*')].some((n) => Object.keys(n).some((k) => k.startsWith('__reactFiber')));
    for (let i = 0; i < 400 && !hydrated(); i++) await sleep(25);
    if (hide.length) {
      const s = doc.createElement('style');
      s.textContent = `${hide.join(',')}{visibility:hidden!important}`;
      doc.head.appendChild(s);
    }
    const top = el.getBoundingClientRect().top + win.scrollY;
    win.scrollTo(0, Math.max(0, top - offsetY));
    await sleep(400); // IntersectionObserver + effects, still at virtual time 0
    await win.__hvSite.settle(5);
    last = 0;
  }

  const ready = load();

  async function step(t) {
    await ready;
    const target = Math.max(0, t * 1000);
    if (target < last - 0.5) await load();
    const dt = 1000 / fps;
    while (last + dt < target - 0.001) {
      last += dt;
      win.__hvSite.advance(last);
      await win.__hvSite.settle();
    }
    last = target;
    win.__hvSite.advance(last);
    await win.__hvSite.settle();
  }

  return {
    iframe,
    ready,
    /** Advance the preview to its own time t (seconds). Returns a promise; return it from render(). */
    update(t) {
      queue = queue.then(() => step(t));
      return queue;
    },
    /** Rect of an element inside the page, in iframe viewport px (after the focus scroll). `index` picks the nth match. */
    rect(selector = focus, index = 0) {
      const r = win?.document.querySelectorAll(selector)[index]?.getBoundingClientRect();
      return r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null;
    },
  };
}

/**
 * Camera: scale and move `el` (usually the iframe's wrapper) so that `rect` (in el's own px)
 * fills `box` (stage px), then zoom around the box centre by `zoom`.
 */
export function frameRect(el, rect, box, zoom = 1) {
  const s = Math.min(box.w / rect.w, box.h / rect.h) * zoom;
  const x = box.x + box.w / 2 - (rect.x + rect.w / 2) * s;
  const y = box.y + box.h / 2 - (rect.y + rect.h / 2) * s;
  el.style.transformOrigin = '0 0';
  el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
}

/**
 * A website preview in a floating window: rounded clip + shadow, with a camera.
 *   const w = siteWindow($('#win'), { path, focus, radius: 18 });
 *   render: w.place({ x, y, w, h }); w.camera(zoom, [fx, fy]); return w.view.update(pt);
 * camera(zoom, [fx, fy]) zooms into the focus element around a point given as 0..1 of its box,
 * or pass a selector as `target` to frame a child element instead of the whole focus.
 */
export function siteWindow(host, { radius = 18, dark = false, ...viewOpts } = {}) {
  const win = document.createElement('div');
  win.className = 'site-window' + (dark ? ' dark' : '');
  win.style.cssText = `position:absolute;overflow:hidden;border-radius:${radius}px;` +
    `box-shadow:0 50px 140px rgba(0,0,0,.55),0 0 0 1px rgba(184,221,187,.16);background:${dark ? '#0B0D0C' : '#fff'}`;
  const cam = document.createElement('div');
  cam.style.cssText = 'position:absolute;left:0;top:0;width:' + (viewOpts.width || 1440) + 'px;height:' + (viewOpts.height || 900) + 'px';
  win.appendChild(cam);
  host.appendChild(win);
  const view = siteView(cam, viewOpts);
  // Spotlight: dims everything in the window except one rect (drawn above the page).
  const spot = document.createElement('div');
  spot.style.cssText = `position:absolute;left:0;top:0;width:0;height:0;border-radius:12px;pointer-events:none;opacity:0;` +
    `box-shadow:0 0 0 9999px rgba(${dark ? '8,10,9' : '244,246,245'},.62);outline:2px solid #0F7A50;outline-offset:4px`;
  win.appendChild(spot);
  let box = { x: 0, y: 0, w: 960, h: 800 };
  let camT = { s: 1, x: 0, y: 0 };
  return {
    el: win,
    view,
    place(b) {
      box = b;
      Object.assign(win.style, { left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px` });
    },
    /** Frame the focus (or `target`: a selector or a rect) into the window, zoomed around point [fx, fy] of it. */
    camera(zoom = 1, [fx, fy] = [0.5, 0.5], target) {
      const r = target && typeof target === 'object' ? target : view.rect(target);
      if (!r) return;
      const s = Math.min(box.w / r.w, box.h / r.h) * zoom;
      // Keep the point (fx, fy) of the target at the same relative spot in the window.
      const px = r.x + r.w * fx, py = r.y + r.h * fy;
      camT = { s, x: box.w * fx - px * s, y: box.h * fy - py * s };
      cam.style.transformOrigin = '0 0';
      cam.style.transform = `translate(${camT.x}px, ${camT.y}px) scale(${s})`;
    },
    /** Page rect → window px under the current camera (call after camera()). */
    toWindow(r) { return r && { x: camT.x + r.x * camT.s, y: camT.y + r.y * camT.s, w: r.w * camT.s, h: r.h * camT.s }; },
    /** Page rect → stage/world px (window box + camera). */
    toOuter(r) { const w = this.toWindow(r); return w && { x: box.x + w.x, y: box.y + w.y, w: w.w, h: w.h }; },
    /** Spotlight a page rect (dim the rest) with strength 0..1; pad in window px. */
    spotlight(r, amount = 1, pad = 10) {
      const w = this.toWindow(r);
      if (!w || amount <= 0) { spot.style.opacity = '0'; return; }
      Object.assign(spot.style, { left: `${w.x - pad}px`, top: `${w.y - pad}px`, width: `${w.w + pad * 2}px`, height: `${w.h + pad * 2}px`, opacity: String(amount) });
    },
  };
}

/** Interpolate two rects (for camera moves between elements); falls back to whichever exists. */
export function lerpRect(a, b, k) {
  if (!a || !b) return a || b;
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k, h: a.h + (b.h - a.h) * k };
}
