// Music-first: the picture follows the chosen track's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-0-fc1ac78701a57ecb.mp3 --bpm 124 --json …
// 123.07 BPM, first beat at 0.23 s. The bed plays from its beat 8 (4.130 s), so video beat 0 is t = 0.
// In video beats: keyboard-click intro (0–7), a build (8–18), near silence (19–22), the drop on beat 23
// (11.21 s), the full groove to beat 70 (a small dip on 54), and the track ends on beat 71 (34.61 s).
export const MUSIC = { bpm: 123.07, first: 0, period: 0.48753, from: 4.13 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of beat n (0-based, may be fractional)
export const DURATION = 34.6;

// Named beats (beat indices, not seconds).
export const N = {
  // hook: C creates three issues, J moves the selection twice, Enter opens EXP-142
  hook: 0, keys: [0, 1, 2, 3, 4, 5], open: 5, hookOut: 6,
  // who asked for this?
  who: 6, comment: 7, field: 9.5, whoOut: 12,
  // the customer is in another tool; so is the context
  other: 12, context: 15, agent: 16, otherOut: 19,
  // the music drops out: who tells them it shipped?
  tells: 19, released: 19.5, arrow: 20, lift: 22.2,
  // the drop: the customer card snaps onto the task
  drop: 23, rows: 25, dropOut: 31,
  // stations, one keycap each
  s1: 31, s2: 37, s3: 44, chart: 50, mcp: 58,
  // chart detail
  draw: 51, marker: 53,
  // MCP detail
  plug: 59.5,
  // tagline and end card
  tag: 63, tag2: 64, mark: 66, cta: 67, end: 71,
};
