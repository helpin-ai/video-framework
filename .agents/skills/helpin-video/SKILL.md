---
name: helpin-video
description: Plan, build, review and render a Helpin launch, product or social video with this framework (HTML scenes rendered frame-exactly to MP4). Use for new videos, new scenes, copy or timing changes, vertical cuts, and storyboard work. For music and sound effects use video-sound; for changing an MP4 whose source isn't here use video-edit.
---

# Helpin video

A video is `videos/<name>/index.html`: scenes on one clock, each rendered from `t`.
**Read [references/taste.md](references/taste.md) first.** It's the user's taste profile and the approved
benchmark video ("Ticket limbo", `videos/bug-to-fix-energy`). Read `AGENTS.md` for setup and hard rules. For the API, ready-made scene patterns
and **live website previews**, see [references/scene-recipes.md](references/scene-recipes.md).
For pacing and motion techniques from strong reference launch videos, see
[references/motion-ideas.md](references/motion-ideas.md).

## Workflow

### 0. A new concept for every video

Each video needs **its own concept**: its own visual world, motion language and music. The brand stays
constant through the logo, type (Instrument Sans + JetBrains Mono), palette and voice. The treatment changes:
light or dark, background, layout system, camera language, transitions and soundtrack. Don't default to
the launch reel's forest-green look. That's one concept, not the house style. The user rejected a
pilot for feeling like "the same style with the green background" as the launch reel.

In the storyboard, name the concept in one line (e.g. "The thread: one continuous line carries Maya's
request through the product"). Show two or three concept options with a rendered style frame each,
before building. Record the music direction (genre, BPM, instruments, mood) next to it.

### 1. Brief → storyboard (before any code)

Pin down: audience and channel (X, LinkedIn, site hero, YouTube), length, aspect
(16:9 1920×1080; 9:16 1080×1920 for Shorts/Reels/TikTok), the one thing a viewer
should remember, and the call to action.

Write `videos/<name>/STORYBOARD.md` from the template: a table of scene, time, on-screen
copy, and audio cue. If the plan has open questions, show it to the user before building.

- **Story, not a feature list.** Open on a tension, pay it off, then give the call to action. The launch reel opens
  with "Someone still has to tell the customer." and pays it off with "And the customer
  hears back." Before calling a cut done, check every setup line has a payoff.
- **Timing on a beat grid** (120 BPM: 1 beat = 0.5 s, 1 bar = 2 s) so music drops in without re-timing.
  Budget about 2.5–3 s per readable headline and 4–7 s per UI demo scene.
- **Copy.** Short declaratives, with the second clause in sage. Every product claim needs a source
  (README, `helpin/website/src/app/new`, roadmap); list the sources under "Claims check". For
  voice and positioning, follow `helpin/.agents/skills/helpin-website-copy`.
- **Competitors and other companies' logos: read [references/competitors.md](references/competitors.md) first.**
  A comparison video (Helpin vs X) names the competitor in text with the compare page's monogram chip, draws its world
  in our own neutral design, and takes every fact from `compare-data.ts` with its checked date: no logo, colours or
  UI. Real logos belong only in tool-sprawl moments (many tools at once, no claims about any of them).
- **Personal and brand copy (banners, headers, bios): agree the words first.** Offer 2–4 options with a
  recommendation and render the user's pick. Don't give the user a title they didn't give ("Technical founder"
  was rejected).
- **Narrate in the second person.** Speak to the viewer: "Your customer's export stops at 10,000. They need all
  18,400." / "And your customer hears back." Keep demo names (Maya, Sam) inside the product UI, where
  they read as real data. The user asked for this.
- **Humans stay in charge in agent demos.** Agents draft, prepare and investigate; a
  named person reviews, merges and sends. Use the fictional data the site uses: Maya Chen at Northstar,
  Sam Rivera, OrbitDesk, EXP-142. **Call agents by their website names** (icons in `assets/helpin/agents/`):
  Echo (support), Atlas (planning), Scribe (coding task planner), Forge (coding), Lens (code review),
  **Quill (docs)**, Beacon (CRM) and Mira (marketing).

### 2. Build

```sh
npm run new -- <name>
npm run preview -- <name>     # Space play · ←/→ frame · Shift+←/→ 1 s · 1–9 jump to scene
```

- Make one `<section class="scene" id="…">` per storyboard row, and register it in `defineVideo({ scenes })`
  with `start`/`end` in seconds. Put per-element timing inside `render({ lt })`, where `lt` is
  seconds since the scene starts.
- Reuse `lib/` before writing new motion: `rise`/`leave` for the blur entrance and exit,
  `kineticLines`, `terminal`, `helpinSymbol`, `vortex`, `lineBundles`, `stagePoint`. If you write
  a helper you'd want again, move it into `lib/components.js`. Then prove the existing videos
  still render byte-identically: take `--stills` before, `cmp` them after.
- **Product UI: prefer the live website previews** (`siteWindow`, see scene-recipes). They're real,
  animated, on-brand, and already tell the demo story. Next best are screenshots in
  `assets/helpin/product/`, then HTML cards that mirror the app. Never invent features.
- Keep something moving in every frame: the background drifts, the camera glides, and cuts land on beats.
  See motion-ideas.md for techniques that work.
- Aim cursors and callouts with `stagePoint(el)`; don't guess coordinates.
- Keep text readable at phone size: nothing under about 22 px at 1080p, and headlines at 84–120 px.

### 3. Review (you can't watch it, so look)

```sh
npm run sheet -- <name>                               # 12-frame overview
npm run render -- <name> --stills 8.9,9.0,9.2,9.5     # around every transition
```

Read the PNGs. Check each of these:
- Every scene is readable.
- Nothing is clipped, overlapping, or off-centre.
- Transitions have no half-faded leftovers.
- The cursor or callout lands on its target.
- Copy matches the storyboard.

Fix, then re-check. Look at the frames either side of each cut, not only mid-scene.

### 4. Render and deliver

```sh
npm run render -- <name>                    # out/<name>/<name>.mp4 (≈25 fps render speed at 1080p)
npm run render -- <name> --size 1080x1920   # vertical, if the layout supports [data-orientation='portrait']
```

Then add sound with the video-sound skill. Tell the user:
- the output path;
- what you checked (sheets, stills, loudness);
- what you couldn't check (how it sounds or feels in motion);
- the `scp` command to download it.

## Gotchas

- Images must be in the HTML at load to be decoded before frame 0. If you add them dynamically, await `img.decode()` yourself.
- `defineVideo` hides a scene outside `[start, end)`. For overlapping transitions, set
  `hold: [before, after]` or fade the scene yourself inside its window.
- Don't pass a CSS `transition` or `animation` to anything; motion must come from `render(t)`.
- `render.mjs --scale 0.5` gives fast drafts. Final renders must use scale 1.
- Don't clean up with broad globs like `m*.png`: an earlier session lost a file that way. `render.mjs` only clears its own `out/<name>/stills` or `sheet` folder.
- `lib/brand.css` styles `.pill`, `.term` and `.caret` for the dark look (sage text, a sage border, a margin). On a light
  page, reset colour, border and margin in your own rule, or use other class names. Watch class specificity too: a
  later `position: relative` rule on a shared class silently beat `.abs` and shifted every centred line in
  `one-prompt`.
- Measure text for layout only after `document.fonts.load(...)` and `document.fonts.ready` (register the promise with
  `waitFor` before `defineVideo`), and while the element is laid out (`visibility: hidden` is fine;
  `display: none` measures 0).

## Stills: thumbnails, banners and sharing

Single images are pages too: one scene per option, rendered with `--stills 0.5,1.5 --scale 2` for a sharp master,
then downscaled for the upload. Offer two options with a recommendation.
- **Video thumbnails (LinkedIn, X):** 1920×1080 JPG (about 200 KB). Feeds draw a play button of about 165 px in the
  centre, so keep words and faces out of it (mark the zone on your check image). Use the film's own frames as the
  picture, rendered at 4K from its page (`npm run render -- <film> --stills 38.6 --scale 2`), so the post matches the
  video; crop the frame's own captions out. Headline on the left, big and short, with the second clause in mint
  (`videos/ph-story-thumb`, `videos/launch-thumbnail`).
- **Profile banners:** LinkedIn 1584×396 (render 3168×792), where the profile photo covers the bottom-left, about
  x 40–360, y 220–396; X 1500×500, where it covers about x 20–360, y 330–500 and mobile crops the top and bottom. Keep
  copy right of the photo and vertically central, real product UI on the right (`videos/linkedin-banner`,
  `videos/x-header`).
- **When the user asks for a link:** renders normally go by `scp`. If they want a link, publish a private Artifact
  page with the files and the `downloads` capability (artifact pages block plain download links), with "right-click,
  Save image" as the fallback.

## Generated footage (optional)

`bin/genvideo.mjs` generates live-action plates via Higgsfield (`HIGGSFIELD_API_KEY` = `id:secret`), caches them in
`out/video-cache/`, and explodes each into a 1080p JPEG sequence in `out/<name>/plates/<id>/`. Brief them in
`videos/<name>/plates.json`; run with `--dry` first to see the estimated cost, then without it. Every paid generation is
appended to `out/video-cache/ledger.json`.

- **Model and cost.** Default is Seedance 2.0 at 720p (about $0.21/s with the running promo). Pricing is metered by pixels:
  Seedance 2.5 at 720p costs about $0.32/s, and the headline "$0.144/s" is its 480p rate. Failed submits aren't charged.
- **Same person across shots.** Give a plate `refs: ["assets/helpin/avatars/maya.webp"]` and it goes to
  `seedance-2.0/reference-to-video` with that face, so the footage matches the UI avatar (Maya, Sam in `videos/launch-film`).
  Without refs, describe the person identically in every prompt (hair, clothing): that held one woman across five hours
  of `videos/film-one-day`.
- **Showing a frame.** `plateFrame(PLATES, name, id, t)` and `showFrame(img, src)` in `lib/film.js`; return the decode
  promises from `render` so the renderer waits for the pixels.
- **How to use it.** People carry the story; motion graphics carry the product. Patterns that work:
  full-frame footage of the person under floating UI, cut on their word (launch film Act 1); footage that opens an
  hour full frame and then docks into a portrait frame while the cards play (One day); a live portrait card in place
  of an avatar (Sam); a dimmed plate under the tagline. Frame faces clear of the UI with a zoom/offset per shot.
  Never for product UI, and never text on a screen.
- **People talking to camera (lip-sync).** `bin/cast.mjs videos/<name>/cast.json` builds a talking-head cast:
  a Soul portrait, the line in an ElevenLabs voice (eleven_v3, `[sighs]`-style tags work), a Seedance 2.0 clip that
  animates the portrait speaking with the line as its audio reference, then ElevenLabs speech-to-speech into the chosen
  voice (the clip's own speech keeps the lip timing; word starts move by under 0.02 s) and a transcript for captions.
  About $1.25 per person for a 5 s line. Keep lines under about 4.4 s so a 5 s clip covers them. Dead ends (Sep 26):
  Higgsfield `speak` fails on every input; ElevenLabs avatars (`/v1/flows/video`, Creatify Aurora, Veo 3.1) need a
  Pro plan. The characters are fictional: label them by role (no names), never present them as the team or customers,
  and let them state problems, never product claims or testimonials. No on-screen AI tag (the user removed it);
  disclosure goes in the platform's AI-content label when posting (`videos/launch-voices`).
- **Check every plate for brand marks.** Prompts say "no text, no logos", and the model still adds them: an Apple logo
  on a laptop lid, an ASUS badge on a monitor, a laptop maker's badge. Crop the device areas of a few frames per plate
  at full size, then either play only the clean range, crop it out with the framing zoom, or regenerate without the
  device ("a paper notebook, no laptop").
  Faint embossed logos only show at full size with the contrast boosted (`eq=contrast=2.2`): the sunrise plate's HP
  logo was missed at first. When the surface around a logo is plain, a tracked soft blur (`backdrop-filter` in a
  feathered circle, keyed to the plate frame) removes it without regenerating (`videos/film-one-day`, `#lidfix`).

