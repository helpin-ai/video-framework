---
name: video-sound
description: Create or change a video's soundtrack with ElevenLabs (music beds, sound effects, optional voiceover), mix it to the picture and mux it onto the MP4. Use for "add sound/music", SFX timing, levels, endings, voiceover, or sound variations for any video in this framework or any MP4.
---

# Video sound

`bin/audio.mjs` turns a cue file into a mixed soundtrack. It generates each clip once
through ElevenLabs, places clips on the timeline, mixes to -14 LUFS, and muxes the result
onto a video. See `videos/launch/audio.json` for a full example.

```sh
npm run audio -- videos/<name>/audio.json                     # uses "video" in the cue file
npm run audio -- videos/<name>/audio.json --video x.mp4 --out y.mp4
```

It prints a per-second energy strip and the loudness. **Read the strip every time.** It is
your only way to "hear" the mix.

## Cue file

```jsonc
{
  "name": "launch",            // output folder out/<name>/
  "duration": 42,
  "video": "../../out/launch/launch.mp4",
  "master": { "lufs": -14, "fadeOut": 1.2 },
  "music": [                   // one bed per section; see "Music" below
    { "at": 0,   "length": 9.25, "gain": -16, "fadeIn": 1.5, "fadeOut": 0.35, "prompt": "…" },
    { "at": 9.0, "length": 33,   "gain": -7,  "generate": 36, "from": 2.5, "prompt": "…" }
  ],
  "sounds": {                  // each generated once, reused by every cue
    "click": { "text": "soft crisp UI mouse click, minimal", "duration": 0.5, "gain": -9 }
  },
  "cues": [
    { "sound": "click", "at": [16.0, 16.7, 17.4] },
    { "sound": "typing", "at": 34.75, "trim": 0.65, "gain": -12 }
  ],
  "voice": { "voiceId": "…", "lines": [{ "at": 2.0, "text": "…" }], "gain": 0 }   // optional
}
```

A variation file can hold just `{ "extends": "audio.json", "label": "rideout", "music": [...] }`.
Top-level keys override the base, and `label` keeps its WAV separate. Use this to offer A/B
options without touching the approved version.

## The user's sound taste

These scores were approved: the launch reel's ride-out (`videos/launch/audio-rideout.json`) and "Ticket limbo"
(`videos/bug-to-fix-energy/audio.json`, 128 BPM: a percussion hook, a hard drop, a driving groove, a slam on every word).
They want energy (120–130 BPM), music that carries through to the end, no late breakdown, and no big cinematic
end hit. See `helpin-video/references/taste.md`.

## Every video gets its own music

**Never reuse another video's music.** Each video gets its own score: a new genre, tempo, instrumentation
and mood chosen for that video's concept. Pick those in the storyboard, before any build.
Reusing a bed is only for extending or varying the *same* video (for example, a ride-out
of its own main theme). The launch reel's beds belong to the launch reel. Sound effects should also fit the
concept (organic taps for a paper/editorial look, clean digital blips for a system/diagram look),
not a single stock set across the series.

## Music: what works

- **One long track won't follow a structure.** Asked for a drop at 9 s, the model put it at 16 s.
  Generate one short bed per section (intro/build, main, outro) with a single mood per prompt,
  and place each with `at`/`length`.
- Say "no intro, no build-up, no fade-in, full band from the very first beat" for a bed that must
  hit on a cut. Generate it a few seconds long (`generate`) and skip its lead-in with `from`.
- Beds must be at least 10 s; shorter ones are generated at 10 s and trimmed.
- **Generated clips often fade out in their last seconds.** Check a clip's energy (astats) before choosing `from`, and take
  a steady section, not the tail. A "build to the end" prompt still faded out at about 7 s of a 10 s clip.
- Sound-effect durations must be 0.5–30 s (audio.mjs clamps them).
- **Sparse "ominous" percussion leaves holes** (−45 dB gaps between hits). Check the energy strip, and fill the
  hook with a concept sound effect on the grid (e.g. clock ticks every half bar in "Doc rot").
- To extend a bed you already approved **for this video**, reuse it (same prompt means a cache hit, no credits): place a second copy of it
  with `from` at the drop, starting a whole number of bars after the first copy's `at`, so it stays on the grid.
  Hide the seam under a hit or a scene change.
- Keep the drop contrast. The intro bed should sit 4–8 dB under the main bed (`gain`). `loudnorm`
  flattens the rest, so judge contrast in the energy strip, not by the gain numbers.
- The user decides the ending. Offer options: ride out (the beat continues under the end card and fades) or hard out
  (the music stops on a hit). Don't bring back a sound the user rejected. On the launch reel this user cut the final
  cinematic hit and preferred music continuing to the end over a breakdown.

## Sound effects: what works

- Describe the source and the context: "soft crisp UI mouse click, minimal",
  "fast typing on a quiet low-profile laptop keyboard". Durations run 0.5–5 s.
- Place a cue on every visible event: a line appearing, a card entering, a click, a state change, a check ticking.
  Get the times from the scene code (`scene start + lt`), not by eye.
- Keep UI sounds quiet (-9 to -16 dB) and leave hits and risers louder. Repeated cues (pops,
  whooshes on cuts) should sit 2–4 dB lower than one-offs.
- `trim` shortens a long clip (such as typing) to fit a shorter beat.

## Voiceover

Recommend against narration on kinetic-type cuts, because the text already carries the story and
most social views are muted. For a narrated cut (like `videos/launch-film`), let the voice drive the picture:

1. Write `script.json`: `{ voiceId, model, settings, start, tail, lines: [{ id, text, gap }] }`. List the
   account's voices with the API and let the user pick; `settings.speed` barely changes pace, so trim copy instead.
2. `node --env-file=.env bin/vo.mjs videos/<name>/script.json` generates each line with word timestamps
   (neighbouring lines are passed as context for continuous delivery) and writes `vo.json`: every line's start/end
   and every word's time. The scene imports it (`import VO from './vo.json' with { type: 'json' }`) and keys each beat
   to a word, so re-voicing re-times the film.
3. In `audio.json`, set `"voice": { "from": "vo.json", "duck": { "threshold": 0.03, "ratio": 6, "attack": 25, "release": 450 } }`.
   The music bus is sidechain-ducked under the voice (effects too with `duck.sfx`); music swells back in the pauses.
4. Generate sound-effect cues from the same word anchors (see `videos/launch-film/cues.mjs`).
5. You can't listen, so transcribe the final mix with ElevenLabs speech-to-text (`scribe_v1`) and compare it with the
   script. It catches buried or ambiguous lines ("self-host it free" came back as "self-hosted, free").

## Cost and safety

- The account is pay-as-you-go. Clips are cached in `out/audio-cache/` by request hash, so changing
  `at`, `gain`, `trim` or fades is free, while changing `text`, `prompt`, `duration` or `length` re-generates.
  `--regen` forces regeneration; only use it on purpose.
- Never print the key. To check it works, call `GET /v1/user/subscription` and report only the status and tier.
