// Music-first: the picture follows the chosen bed's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-0-007d14029e8a2fbb.mp3 --bpm 124 --json out/cmp-intercom-music/beats-0.json
// Candidate 0 of videos/cmp-intercom/music.json: 123.07 BPM, first beat at 0.355 s. Percussion with ticking
// sixteenth-note hats (the meter) to track beat 30, the drop on track beat 31 (15.47 s, about +13 dB), the full
// groove to track beat 61, then a fade. We start the bed at track beat 3 (`from`), so video beat n = track beat n + 3
// and the drop lands on video beat 28. A second copy of the same bed, from track beat 37, takes over at video
// beat 58 (track beat 61, just before the bed's own dip and fade; 24 beats apart, so the same place in the 8-beat
// phrase), so the groove carries through the end card.
export const MUSIC = { bpm: 123.07, period: 60 / 123.07, trackFirst: 0.355, fromBeat: 3, seam: 58, seamFromBeat: 37 };
export const B = (n) => +(n * MUSIC.period).toFixed(3); // video time of beat n
export const trackTime = (beat) => +(MUSIC.trackFirst + beat * MUSIC.period).toFixed(3);

// Named beats (video beat indices).
export const N = {
  // hook, screen 1: the meter starts running
  chat: 0, answer: 2, resolved: 3, flood: 4, flooded: 8, seats: 8, seated: 12,
  // hook, screen 2: the chat is resolved, the fix goes elsewhere
  fix: 12, fixQ: 12.5, fixA: 15, fixResolved: 16, fixOut: 17, fixGone: 18.5,
  // the villain: the meter runs through the year
  villain: 20, year: 22, yearDone: 26.5, brace: 27.5,
  // the drop: stop the meter
  drop: 28, locked: 29.5,
  // after the drop
  team: 32, team20: 33.5, team40: 35, ai: 37.5,
  task: 43, pr: 46, prOpen: 48.5, follow: 51.5,
  receipt: 58, verdict: 61, tag: 66, tag2: 68, end: 72, total: 80,
};
export const DURATION = B(N.total);
