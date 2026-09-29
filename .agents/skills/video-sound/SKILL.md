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
  // or: "voice": { "from": "vo.json", "clips": [{ "file": "out/…/support-voice-x115.wav", "at": 0, "from": 1.478, "trim": 2.765, "gain": 0.5 }],
  //                "duck": { "threshold": 0.03, "ratio": 6 } }   // clips: finished voice audio with an in point and length
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

- **One long track won't follow a structure.** Asked for a drop at 9 s, the model put it at 16 s. Composition plans
  (`sections` with durations) don't hold their timings either: in `one-prompt` one plan came back full from the first
  second and another dropped at 16 s instead of 26 s, while a plain prompt had the most usable shape. Generate two or
  three candidates of both kinds and measure them with `bin/beats.mjs`.
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
  Hide the seam under a hit or a scene change. Cached music is named `music-<bed index>-<hash>`; `audio.mjs` finds a
  copy at another index by its hash (before Sept 26 it didn't, and a second copy paid for a different take). Only
  `prompt`, `sections`, `generate`/`length` and `model` go into the hash, so `at`, `from`, `gain` and fades stay free.
  Give both copies the same `generate` (a copy with only a different `length` is a new request).
- **When the edit changes length, move the music, not the story.** Shift the bed's `from` by a whole number of beats
  and move every pinned line (`at`) by the same beats, so each line keeps its place on the music (`launch-voices`
  shortened its opening by five beats: `from` 3.018 s, every narration pin 3.018 s earlier).
- A near-silent stretch in a bed (a breakdown under a dramatic beat) needs a bed of its own: a sustained drone effect
  and a tick on each beat (`one-prompt` 24–30 s).
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
- **Measure every new effect's level** (`ffmpeg -af volumedetect`). Soft wording can come back silent: "a low soft
  tense ambient hum" averaged −65 dB, while "a sustained low synth drone pad, … clearly audible" averaged −14 dB.

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

## Sound that follows the animation (beat grid)

The user wants the voice, music and effects cut to the animation. `videos/launch-everywhere` is the reference:

1. Put every beat in one module (`timeline.js`, 120 BPM = a beat every 0.5 s). The page, the voice script and
   `cues.mjs` all import it, so nothing drifts.
2. Pin voice lines to beats with `"at"` in `script.json` (`bin/vo.mjs` lands the first word exactly there).
3. Cut the music with the picture: several short beds, each starting on a hard cut (the drop on the logo, a dark
   card, the finale), instead of one long track whose sections drift. Generate them first with
   `npm run audio -- <audio.json> --prefetch` (no video needed).
4. Measure each bed with `node bin/beats.mjs <bed.mp3> --bpm 120`: tempo, the first beat and an energy strip. Set
   `from` to skip the lead-in so the first beat lands on the cut. ElevenLabs beds came back at 120.2 BPM with quiet
   first seconds (skip them) and sometimes a fade instead of the requested build (bridge it with an effect, such as a
   reverse whoosh into the drop).
5. Compute effect times from the same numbers the animation uses (e.g. `stitchTimes()` for when the needle crosses
   each tile), never by eye.

## Music-first (no voice)

When the music leads (`videos/ph-launch`), cut the picture to the track instead of the other way round:
generate two or three candidates with the same arc (one `audio.json` with several beds and `--prefetch`), measure
each with `node bin/beats.mjs <bed> --bpm 120 --json out.json` (per-beat energy and the strong drum hits), keep the
one with the most usable shape (hits in the intro, a clear drop, a gap, a clean end), then name its beats in
`timeline.js` (`B(n) = first + n × period`) and put every impact and effect on them. Generated tracks rarely follow the
requested structure, so design around what came back. Keep the chosen bed's exact prompt and `generate` length in the
final `audio.json`, so the cached take is reused (the cache finds it by hash at any bed index).

## Talking heads (lip-synced cast)

People talking to camera come from `bin/cast.mjs` (see the helpin-video skill). Each clip's voice is its own file,
`out/<name>/cast/<id>-voice.mp3`. Place the cuts with `voice.clips` (`from` = the clip's in point, `trim` = its length),
so they sit on the voice bus and the music ducks under them too. Keep the cut list in one JSON (`cuts.json`) that both
the page and `cues.mjs` read.

To play talking heads faster (the user found 1× slow), speed picture and voice together. The page samples the clip at
`in + (t − t0) × speed`, and `cues.mjs` writes a pitch-preserving copy (`ffmpeg -af atempo=1.15`) and divides `from`
and `trim` by the speed. Captions from the word timings divide by the same speed. Check with speech-to-text: in
`launch-voices` all 42 words landed within 0.04 s of the captions.

## Cost and safety

- The account is pay-as-you-go. Clips are cached in `out/audio-cache/` by request hash, so changing
  `at`, `gain`, `trim` or fades is free, while changing `text`, `prompt`, `duration` or `length` re-generates.
  `--regen` forces regeneration; only use it on purpose.
- Never print the key. To check it works, call `GET /v1/user/subscription` and report only the status and tier.
