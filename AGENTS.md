# Helpin video framework: agent instructions

This repo makes Helpin launch and product videos as HTML. Each video is one page
where every frame is a pure function of time `t`. Playwright renders the frames,
ffmpeg encodes them, and ElevenLabs supplies music and sound effects. There is no
video editor in the loop, so every change is a code edit plus a re-render.

## Taste

Before proposing or delivering any video, read `.agents/skills/helpin-video/references/taste.md`. It's the user's
approved benchmark ("Ticket limbo", `videos/bug-to-fix-energy`) and their likes, rejections and delivery checklist.

## Skills

Load the matching skill before starting. Skills live in `.agents/skills/`, and `.claude/skills/` links to them.

| Task | Skill |
|------|-------|
| Make a new video, or change scenes, copy or timing in one of ours | [helpin-video](.agents/skills/helpin-video/SKILL.md) |
| Music, sound effects, voiceover, levels | [video-sound](.agents/skills/video-sound/SKILL.md) |
| Change a finished MP4 whose source we don't have (new ending, remove an element, re-cut) | [video-edit](.agents/skills/video-edit/SKILL.md) |

## Setup

- Node lives under nvm and isn't on the default PATH: `export PATH=$HOME/.nvm/versions/node/v24.21.0/bin:$PATH`.
- `npm install`. Playwright is pinned to 1.59.1 to match the Chromium in `~/.cache/ms-playwright`; don't bump it without `npx playwright install chromium`.
- ffmpeg comes from `ffmpeg-static` (`node_modules/ffmpeg-static/ffmpeg`, with libx264). There is no system ffmpeg.
- `.env` holds `ELEVENLABS_API_KEY` (see `.env.example`). Never print or copy its values; check key names with `cut -d= -f1 .env`.

## Commands

```sh
npm run new -- <name>                    # videos/_template → videos/<name>
npm run preview -- <name>                # http://127.0.0.1:8090/videos/<name>/ (localhost only)
npm run sheet -- <name>                  # out/<name>/contact-sheet.png, 12 frames
npm run render -- <name> --stills 2,7.5  # PNG stills
npm run render -- <name>                 # out/<name>/<name>.mp4
npm run audio -- videos/<name>/audio.json [--video x.mp4] [--out y.mp4]
npm run inspect -- <file.mp4> [--times …|--frames a-b|--every s] [--crop x,y,w,h --boost]
npm run splice -- --base a.mp4 --at FRAME --insert b.mp4 [--resume FRAME] --out c.mp4
```

## Layout

```
lib/runtime.js      defineVideo(): scene clock, preview transport, window.__video for the renderer
lib/motion.js       pure timing: P, L, map, keys, envelope, stagger, typed, rand, eases incl. brandEase
lib/components.js   helpinSymbol, kineticLines, vortex, lineBundles, terminal, type, rise, leave, stagePoint,
                    counter, rollWord, zoomThrough, cursor, css
lib/kit.js          use-case video helpers: masked word rises, pop, push, bigScreen, flashes, shared end card
lib/site.js         siteView / siteWindow: live helpin.ai previews in a video, frame-exact (with lib/site-clock.js)
lib/brand.css       Helpin tokens, fonts, .scene/.pill/.shot/.term/.callout/.scrim styles
bin/                render, preview, audio, inspect, splice, new-video, server
assets/helpin/      symbol, palette, product screenshots (from helpin/website/public)
videos/_template/   starter page + STORYBOARD.md
videos/example/     20 s demo of every component
videos/launch/      open-source launch reel: storyboard + sound cue files
videos/launch-ending/  new 31.2–42 s ending spliced onto the original launch reel
reference/          third-party source MP4s and analysis frames (gitignored)
out/                renders, stills, audio cache (gitignored)
```

## Hard rules

1. **Frames are pure functions of `t`.** Embedded website previews count too: they run on the virtual clock from
   `lib/site-clock.js` (hide their `canvas` backgrounds, which run on real time). Don't use CSS transitions or animations, `Date.now()`, `Math.random()` (use `rand(seed)`), or timers in scene code. Renders are byte-identical run to run; keep it that way.
2. **Look before you claim.** You can't watch or hear the output. Check picture with `npm run sheet`, `--stills` and `inspect`, and read the PNGs. Check sound with the energy report `bin/audio.mjs` prints. Say what you checked and what you couldn't check (for example, how it sounds).
3. **Claims.** On-screen product copy must come from the Helpin README, the live website (`helpin/website/src/app/new`), or the committed roadmap. Record the sources in the video's `STORYBOARD.md`. Don't show the GitHub repo URL until the repo is public.
4. **Credits cost money.** ElevenLabs calls are cached by request in `out/audio-cache/`. Change timing and gain freely, but change prompts or lengths deliberately.
5. **Every video is its own concept with its own music.** Don't reuse another video's look or music beds
   (see the helpin-video and video-sound skills). Consistency comes from the brand (logo, type, palette,
   voice), not from one template.
6. **Keep the user's approved parts.** If the user approved music, a scene or copy, change around it; don't regenerate it.
7. **Don't publish.** Renders stay local. Share them via `scp` or an SSH tunnel; the server firewall is on, so don't open ports. Uploading anywhere needs the user's say-so.

## Brand

The source of truth is `helpin/website/public/brand/kit` (palette, symbol) and
`helpin/website/src/app/new/new.css`. Type is Instrument Sans + JetBrains Mono, bundled via
@fontsource. The dark look is forest `#081B16`, sage `#B8DDBB` for the second clause of
headlines, mint `#9CDBB3` for accents, and white cards for product UI. The launch reel
(`reference/helpin-launch-friend.mp4`, `videos/launch-ending`) is the reference for
layout: a mono eyebrow, a large tight headline, and a card or terminal on the right.

## Tracking in Helpin (Helpin MCP)

Video work is planned and tracked in the Helpin workspace through the Helpin MCP.
Read `get_current_context` first, and use idempotency keys for every write.

- **Epic:** "Use-case videos" (Marketing team), id `13201599-61af-4f10-ac4f-ae182098f3a4`, one task per video.
  The launch reel lives under the "Helpin Launch" epic.
- **Storyboards:** Helpin Docs, GTM space → "Use-case videos" collection (`3bf912ac-b3fa-4c64-a8d9-1b4734354946`).
  The storyboard doc is the source of truth for copy and timing. Link it to its task (`link_document_to_object`,
  `attached`) and don't build until the user approves it in the doc. Keep the repo's `STORYBOARD.md`
  to a pointer plus the claims check, so there aren't two copies to maintain.
- **Stages (Marketing workflow):**

  | Stage | When |
  |---|---|
  | To Do | idea |
  | In Progress | storyboard drafting, then build |
  | In Review | render ready |
  | Done | the user approved it and it's posted |

  When you move a task to In Review, comment with the output paths, what you checked, what you
  couldn't check, and the `scp` command. Attach the thumbnail and key stills to the storyboard
  doc (`prepare_document_image_upload`). The MCP can't store videos; MP4s stay on the server.
- **Updates:** move the task and comment at each step, so the board matches reality. Never mark a task
  Done yourself unless the user says it's approved or posted.
