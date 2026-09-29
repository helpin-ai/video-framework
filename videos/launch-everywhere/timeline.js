// One grid for picture, voice, music and effects: 120 BPM, a beat every 0.5 s, a bar every 2 s.
// script.json pins each voice line to these times, index.html animates on them,
// cues.mjs places the sound effects on them and the music beds start on the hard cuts.
export const BEAT = 0.5;
export const DURATION = 50;

export const T = {
  // Act 1: the hook. The same message, told three times; then "I already told you this."
  cut1: 0.0, cut2: 1.0, cut3: 2.0, cut4: 3.0, shatter: 5.5,
  // Act 2: the wall, stitched by the thread, pulled into a knot
  head: 6.0, threadIn: 8.25, tilt: 8.5, collapse: 9.5, knot: 10.5,
  // Act 3: the mark
  word: 11.0, mods: 12.25, markOut: 13.5,
  // Act 4: ask, fly through, the story on the thread
  bar: 13.75, typeA: 14.25, typeB: 15.6, enter: 16.0, settle: 17.5, beads: 18.0,
  // Act 5: agents; Maya's story rides the thread through every beat and each agent stamps it
  agents: 19.5, relay: 21.4, echo: 22.0, forge: 24.5, lens: 26.5, quill: 28.0,
  // Act 6: approvals
  gate: 30.25, knob: 31.75, approve: 32.75,
  // Act 7: hard cuts on dark
  oss: 33.5, servers: 35.0, light: 36.75,
  // Act 8: the team behind it
  team: 37.5,
  // Act 9: the ball of thread
  ball: 41.0, tagline: 41.5,
  // Act 10: end
  end: 44.5, name: 45.0, cta: 45.75, giant: 47.5,
};

// When each agent stamps Maya's story card: seconds into its beat (shared by the picture and the stamp sound).
export const STAMP = { echo: 1.6, forge: 1.3, lens: 1.05, quill: 1.5 };

// The wall: 8 columns; the thread's needle runs from x0 to x1 with an ease-in-out over `dur`,
// stitching one tile per column. stitchTimes() is when the needle crosses each column's centre,
// shared by the picture (tile lifts) and the sound (plucks) so they land together.
export const WALL = { COLS: 8, CW: 218, GAP: 14 };
export const NEEDLE = { x0: -120, x1: 2060, dur: 1.25 };
const inOut = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
export const needleX = (t) => { const k = Math.min(1, Math.max(0, (t - T.threadIn) / NEEDLE.dur)); return NEEDLE.x0 + (NEEDLE.x1 - NEEDLE.x0) * inOut(k); };
export function stitchTimes() {
  const x0 = (1920 - (WALL.COLS * WALL.CW + (WALL.COLS - 1) * WALL.GAP)) / 2;
  return Array.from({ length: WALL.COLS }, (_, c) => {
    const x = x0 + c * (WALL.CW + WALL.GAP) + WALL.CW / 2;
    let a = T.threadIn, b = T.threadIn + NEEDLE.dur;
    for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (needleX(m) < x) a = m; else b = m; }
    return +((a + b) / 2).toFixed(3);
  });
}
