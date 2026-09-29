// Music-first: the picture follows the chosen track's grid, measured with
//   node bin/beats.mjs out/audio-cache/music-1-e2d3c9af25ad5d6d.mp3 --bpm 122 --json out/cmp-help-scout/beats-1.json
// 123.06 BPM, first beat at 0.29 s. The track has a calm, sparse intro (its beats 0–15) and the full groove from its
// beat 16 (8.1 s) to beat 80 (39.3 s). Its first two bars play twice (audio.json), so on the video's grid the calm
// intro runs beats 0–15, the build 16–23 and the drop lands on beat 24 (12.0 s).
export const MUSIC = { bpm: 123.06, first: 0.29, period: 60 / 123.06 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of beat n (0-based, may be fractional)
export const DURATION = 38.8;
// Where the track's own beat 0 restarts on the video (after two bars of its intro).
export const REPEAT_AT = +(8 * MUSIC.period).toFixed(4);

// Named beats (beat indices, not seconds).
export const N = {
  // the calm inbox: the reply types, the cursor clicks Send
  hook: 0, h1: 0.5, type: 1, cursor: 2, h2: 4.5, press: 4.5, sent: 5,
  // the camera pulls back past the inbox's edges; the work walks off the page
  pull: 6, walk: 7.2, card1: 8.5, card2: 10, card3: 11.5,
  // every AI resolution: $0.75 (one token per beat), per user
  fee: 14, token: 14.5, avatars: 15,
  // loose ends
  villain: 19, swell: 21,
  // the drop: the frame widens, the inbox docks into the workspace, the loose ends dock into their panes
  drop: 24, dock: [24.4, 25, 25.6], keep2: 25.5, strip: 27,
  // stations (six beats each)
  projects: 30, crm: 36, meetings: 42, agents: 48,
  // the receipt: the number settles by beat 58.5 and holds to the end of the screen
  receipt: 54, rows: 55, totals: 56.25, verdict: 57.25, counted: 58.5,
  // bring your docs
  docs: 63, fly: 64, land: 65.2,
  // tagline and end card
  tag: 67, tag2: 68.5, end: 72, cta: 74, end2: 75,
};
