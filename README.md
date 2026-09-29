# Helpin video framework

Helpin's launch films, product videos and social stills, written as web pages. Each video is one HTML page where
every frame is a pure function of time, so the live preview and the rendered MP4 always match and every render is
byte-identical. There's no video editor in the loop: a change is a code edit and a re-render.

- **Picture:** Playwright seeks the page frame by frame, and ffmpeg (bundled) encodes the frames, up to a 4K master.
- **Product UI:** real, animated helpin.ai previews run inside the video on a virtual clock (`lib/site.js`).
- **Sound:** ElevenLabs makes the music, sound effects and voiceover. Every clip is cached, and the mix lands at
  −14 LUFS.
- **Footage and people:** Higgsfield generates live-action plates and lip-synced talking heads, each priced before it's
  paid for and logged in a ledger.

Agents: start with [AGENTS.md](AGENTS.md), then the skills in `.agents/skills/`.

## Quick start

```sh
export PATH=$HOME/.nvm/versions/node/v24.21.0/bin:$PATH   # Node 20+ (nvm isn't on the default PATH here)
npm install
cp .env.example .env    # ELEVENLABS_API_KEY for sound; HIGGSFIELD_API_KEY (id:secret) for footage

npm run new -- my-video          # copy videos/_template to videos/my-video
npm run preview -- my-video      # http://127.0.0.1:8090/videos/my-video/
npm run sheet -- my-video        # 12-frame contact sheet to review
npm run render -- my-video       # out/my-video/my-video.mp4
npm run audio -- videos/my-video/audio.json   # soundtrack, mixed and muxed onto the render
```

## Commands

| Command | What it does |
|---|---|
| `npm run new -- <name>` | Scaffolds a video from `videos/_template`. |
| `npm run preview -- <name>` | Live preview. Space plays or pauses, ←/→ steps a frame, Shift+←/→ a second, 1–9 jump to a scene, `#12.5` opens at 12.5 s. |
| `npm run render -- <name>` | Renders the MP4. Options: `--stills 2,7.5`, `--sheet 12`, `--from 19 --to 26`, `--size 1080x1920`, `--scale 2` (4K) or `0.5` (draft), `--audio file`, `--workers`, `--fps`, `--crf`, `--out`. |
| `npm run audio -- <audio.json>` | Music beds, sound effects and voice, mixed to −14 LUFS and muxed. `--video`, `--out`, `--prefetch` (generate clips only), `--no-music`, `--no-voice`, `--regen`. Prints an energy strip, since nobody can listen from a terminal. |
| `npm run inspect -- <file.mp4>` | Contact sheets of any MP4: `--times 5,9`, `--frames 935-940`, `--every 0.9`, `--crop x,y,w,h`, `--boost`. |
| `npm run splice -- --base a.mp4 --at N --insert b.mp4 --out c.mp4` | Replaces part of a finished MP4 on exact frames, e.g. a new ending. |
| `node --env-file=.env bin/vo.mjs <script.json>` | Voiceover with word timings. Writes `vo.json`, which the page and the mix both read, so the picture follows the voice. |
| `node bin/beats.mjs <bed.mp3> --bpm 120 [--json out.json]` | Tempo, first beat and per-beat energy of a music bed, for cutting the picture to the music. |
| `node --env-file=.env bin/genvideo.mjs <plates.json> [--dry]` | Generated footage (Seedance) as frame sequences. `--dry` prices the run first. |
| `node --env-file=.env bin/cast.mjs <cast.json> [--dry]` | A talking-head cast: portrait, line, lip-synced clip and voice, plus word timings for captions. |
| `node bin/deliver.mjs <4k-master.mp4> [--card 48.5]` | Delivery set: 4K and 1080p MP4, 1440p WebM, poster and card stills. |

## Making a video

1. **Storyboard.** Brief, story, copy and a claims check in `videos/<name>/STORYBOARD.md`. The storyboard doc in
   Helpin is the source of truth when there is one. Every product claim needs a source.
2. **Music, voice and people first** when they lead:
   - Generate two or three music candidates with `audio.mjs --prefetch`, measure them with `bin/beats.mjs`, and name
     the chosen take's beats in `timeline.js`.
   - Narration comes from `bin/vo.mjs`, each line pinned to a beat.
   - People talking to camera come from `bin/cast.mjs`.
3. **Build** the page: one `<section class="scene">` per storyboard row, with timing from the shared beat grid or the
   voice's word timings. Reuse `lib/` (see below) and the live helpin.ai previews for product UI.
4. **Review** without watching: contact sheets, stills either side of every cut, speech-to-text on the final mix, and
   the loudness report.
5. **Sound:** `cues.mjs` writes `audio.json` from the same names the page uses, so every effect lands on its picture
   event.
6. **Deliver:**
   ```sh
   npm run render -- <name> --scale 2 --crf 14 --out out/<name>/<name>-4k.mp4
   npm run audio -- videos/<name>/audio.json --video out/<name>/<name>-4k.mp4 --out out/<name>/helpin-<name>-4k-master.mp4
   node bin/deliver.mjs out/<name>/helpin-<name>-4k-master.mp4
   ```

Stills (video thumbnails, profile banners) are pages too: render them with `--stills 0.5 --scale 2`.

## Layout

```
AGENTS.md              rules, commands and brand for agents working here
.agents/skills/        helpin-video, video-sound, video-edit (linked from .claude/skills/)
lib/
  runtime.js           defineVideo(): the scene clock, preview transport, the renderer's hooks
  motion.js            pure timing: P, L, keys, envelope, stagger, typed, rand, eases
  components.js        helpinSymbol, kineticLines, lineBundles, terminal, rise/leave, counter, cursor, …
  kit.js               use-case helpers: word rises, pop, push, bigScreen, the shared end card
  film.js              narrated films: voice-timed anchors, cameras, paths, generated-footage frames
  site.js, site-clock.js   live helpin.ai previews inside a video, frame-exact
  brand.css            Helpin tokens, fonts (Instrument Sans, JetBrains Mono) and base styles
bin/                   render, preview, audio, inspect, splice, new-video, server, vo, beats, genvideo, cast, deliver
assets/                Helpin symbol, palette, avatars, agent icons, product screenshots, product logos
videos/<name>/         one video per folder: index.html, STORYBOARD.md, timeline.js, cues.mjs, audio.json, …
reference/             third-party reference videos and analysis frames (gitignored)
out/                   renders, stills, caches and ledgers (gitignored)
```

## Skills

| Skill | Use it for |
|---|---|
| [helpin-video](.agents/skills/helpin-video/SKILL.md) | A new video or changes to one: concept, storyboard, scenes, review, render, stills. |
| [video-sound](.agents/skills/video-sound/SKILL.md) | Music, sound effects, voiceover, talking-head audio, levels. |
| [video-edit](.agents/skills/video-edit/SKILL.md) | Changing a finished MP4 whose source we don't have. |

References in `.agents/skills/helpin-video/references/`:
- `taste.md`: what the user has approved and rejected. Read it before proposing anything.
- `scene-recipes.md`: the API, patterns and live-preview selectors.
- `motion-ideas.md`: motion techniques from studied references.
- `competitors.md`: how competitors and other companies' logos may appear.

## Rules that matter most

- **Frames are pure functions of time.** No CSS transitions, timers, `Date.now()` or `Math.random()` in scene code.
- **Look before you claim.** Nobody here can watch the output. Check stills, sheets, transcripts and levels, and say
  what couldn't be checked.
- **Claims have sources:** the Helpin README, helpin.ai or the committed roadmap, recorded in each `STORYBOARD.md`.
- **Competitors:**
  - In a comparison video, the competitor is named in text with the compare page's monogram chip, and its facts come
    from the website's `compare-data.ts` with its checked date. Never its logo, colours or UI.
  - Real logos appear only in tool-sprawl moments.
- **Every video gets its own concept and its own music.** Consistency comes from the brand, not a template.
- **Credits cost money.** ElevenLabs and Higgsfield calls are cached by request; price footage with `--dry` first.
- **Nothing is published without the user's say-so.** No GitHub repo URL on screen until the repo is public.
- **Never print `.env` values.** Check key names with `cut -d= -f1 .env`.

## Videos

**Launch films**
- `launch`: the open-source launch reel. The final picture is the original cut plus `launch-ending`, spliced at
  frame 937.
- `launch-film`: "The story", a narrated film with one camera move through the product and footage of the people in it.
- `launch-everywhere`: "Everywhere", a narrated launch film where one emerald thread runs through the agents and the
  team's other products.
- `launch-voices`: "Launch voices", in YC launch style. Four people say the problem to camera (a lip-synced cast), and
  a narrator answers each of them with a live helpin.ai demo.
- `one-prompt`: "One prompt", an agent-native pitch led by music. Headlines stream behind an emerald caret, followed
  by real Helpin MCP tool calls.
- `film-one-day`: "One day", a narrated workday that follows the sky.
- `film-crew`: "The crew", the agents introduced one by one, each in its own colour.

**Product Hunt**
- `ph-launch`: a music-first motion reel, where an emerald dot lands every word on the beat.
- `ph-story`: "The story block", a narrated film at CircleCI-level density, ending on the tool logos converging into
  Helpin.

**Comparison videos** (for helpin.ai/compare)
- `cmp-zendesk`: "Solved. Still broken."
- `cmp-intercom`: "The meter"
- `cmp-help-scout`: "Past Send"
- `cmp-chatwoot`: "Open all the way"
- `cmp-linear`: "The customer attached"
- `cmp-jira`: "Out of the backlog"
- `cmp-plane`: "Every request lands"

**Use-case videos**
- `bug-to-fix-energy`: "Ticket limbo", the approved benchmark for energy and craft.
- `bug-to-fix`, `bug-to-fix-thread`: earlier cuts of the same story.
- `support-say-it-once` (Echo), `docs-caught-up`, `docs-rot` and `docs-board` (Quill), `crm-up-to-speed`,
  `meeting-someone-owns-it`, `agents-keep-the-keys`, `mcp-ask-where-you-work`, `selfhost-your-server`.

**Stills**
- `launch-thumbnail` and `ph-story-thumb`: video thumbnails.
- `x-header` and `linkedin-banner`: profile banners.

**Tools**
- `_template`: the starter page.
- `example`: a tour of every component.
- `concepts`: style frames for concept options.
- `site-probe` and `probe-docs`: probes for timing website previews.

## Sharing renders

Renders stay on this server. Download one with

```sh
scp azhar@144.76.106.220:~/projects/helpin/helpin-video-framework/out/<name>/<file>.mp4 .
```

or tunnel the preview with `ssh -L 8090:localhost:8090 azhar@144.76.106.220` and open
http://127.0.0.1:8090/videos/<name>/.
