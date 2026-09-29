// Music-first: the picture follows the chosen track's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-1-a691b48d12b7d7a4.mp3 --bpm 120 --json …
// 120.2 BPM, first beat at 0.15 s. A quiet intro (beats 0–7), a build (8–15), the full groove from beat 16 (8.14 s),
// a fade to near silence from beat 47 (23.6 s, lowest at beat 56, 28.1 s), a build back up, the drop on beat 63
// (31.6 s), the full groove to beat 95 (47.6 s), then the track fades out by about 52 s.
export const MUSIC = { bpm: 120.2, first: 0.15, period: 60 / 120.2 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of beat n (0-based, may be fractional)
export const DURATION = 49.8;

// Named beats (beat indices, not seconds).
export const N = {
  // hook: three lines stream in, each with its bracket note
  hook: 0, bills: 2, zero: 4, hookOut: 7.5,
  // one customer question touches 1 → 5 tools
  touch: 8, roll: 9, grey: 14, touchOut: 15.5,
  // the full groove: the copy-paste handoff
  handoff: 16, handoffOut: 21.5,
  // the dot matrix
  dots: 22, hollow: 26, red: 30, dotsOut: 33.5,
  // seats
  seats: 34, seatRoll: 35, every: 37, seatsOut: 39.5,
  // your team works with AI agents now
  agents: 40, connect: 44, snap: 46,
  // the music fades out: the tools can't share the story
  cant: 48, five: 52,
  // the build: 5 → 1
  count: 58, workspace: 61.5,
  // the drop
  drop: 63, sub: 65, chips: 66, revealOut: 69.5,
  // plug in the AI client you already use (one chip every half beat)
  hub: 70, clients: 71, flow: 73.5, row: 74, hubOut: 75.5,
  // one prompt: the question types, then four tool calls, three beats apart
  demo: 76, calls: 79, callGap: 1.5, badge: 83.5, done: 85, demoOut: 87.5,
  // pricing
  price: 88, priceOut: 93,
  // the end
  end: 93.5, button: 95, click: 96,
};
