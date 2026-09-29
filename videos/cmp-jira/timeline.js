// Music-first: the picture follows the chosen track's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-1-c60c381b9d27d661.mp3 --bpm 123.07 --json out/cmp-jira/beats-1.json
// 123.05 BPM, first beat at 0.17 s, 16-beat phrases. Its quiet Rhodes-and-brushes intro runs to file beat 46, the band
// drops on file beat 47 (23.09 s) and stays full to beat 110, with a one-beat dip on beat 79. The bed plays from file
// beat 24 (11.872 s), so video beat 0 is t = 0, the drop lands on video beat 23 and the dip on video beat 55.
export const MUSIC = { bpm: 123.05, first: 0, period: 0.4876, from: 11.872 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of beat n (0-based, may be fractional)
export const DURATION = B(75);

// Named beats (beat indices, not seconds).
export const N = {
  // hook: your customer asked; support passes it on; the request drops into the backlog
  reply: 1, drop0: 4,
  // it sinks: work piles in above it
  sink: 6, quote: 6.5, deep: 11,
  // separate products (one tile per beat)
  split: 12, tiles: [13, 14, 15, 16],
  // Data Center (the pre-drop swell)
  dc: 18, plate: 19, lights: 20, dcOut: 23,
  // the drop: the request comes back up and becomes the Helpin task
  drop: 23, task: 25.5, rows: 27, taskOut: 29,
  // stations
  pr: 29, told: 37, ws: 44, oss: 51, dip: 55, run: 56,
  // tagline and end card
  tag: 59, tag2: 60.5, mark: 66, cta: 67, loop: 73.2, end: 75,
};
