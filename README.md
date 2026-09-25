# Helpin video framework

Launch and product videos written as HTML. Every frame is a pure function of time,
so the browser preview and the rendered MP4 always match. Playwright captures the frames,
ffmpeg (bundled) encodes them, and ElevenLabs makes the music and sound effects.

Agents: start with [AGENTS.md](AGENTS.md) and the skills in `.agents/skills/`.

```sh
export PATH=$HOME/.nvm/versions/node/v24.21.0/bin:$PATH   # Node 20+
npm install
cp .env.example .env                                        # add ELEVENLABS_API_KEY for sound

npm run new -- my-reel          # copy videos/_template → videos/my-reel
npm run preview -- my-reel      # live preview at http://127.0.0.1:8090/videos/my-reel/
npm run sheet -- my-reel        # contact sheet for review
npm run render -- my-reel       # → out/my-reel/my-reel.mp4
npm run audio -- videos/my-reel/audio.json   # soundtrack + muxed MP4
```

| Command | Does |
|---------|------|
| `render <video>` | full MP4; `--stills 2,7.5`, `--sheet 12`, `--from/--to`, `--size 1080x1920`, `--scale 0.5`, `--audio file`, `--workers/--fps/--crf/--out` |
| `preview <video>` | Space play/pause · ←/→ one frame · Shift+←/→ 1 s · 1–9 jump to scene · `#12.5` opens at 12.5 s |
| `audio <cues.json>` | ElevenLabs music beds + SFX (cached), mixed to -14 LUFS, muxed; prints an energy strip |
| `inspect <file.mp4>` | contact sheets at `--times`, `--frames a-b` or `--every s`; `--crop`, `--boost` |
| `splice` | replace part of an existing MP4 with a rendered clip on exact frames |
| `new <name>` | scaffold a video from the template |

## Skills

| Skill | For |
|-------|-----|
| [helpin-video](.agents/skills/helpin-video/SKILL.md) | brief → storyboard → scenes → review → render |
| [video-sound](.agents/skills/video-sound/SKILL.md) | music, sound effects, voiceover, variations |
| [video-edit](.agents/skills/video-edit/SKILL.md) | changing a finished MP4 without its source |

## Videos

- `videos/bug-to-fix-energy`: **"Ticket limbo"**, the approved benchmark (energetic use-case cut, 128 BPM).
- `videos/bug-to-fix-thread`: "The thread", a calmer earlier concept for the same story.
- `videos/example`: 20 s tour of every component.
- `videos/launch`: the open-source launch reel's storyboard and sound. The final picture is the
  original cut plus `videos/launch-ending`, spliced at frame 937.

## Sharing renders

Renders stay on this server. Download with
`scp azhar@144.76.106.220:~/projects/helpin/helpin-video-framework/out/<name>/<file>.mp4 .`,
or tunnel the preview with `ssh -L 8090:localhost:8090 azhar@144.76.106.220`.
