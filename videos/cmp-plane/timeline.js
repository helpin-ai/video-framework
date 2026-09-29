// Music-first: the picture follows the chosen track's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-0-717b107ec68e959f.mp3 --bpm 120 --json out/cmp-plane-beats-0.json
// 120.20 BPM, first beat at 0.06 s. Its shape in its own beats: a quiet flute intro (0–3), a light groove (4–27),
// a dip (28–30), a build (31–35), the full groove from beat 36 to 68, then it stops.
// The bed plays from its beat 12 (6.05 s), so video beat 0 is t = 0 and the drop (its beat 36) lands on video beat 24.
// A second copy of the same take picks up at video beat 56 from its beat 36, under the cut to the checklist.
export const MUSIC = { bpm: 120.2, first: 0, period: 0.49917, from: 6.05, loopAt: 56, loopFrom: 18.03 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of beat n (0-based, may be fractional)
export const DURATION = 38;

// Named beats (beat indices, not seconds).
export const N = {
  // hook: planes fly in toward the board (the headline is already set on frame 0)
  hook: 0, p1: 0, p2: 1.5, p3: 3,
  // your tracker starts at the work item: one lands and unfolds, the rest miss
  miss: 7, land: 8, unfold: 8.6, crash: 9.5, veer: 10.5, blank: 11.5,
  // where does the customer go?
  where: 13, chipA: 14, chipB: 15,
  // both open source; only one includes the agents
  open: 18, cardA: 17.8, cardB: 18.2, rowA: 19.8, rowB: 20.4, lit: 21, swell: 22,
  // the drop: every request lands
  drop: 24, landed: [24.4, 24.9, 25.4, 25.9, 26.4],
  // stations
  s1: 30, s2: 37, s3: 44, s4: 50,
  // the reply flies back (inside s4)
  sent: 52.05, fly: 52.4, arrive: 54.8,
  // the free edition, all of it
  check: 56, ticks: [56.8, 57.2, 57.6, 58, 58.4, 58.8],
  // tagline and end card, back in the sky
  tag: 64, tag2: 65, mark: 69, cta: 70, note: 70.5, loop: 75.2, end: 76,
};
