# Motion ideas (from reference launch videos)

Three strong launch videos were studied frame by frame (two Opus 5.5 reels on X, and ClickUp 4.0's launch film,
`reference/clickup.mp4`). Keep the **brand** (logo,
Instrument Sans, the Helpin palette); give each video its **own concept**. Borrow the **motion**. Local copies of the references (gitignored): `reference/x-moritzkremb-launch.mp4`
(Notion-style, 46 s) and `reference/x-chhddavid.mp4` (AI employees, 50 s at 60 fps). To look
at them, run `npm run inspect -- reference/<file> --every 1.5`.

## Structure

- **Problem in the dark, then the product in the light.** Open on a stacked problem line (e.g.
  "Docs here. / Chats there. / Tasks everywhere.") with tool icons drifting in. It collapses
  to a dot, and the dot opens into the product world. For us: a dark forest hook, then light
  product windows.
- **A concrete number as the hook.** Numbers read instantly. We used a counter running up
  to 10,000 that stalls, turns amber, and jitters, with a ghost "18,400" behind it:
  "She needs all 18,400." Use real demo numbers from the site, never stats we can't source.
- **One idea per scene, 4–6 s each.** Pair an eyebrow and a two-clause headline on the left
  with a live product window on the right. Every scene ends by blurring out or zooming through.
- **Word-per-beat interlude near the end.** Single big words land on each beat
  ("Request. Task. Fix. Review. Reply."), then resolve into one line ("One customer history.").
- **End card:** the logo assembles, then one line, one CTA pill, and a fade. The references
  click a CTA button with a cursor; we don't show a sign-up button until the site has one to link.

## Motion techniques

| Technique | How | Where in lib |
|-----------|-----|--------------|
| Rolling word | slot-machine roll inside a pill, synced to what the UI is doing ("Ask Agent · Preparing a fix") | `rollWord` |
| Word swap in a headline | "Where teams and agents · Think / Ship together": one word rolls while the rest holds | `rollWord` inline |
| Ghost word | a huge, low-opacity word or number behind a smaller headline, scaling slightly | CSS + `rise` |
| Counter punch | a number counts up, then stalls, changes colour or jitters | `counter` |
| Zoom-through | the camera flies into an element (a number, a button, a row) to cut to the next scene | `zoomThrough` |
| Window rise with tilt | a product window rises from below with `rotateX` 14° → 0 on expoOut | `enter()` in `videos/bug-to-fix` |
| Camera glide inside UI | start wide on the whole workspace, glide onto the panel that matters, then push in slowly | `siteWindow.camera` + `lerpRect` |
| Cause and effect across windows | an agent chat and a task board side by side, where the agent's step updates the board | two `siteWindow`s |
| Status pills | Thinking… → Working → Ready for review, with a colour change on the last step | `.status` + `rollWord` |
| Cards dropping in | notifications or messages stack in with a small overshoot, one per beat | `rise` with `backOut` |
| Highlight sweep | one row in a list lights up (glow bar) to show what the agent picked | CSS on a row |
| Depth of field | a big blurred foreground chip drifts past a sharp mid-ground card | `filter: blur` by depth |
| Big word punch | a single full-bleed word ("You.", "free.") for one beat | `.word` in `#beats` |
| Cursor action | a cursor glides to a real button and presses it (0.9 scale for 0.1 s), and the state changes | `cursor` + `stagePoint` |
| Constant camera | the background never stops: a slow push-in and drift across the whole video | global `render` |

## Pacing

- The references cut every 1.5–3 s and never hold a static frame. Something is always moving,
  even if only the background.
- 60 fps looks smoother on fast type moves. We render at 30 fps by default; use `--fps 60`
  for type-heavy cuts (it takes twice as long to render).
- Sync UI events to sound: every step that appears gets a quiet ding or pop, every cut a whoosh.
  Take the times from the scene code (`scene start + (previewTime - offset) / speed`).

## Making product UI move (learned on "The thread")

Live previews that play inside a static frame still read as screenshots. Give the UI itself motion:

- **Shots inside the window.** List camera shots per station (`shoot()` in `videos/bug-to-fix-thread`):
  start wide, then a detail band around each step as it lands, then back out. Fit each shot to the window's
  aspect and clamp it inside the element (`fitAspect`), or detail shots leave empty page above or below.
- **Spotlight.** `siteWindow.spotlight(rect)` dims everything except the current row (light or dark tint),
  lerping between rows with the camera.
- **Artifacts travel between scenes.** Lift a piece of UI (a chip, a PR, a status pill) out of one window, let it
  ride the scene's connecting motion (the thread's pen), and dock it into the matching element of the next
  window (`carry()`). It can change state on the way ("Pull request" becomes "Reviewed by Sam · released").
  Map page elements to stage coordinates with `siteWindow.toOuter(rect)`.
- **Depth.** Windows lean into camera pans (rotateY from camera velocity, capped at ±10°), the background moves
  at about 55% of the camera (parallax), and cards float ±4 px.
- **Type things in.** Customer messages type themselves in (`type()`) rather than appearing whole.
- **Watch preview loops.** Website previews replay on a cycle (`useBentoPlayback`, often 9.5–10 s). Clamp their time
  once the key moment has landed, or they go blank mid-shot.

## From the ClickUp 4.0 launch (story and energy)

- **Name the villain.** "Work Sprawl is killing us." A coined, quotable name for the pain beats a description.
  Ours: **"Ticket limbo."** Show it as a mess (tangled scribbles, stamps: ESCALATED / WAITING… / STILL WAITING…),
  then strike it through.
- **One line as the storytelling device.** Their line draws the chaos, becomes loops ("Context is lost"), and
  crosses out words. Ours: the tangle **pulls taut into the thread** on the drop (point-by-point lerp from loop
  positions to a straight line, staggered left to right).
- **Mood shift** from murky (warm grey, the problem) to clean (the product), timed exactly on the drop, with a white flash.
- **One-word titles that slam in on the beat** (scale 1.45→1 with backOut, a short shake, a flash), then shrink to a
  corner title with a one-line subtitle. This gives the station structure at speed: HEARD. / FIX READY. / APPROVED. / TOLD.
- **Rolling word list for the payoff:** "Nothing lost: the history / the reason / the review / the reply", one per beat.
- **A tagline with a quote flip**, using the product's own words: From "it's broken" to "it's live."
- **Energy settings:** 128 BPM, whip-pans of 0.45 s on expoInOut with world blur ∝ camera speed, speed streaks, camera
  shake on stamps and slams, and shots inside windows every 0.5–1.5 s. **Don't** pulse or float windows showing live UI:
  it caused visible jitter and was removed.
