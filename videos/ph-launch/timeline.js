// Music-first: the picture follows the track's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-0-ca8256eb91a488f1.mp3 --bpm 120 --json …
// 120.2 BPM, first beat at 0.06 s. Bars 1–4 go hit / rest / hit / hit (a louder pickup on the 16th beat),
// the drop lands on beat 16 (8.05 s), bar 8 has a two-beat gap (beats 29–30), bars 9–16 are the fullest,
// and beat 64 (32.01 s) is the last hit before the track fades out.
export const MUSIC = { bpm: 120.2, first: 0.06, period: 60 / 120.2 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of beat n (0-based)
export const DURATION = 35.5;

// Named beats (beat indices, not seconds).
export const N = {
  // intro: words land on the hits, the dot is each word's full stop
  support: 0, projects: 4, crm: 8, meetings: 10, docs: 11,
  scatter: 12, snap: 14, windup: 15,
  // the drop: one workspace
  drop: 16, word: 17, one: 18, mods: 19,
  // the relay: the dot hops card to card, drawing the thread
  relay: 20, kept: 27,
  // the gap: the dot hangs in the air
  launch: 28, hang: 29, land: 31,
  // agents, two beats each
  agents: 32,
  // control
  control: 48, knob: 49, request: 50, approve: 51,
  // open source, in 3D
  oss: 52, install: 53,
  // the team
  team: 56,
  // the tagline
  tag: 60,
  // the end: the dot lands on the i
  end: 64,
};
export const AGENTS = [
  { id: 'echo', name: 'Echo', role: 'Support agent', col: '#D4537E', dark: '#4B1528' },
  { id: 'forge', name: 'Forge', role: 'Code builder', col: '#534AB7', dark: '#26215C' },
  { id: 'lens', name: 'Lens', role: 'Code reviewer', col: '#BA7517', dark: '#412402' },
  { id: 'quill', name: 'Quill', role: 'Docs agent', col: '#185FA5', dark: '#0C2F52' },
  { id: 'beacon', name: 'Beacon', role: 'CRM operator', col: '#0F766E', dark: '#063B37' },
  { id: 'scribe', name: 'Scribe', role: 'Task planner', col: '#1D9E75', dark: '#04342C' },
  { id: 'atlas', name: 'Atlas', role: 'Epic planner', col: '#D85A30', dark: '#5A200C' },
  { id: 'mira', name: 'Mira', role: 'Marketer', col: '#E2554F', dark: '#5C1512' },
];
