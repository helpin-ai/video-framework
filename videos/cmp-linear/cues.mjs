// Sound for "Helpin vs Linear: the customer attached". Music-first (see timeline.js): every effect sits on
// the picture's own events, which sit on the track's beats. No voice. Writes audio.json.
//   node videos/cmp-linear/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, N, MUSIC, DURATION } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => B(n));

const cues = {
  key: [...beats(0, 1, 2, 3, 3.5, 4, N.open), ...beats(N.s1, N.s2, N.s3, N.mcp)],
  row: beats(0, 1, 2).map((x) => x + 0.03),
  whoosh: [B(N.who) - 0.1, B(N.other), B(N.s1) - 0.2, B(N.s2) - 0.1, B(N.s3) - 0.1, B(N.chart) - 0.1, B(N.mcp) - 0.05, B(N.tag) - 0.1],
  type: [B(N.comment) + 0.1],
  word: beats(N.comment + 1, N.context, N.tells + 1, N.tag2),
  tick: [...beats(N.field, N.released, N.marker), B(N.s3) + 0.35],
  blip: [B(N.agent)],
  arrow: [B(N.arrow)],
  question: [B(N.arrow + 1.3)],
  swell: [B(N.tells) - 0.1],
  lift: [B(N.lift)],
  snap: [B(N.drop)],
  check: beats(N.rows, N.rows + 1, N.rows + 2),
  // live previews: Ask Agent links the task, the pull request opens, the follow-up is sent
  chime: [B(N.s1) + 1.35, B(N.s2) + 2.24, B(N.s3) + 1.4],
  ride: [B(N.s1) - 0.35, B(N.s2) - 0.1, B(N.s3) - 0.1],
  sweep: [B(N.draw)],
  plug: [B(N.plug)],
  flow: [B(N.plug) + 0.25],
  logo: [B(N.mark) - 0.3],
  pop: beats(N.cta, N.cta + 0.5),
};

const sounds = {
  key: { text: 'a single crisp mechanical keyboard key press, clicky and tactile, close up', duration: 0.5, gain: -15 },
  row: { text: 'a quick soft paper-like swipe, a list row sliding into place', duration: 0.5, gain: -23 },
  whoosh: { text: 'a soft airy whoosh as a card slides across the screen', duration: 0.6, gain: -21 },
  type: { text: 'a short burst of quick soft typing on a laptop keyboard', duration: 1.3, gain: -21 },
  word: { text: 'a soft muted pop, a word landing on screen', duration: 0.5, gain: -23 },
  tick: { text: 'a tiny crisp soft tick, a status changing', duration: 0.5, gain: -18 },
  blip: { text: 'a hollow soft low digital blip, something missing', duration: 0.5, gain: -19 },
  arrow: { text: 'a soft quick dotted ticking, a dashed line drawing across', duration: 0.7, gain: -23 },
  question: { text: 'a small soft questioning two-note blip, rising', duration: 0.5, gain: -19 },
  swell: { text: 'a gentle airy rising swell building anticipation, soft and smooth, no hit at the end', duration: 2.3, gain: -17 },
  lift: { text: 'a quick soft lifting whoosh, a card peeling off a surface', duration: 0.6, gain: -18 },
  snap: { text: 'a satisfying magnetic snap, a card clicking firmly into place, soft metallic', duration: 0.6, gain: -12 },
  check: { text: 'a tiny bright soft check tick', duration: 0.5, gain: -19 },
  chime: { text: 'a short warm soft two-note success chime', duration: 0.8, gain: -18 },
  ride: { text: 'a quick soft zip, a small tag sliding across', duration: 0.5, gain: -22 },
  sweep: { text: 'a smooth soft rising digital sweep, a line drawing across a chart', duration: 1.3, gain: -21 },
  plug: { text: 'a small soft plug clicking into a socket', duration: 0.5, gain: -14 },
  flow: { text: 'tiny soft digital blips flowing quickly along a cable', duration: 1.5, gain: -24 },
  logo: { text: 'a soft airy shimmer bloom, a logo appearing, gentle, no impact', duration: 1.2, gain: -19 },
  pop: { text: 'a tiny soft bubbly pop', duration: 0.5, gain: -21 },
};

// The candidate chosen for its shape (bin/beats.mjs): a keyboard-click intro, near silence on beats 27–30,
// the drop on its beat 31. Same request as music.json bed 0, so the cached take is reused.
const bed = JSON.parse(fs.readFileSync(path.join(dir, 'music.json'), 'utf8')).music[0];
const audio = {
  name: 'cmp-linear',
  duration: DURATION,
  video: '../../out/cmp-linear/cmp-linear.mp4',
  master: { lufs: -14, fadeOut: 0.8 },
  music: [{ ...bed, at: 0, length: DURATION, from: MUSIC.from, gain: -4, fadeIn: 0.01, fadeOut: 0.6 }],
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues`);
