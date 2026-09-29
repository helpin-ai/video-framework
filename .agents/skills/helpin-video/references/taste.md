# Taste profile: what this user approves

Learned over the launch reel and the use-case pilot (Sept 2026). Read this before proposing a
concept, and check your cut against it before delivering.

## The benchmark

**`videos/bug-to-fix-energy`, "Ticket limbo"** (30 s, 128 BPM) was approved: "The video was well, good job."
Match its energy and craft unless the brief says otherwise:
- **A named villain as the hook:** "Ticket limbo." Show the mess (tangle, stamps, a frozen number), then strike it through.
- **A hard turn on the drop:** "Not anymore." A flash, a mood shift from murky to clean, and the mess becoming the solution (the tangle pulls taut into the thread).
- **One-word station titles slammed in on the beat** (HEARD. / FIX READY. / APPROVED. / TOLD.), shrinking to a corner title with a one-line subtitle.
- **Real product UI that moves:** live helpin.ai previews, a camera shot on every step, a spotlight, and chips riding between scenes.
- **A payoff with a number completing** (18,400 of 18,400), a pull-back over the whole journey, and a rolling list ("Nothing lost: …").
- **A quotable tagline that flips a quote:** From "it's broken" to "it's live."

The launch reel's **"ride out" soundtrack** was also approved (`videos/launch/audio-rideout.json`).

## What they want

- **Energy:** 120–130 BPM, cuts every 1.5–4 s, whip-pans, slams, something moving in every frame. "More energetic" was feedback on a 104 BPM, 32 s cut that was otherwise liked.
- **A catchy story:** hook, villain, drop, stations, payoff, tagline. It must be quotable, not a feature tour.
- **A new concept and new music for every video.** Never reuse another video's look or score. The same green background across two videos was rejected: "no point of using the same one".
- **Motion inside the UI, not screenshots in frames:** "the screenshots we added, they should be motion instead".
- **Stay in the brand theme:** forest `#081B16`, sage, mint and white product cards ("Stay in our brand theme").
  Make each video unique through its concept, motion device and music, not through off-brand palettes
  (the charcoal and airport-board looks in the docs concepts drifted from the brand).
- **An opener built on motion design, not a title card.** They disliked the docs openers that started on
  pure big type ("Doc rot.") or a busy intro board plus "Doc drift." / "Meet Quill." They want the first
  seconds to be a designed, relatable moment where UI does something. `videos/docs-caught-up` opens with
  "You renamed a button. / Moved a setting. / Added a step." as the camera whips along a week timeline and each
  UI change plays inline. Introduce agents through a verb ("Quill checks."), not a "Meet X" card.
- **Borrowed copy structure is fine, borrowed lines aren't.** They pointed at Ferndesk's page ("Sound familiar?",
  "last updated 3 months ago", "Nothing publishes without you"). Keep the structure and rewrite the lines in
  Helpin's words, each backed by our site.
- **Second-person narration:** "your customer", "your team". Demo names (Maya, Sam) stay inside the product UI.
- **Music that carries to the end:** no breakdown late in the edit, and no big cinematic hit on the end card (both were removed on request).
- **Studied references:** they send reference videos (X reels, ClickUp 4.0's launch). Download and study them frame by frame, borrow the motion and story devices, and keep Helpin's brand.
- **Options before a big direction change:** two or three concepts as rendered style frames, with a recommendation. They usually answer "go ahead" or pick one.

## Neat and subtle beats loud (Sept 24 feedback)

After five use-case videos built with slams, flashes and shakes, they said the videos had drifted from the launch reel,
which was "very neat and subtle" with "very good animations". It's a reference for ideas, not a template
("it does not have to be exact the same style"). Keep each video's own concept and device, and apply these:
- **Type:** 70–110 px semibold (not 200 px bold), off-white `#E8EEEA` with a sage second clause; a mono eyebrow with wide tracking; a short grey lede.
- **Motion:** words fade up with a soft blur (`lib/kit.js` `rise`); screens cross-dissolve (`push`, `bigScreen`); lines stack and earlier lines dim (`stack`).
  No white flashes, no shakes, no big overshoots.
- **Layout:** copy in a left column with the product UI on the right (`sideCopy` + `rig`) works well for walkthroughs. Centred type screens are for one-line beats.
- **Background:** quiet forest gradient with faint line bundles (`bundles`), not a dot grid.
- **Sound:** keep the energetic music, but swap slams and impacts for soft whooshes, ticks and chimes. Fill pre-drop dips with a gentle swell, not a riser hit.
- Energy comes from pacing and music, not from hits.

## Narrated films (Sept 25)

The 66 s narrated launch film `videos/launch-film` ("The story") was approved ("Looks good"). What it does:
full motion design with no screenshots and little typing; a voiceover that drives the timing (`bin/vo.mjs` → `vo.json`);
music ducked under the voice; one continuous camera move through the product flow; a strip that collects the story's beats.
After it, they asked for more films with **different colours** and new stories. Colour beyond the forest palette is
welcome when the concept earns it: `film-one-day` follows the sky through a workday, and `film-crew` gives each agent
its own colour field. Keep the neat motion rules either way.

**Generated footage (Sept 25).** They suggested mixing Seedance footage with the motion graphics. When two plates in
One day felt like too little, the feedback was "the real footages are very less being used, we need to use them properly
where we can use". Give the people real screen time: the customer, the support person, the PM and the engineer under the
relay; each hour of the day opening on its footage; a live card in place of an avatar; the team under the tagline.
Match the footage faces to the UI avatars (reference images). A clip stuck in one corner isn't enough.

## The motion bar: Cosmos (Sep 25)

They pointed at a Cosmos launch video made with HyperFrames (`reference/cosmos`): "I want this level", "Motion work
is crazy", and then "the voice and things, sound music should be according to the animations" and "you can come up
with your own creativity too". What sets the level:
- Dense, real content (photos, fragments) rather than empty cards.
- 3D moves with depth blur: a wall that tilts, a fly-through, a sphere.
- One object morphs into the next: cluster → logo → dot → search bar.
- Hard cuts to dark type cards between the light scenes.
- A giant wordmark bleeding off the frame at the end.
- Every sound on an animation event.

Borrow the craft, not the concept: `videos/launch-everywhere` (one emerald thread) is the Helpin take.

**Music that moves with the animation (Sep 26).** For the Product Hunt video they asked for "no voiceover and more of
music that moves with the animations", pointing at a motion showreel (`reference/showreel`): one hero object whose
landings are the drum hits, single words on colour cards cut on downbeats, hand-drawn notes. Built music-first
(`videos/ph-launch`).

**Density (Sep 26).** On the first narrated Product Hunt cut: "the animations are not the level that CircleCI used… it
feels empty at the start with the centered green thing… make it more motion graphic, we can use text too." CircleCI's
bar: one element keeps transforming (ring → outline → fill → contents → push-in → orbit → launch) roughly every beat or
two, with light trails, doodle confetti bursts, speed lines, orbiting dots and camera moves. Never hold one object in the
centre for seconds. Kinetic type on the voice is welcome: words that slam, fall apart ("lost."), dissolve to dust
("Context") or stutter ("Customers repeat themselves." ×3). `videos/ph-story` has the kit (trail, burst, speed, kt/rise).

**Agent-native pitch (Sep 26).** They pointed at Melvyn's Lumail launch video (`reference/lumail`: light editorial
motion graphics, music and effects only, "your team ships with AI agents now… your tool can't talk to them") as a fit
for Helpin. `videos/one-prompt` is our take. It keeps the structure and uses Helpin's lines, real MCP tool names and our
own device (headlines stream in behind an emerald caret). Its first cut is awaiting feedback.

**People open the video (Sep 26).** They asked for "the opening of a video with humans, and they speak and we do the
lipsyncing and the script, voice and rest of the stuff, like YC launch videos". `videos/launch-voices` is the first cut:
four fictional people state the problem to camera, and a narrator answers each of them with a live helpin.ai demo.
On the first cut: "the starting video feels a bit slow when the person is talking". Cut each line tight (0.1 s before the
first word and after the last, no sighs or lead-ins) and play talking heads at about 1.15× (`cuts.json` `speed`).

**Other companies on screen (Sep 26–28).** Real tool logos are wanted where the story is tool sprawl ("we should use
the tools logos at the end"); comparison videos name the one competitor in text with a monogram chip and draw its
world in our own neutral design. Rules and sources: [competitors.md](competitors.md).

## What they reject

- Title-card openers: a lone slammed word or a "Meet <agent>" card as the first screens.
- The impeccable design plugin in this repo. Never use it ("don't use impeccable skill at any cost").

- **Too much on one screen.** One idea per screen: a word slam, then one focus (a window, the page, a capture),
  then move to the next screen. Don't stack a page, a window, chips and titles together ("Doc rot" v1 was rejected for this).
- **Vague, blurry product images** (upscaled crops of screenshots). When a scene needs a specific screen, generate
  it on the fly as crisp HTML UI in the product's style (see scene-recipes, "Generated UI screens").

- Jittery or shimmering product UI. They spot 1 px wobbles. Live UI stays still on holds (see scene-recipes).

- A calm, even pace, or a long hold on one frame.
- Reusing the launch reel's look or music in another video.
- Static product screenshots, even in nice frames.
- Big cinematic end hits, and musical breakdowns right before the ending.
- Anything that looks like a template.

## Captions and social copy

- **For X:** lowercase, a hook line, one or two short sentences about the product, the tagline, the link, then an optional
  "video built with claude opus 5.5". Emoji are fine, one or two at most (🪦, 😎).
  Only claim a build time that's accurate.
- **For LinkedIn:** a one-line caption is fine. The thumbnail should have big type, real UI, and a clear centre for the play button.

## Working style

- They check in rarely and say "go ahead". Keep working autonomously, then report with the output path and the
  **`scp` download command** (renders stay on the server).
- They track everything in Helpin (the Marketing epic "Use-case videos"). Keep the storyboard doc and task comments current.
- When they share a correction, they also want the skill updated with it.

## Before you deliver, check

1. Is there a named or concrete hook in the first two seconds?
2. Does something change on screen on every beat after the drop?
3. Is the music this video's own, and does it carry to the end with no end hit?
4. Does the product UI move (camera, spotlight, travelling pieces)?
5. Is the narration in the second person, and does every claim have a source?
6. Is there a quotable tagline?
