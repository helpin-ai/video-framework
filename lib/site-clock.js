// Injected (by bin/server.mjs) as the first script of every proxied website page.
// Replaces the page's clock with a virtual one so a parent video page can step it
// frame by frame: timers, Date, performance.now, requestAnimationFrame, and every
// CSS animation/transition (via the Web Animations API) follow virtual time.
// Classic script, no modules: it must run before the site's own bundles.
(() => {
  if (window.__hvSite) return;
  const real = {
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    Date: window.Date,
  };
  const EPOCH = Date.UTC(2026, 8, 24, 10, 0, 0); // fixed wall clock for determinism
  let now = 0; // virtual ms since page start
  let seq = 1;
  const timers = new Map();
  let rafQueue = [];

  const schedule = (fn, delay, args, interval) => {
    const id = seq++;
    const d = Math.max(0, Number(delay) || 0);
    timers.set(id, { id, at: now + d, fn, args, interval: interval ? Math.max(1, d) : 0 });
    return id;
  };
  window.setTimeout = (fn, delay, ...args) => schedule(fn, delay, args, false);
  window.setInterval = (fn, delay, ...args) => schedule(fn, delay, args, true);
  window.clearTimeout = window.clearInterval = (id) => { timers.delete(id); };
  window.requestAnimationFrame = (fn) => { const id = seq++; rafQueue.push({ id, fn }); return id; };
  window.cancelAnimationFrame = (id) => { rafQueue = rafQueue.filter((r) => r.id !== id); };
  window.requestIdleCallback = (fn) => schedule(() => fn({ didTimeout: false, timeRemaining: () => 50 }), 1, [], false);
  window.cancelIdleCallback = window.clearTimeout;
  performance.now = () => now;

  class VDate extends real.Date {
    constructor(...a) { if (a.length) super(...a); else super(EPOCH + now); }
    static now() { return EPOCH + now; }
  }
  window.Date = VDate;

  const call = (fn, args) => { try { typeof fn === 'function' ? fn(...args) : 0; } catch (e) { console.error(e); } };

  // Animations: each one is paused when first seen and then driven from virtual time.
  const seen = new WeakMap();
  function syncAnimations() {
    for (const a of document.getAnimations()) {
      if (!seen.has(a)) { seen.set(a, now); a.pause(); }
      a.currentTime = now - seen.get(a);
    }
  }

  window.__hvSite = {
    get now() { return now; },
    /** Run everything due up to virtual time `to` (ms). */
    advance(to) {
      for (;;) {
        let next = null;
        for (const t of timers.values()) if (t.at <= to && (!next || t.at < next.at || (t.at === next.at && t.id < next.id))) next = t;
        if (!next) break;
        now = Math.max(now, next.at);
        if (next.interval) next.at += next.interval; else timers.delete(next.id);
        call(next.fn, next.args || []);
      }
      now = Math.max(now, to);
      const q = rafQueue; rafQueue = [];
      for (const r of q) call(r.fn, [now]);
    },
    /** Let the framework (React) flush on real macrotasks, then pin animations. */
    async settle(passes = 3) {
      for (let i = 0; i < passes; i++) await new Promise((r) => real.setTimeout(r, 0));
      void document.documentElement.offsetHeight; // style recalc creates pending transitions
      syncAnimations();
    },
    syncAnimations,
  };

  // Keep the page quiet in a video: no smooth scrolling, no caret blink, no scrollbars.
  const style = document.createElement('style');
  style.textContent = 'html{scroll-behavior:auto!important} *{caret-color:transparent!important} ::-webkit-scrollbar{display:none} html{scrollbar-width:none}';
  (document.head || document.documentElement).appendChild(style);
})();
