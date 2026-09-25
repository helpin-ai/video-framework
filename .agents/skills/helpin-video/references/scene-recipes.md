# Scene recipes and API

`videos/example/index.html` and `videos/launch-ending/index.html` are working
examples of everything below.

## Skeleton

```html
<link rel="stylesheet" href="../../lib/brand.css">
<div id="stage">
  <section class="scene" id="hook">…</section>
</div>
<script type="module">
import { defineVideo } from '../../lib/runtime.js';
import { P, L, keys, brandEase, expoOut, stagger } from '../../lib/motion.js';
import { rise, leave, css } from '../../lib/components.js';
const $ = (s) => document.querySelector(s);

defineVideo({
  width: 1920, height: 1080, fps: 30, bpm: 120,   // ?size=1080x1920 overrides at render time
  scenes: [
    { id: 'hook', start: 0, end: 4, render: ({ lt, dur }) => {
      rise($('#hook h1'), lt, 0.2);
      if (lt > dur - 0.4) leave($('#hook'), lt, dur - 0.4); else css($('#hook'), { opacity: 1, filter: 'none' });
    } },
  ],
  render: ({ t }) => { /* global layers: background drift, fades to black */ },
});
</script>
```

`render` context: `t` global seconds, `lt` seconds into the scene, `p` 0..1 through
the scene, `dur`. To render part of a longer reel, define `const A = (abs) => abs - OFFSET`
and write scene bounds as `A(34.6)`, as `launch-ending` does.

## Timing helpers (`lib/motion.js`)

| Helper | Use |
|--------|-----|
| `P(t, a, b)` | 0..1 progress through [a, b], clamped |
| `L(a, b, k)` | lerp |
| `keys(t, [[t0, v0], [t1, v1, ease], …])` | keyframes; values may be arrays (e.g. `[x, y, w, h]`) |
| `envelope(t, a, b, in, out)` | fade in then out |
| `stagger(start, i, gap)` | start time of item i |
| `brandEase` | the site's cubic-bezier(.16, 1, .3, 1); use it for entrances |
| `expoOut`, `easeInOut`, `easeIn`, `backOut`, `spring` | other curves |
| `rand(seed)` | deterministic 0..1 |

## Components (`lib/components.js`)

| Component | Use |
|-----------|-----|
| `rise(el, t, start, dur?, dist?, blur?)` / `leave(el, t, start, dur?)` | the reel's blur-rise entrance and blur-out exit |
| `kineticLines(container, lines, { at, lineHeight })` | lines revealed one by one, with the camera keeping the stack centred |
| `terminal(el, [[t, html, cmd?]…], t, { cps, caretSolidUntil })` | scripted terminal; lines with `cmd` type themselves |
| `type(el, text, t, { start, cps })` | typewriter with caret |
| `helpinSymbol({ size, spread })` → `.assemble(k)` | the 8-piece symbol flying together; `assemble(1)` for a static logo |
| `vortex(container)` → `.update(t, draw)` | the website's flowing vortex lines |
| `lineBundles(svg, opts)` → `.update(tSinceStart)` | end-card X of parallel line bundles |
| `stagePoint(el, fx, fy)` | settled stage coordinates of an element, for cursors and callouts |

## Patterns that worked

- **Headline + UI card** (Ask Agent, Close the loop): left column at x≈130: a mono eyebrow at 20 px
  with `letter-spacing: .24em`, an 84–118 px headline at `-0.045em` with the second clause in `.sage`,
  and a 28 px sub at 66 % white. On the right, a white card, 960 px wide, radius 32, with a big soft shadow,
  entering with `perspective() translateX() rotateY()` on `expoOut`.
- **UI beat inside a card**: reveal rows 0.4–0.5 s apart, so each gets a sound cue. Reveal text word by
  word (`i` per word, 0.03 s stagger). State changes (Open → Resolved, Send → Sent)
  crossfade two stacked spans.
- **Cursor click**: glide on `expoOut` to `stagePoint(button)`, press with a 0.9–0.95 scale for 0.1 s,
  then change the state 0.1 s later. Put a click SFX at the press and a result SFX at the change.
- **Terminal**: fast typing at 60–80 cps, then output lines 0.12 s apart, ending on a green
  "→ Open http://localhost:8085". Keep commands to what the README documents.
- **End card**: symbol + wordmark (≈200 px), one line of copy, one CTA pill, then fade to black
  in the last 0.9 s. Match the background to the scene before it.
- **Transitions**: blur-out (0.35–0.4 s) into blur-rise. For a hard cut on a music hit, change the scene
  exactly on the beat and add a short glow (`#end-glow`).

## Vertical (9:16)

Render with `--size 1080x1920`. `data-orientation="portrait"` is set on `<html>`; add
`[data-orientation='portrait'] …` overrides to stack the text above the card or terminal, and
shrink the headlines (the example video shows this). Check with `--stills` at the new size.

## Live website previews (`lib/site.js`)

The helpin.ai website has animated React previews of the app (Ask Agent, the support
workspace, the coding agent, approvals, follow-ups, CRM, meetings, knowledge). Use them
instead of rebuilding UI: they're always on-brand and on-message, and they use the site's
consistent demo story (Maya Chen at Northstar, 10,000 of 18,400 contacts, EXP-142, Forge, Lens, Sam Rivera).

How it works:
1. `bin/server.mjs` proxies every non-framework path to `HV_SITE` (default `https://helpin.ai`)
   and injects `lib/site-clock.js` into HTML pages. Responses are cached in `out/site-cache/`,
   so renders are reproducible. `HV_SITE_REFRESH=1` refetches after the site changes.
2. `site-clock.js` replaces timers, `Date`, `performance.now` and `requestAnimationFrame` with a
   virtual clock. It also pauses every CSS animation and transition and drives it from that clock.
3. `siteView`/`siteWindow` embed the page in a same-origin iframe, scroll the focus element into view,
   wait for React to hydrate, then step the clock one frame at a time, letting React flush between
   steps. The output is frame-exact and byte-identical run to run.

```js
import { siteWindow, lerpRect } from '../../lib/site.js';
import { waitFor } from '../../lib/runtime.js';

const win = siteWindow($('#scene'), { path: '/products/ai-agents', focus: '#agent-coding .awa-coding', hide: ['canvas'], dark: true });
waitFor(win.view.ready);
// in the scene render:
win.place({ x: 990, y: 80, w: 748, h: 920 });          // size the window to the element's aspect
win.camera(1.35, [0.5, 0.42]);                            // zoom around a point of the focus
win.camera(1, [0.5, 0.5], '.swi-agent');                  // or frame a child element
return win.view.update(lt * 0.8);                          // preview's own time; speed ≠ 1 is fine
```

Rules:
- **Return the promise** from `update()` so the frame waits for the page to settle.
- **`hide: ['canvas']`** removes the site's vortex background, which runs in a web worker on real time
  and would break determinism.
- **Find timings first.** Render a probe with `--stills` every 1–1.5 s (see `videos/site-probe`)
  and note when each step appears. Then map it: `update(offset + lt * speed)`.
- **Measure element sizes** before choosing window boxes, and match the window aspect to the element.
  Known sizes at a 1440 px viewport: `.awa-coding` is 606×745, and the follow-up art is 356×305.
- **Scrubbing backwards in preview reloads the iframe** and fast-forwards; renders only move forward.
- **Useful focus selectors:**
  - `/products/customer-support`:
    - `.support-connected-preview .support-workspace`: Ask Agent in the inbox. The panel is `.swi-agent`; the cycle is 21 s, and "Sent to Sam" arrives at about 14 s.
    - `#support-workflow article:nth-child(1|2|3) .support-workflow-art`: answer, hand off, follow through. Each runs about 4 s.
  - `/products/ai-agents`:
    - `#agent-coding .awa-coding`: the coding agent. Diff at 0.6 s, test at 2 s, reviewer at 2.5 s, PR at 3 s.
    - `#agent-controls .awa-approval`: the approval card. Approve pressed at 2.7 s.
    - `.awa-context`, `.awa-coordination`, `.awa-tools`: the capability cards.
- **Claims:** a preview's text is website copy, but check the page's footnotes. For example, coding agents
  need a connected GitHub or GitLab repository and aren't in the Community 0.1 self-hosted release, so the video
  carries that note.
- **Clamp, don't skip, preview updates.** Keep calling `update()` with a time clamped at the station's end rather
  than stopping updates after the station. Otherwise a range render (`--from`) that starts later shows the
  preview's initial, empty state (for example, in a pull-back map).
- **Live UI must be pixel-still while the camera holds.** Don't pulse, float, slowly push in on, or scale a window
  showing product UI, even by 1 %. Sub-pixel scale or position changes redraw the text at a new offset every frame,
  and it reads as jitter (the user noticed it on "Ticket limbo"). Move UI only in deliberate camera moves
  and transitions, snap world translation to whole pixels at zoom 1, and put the energy in type, flashes, whips
  and music. To check, measure frame-to-frame shift in the window region (phase correlation). A hold should be (0,0).

## Generated UI screens (crisp, on the fly)

When the story needs a screen the website previews don't have (a sign-in, a settings page, the exact dialog an
article documents), build it as HTML in the product's style (OrbitDesk demo data, Instrument Sans, #0F7A50
primary, 12–20 px radii) at 1440×900 and scale it with `transform`. Unlike blown-up screenshot crops, it stays
sharp at any size. Build it once as an HTML string (`appHTML(state)` in `videos/docs-rot`) and reuse the same markup
for the live "browser" (typing, clicks, state changes), the captured screenshot, and the image dropped into the
article, so every appearance matches. Keep its contents to real product behaviour.

## One screen at a time

`screen(el, t, tin, tout)` in `videos/docs-rot`: each screen enters from the right and exits left, blurred only while
moving and completely still once settled. Pair every screen with a word slam that shrinks to the top-left title.
Keep subtitles to one line that ends before the screen's content (about 30 characters when a centred page starts at x = 580).
