// Sound for "Helpin vs Jira: out of the backlog". Music-first (see timeline.js): every effect sits on the picture's own
// events, which sit on the track's beats. No voice. Writes audio.json.
//   node videos/cmp-jira/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, N, MUSIC, DURATION } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => B(n));
const INS = [6, 7, 7.5, 8, 8.5, 8.75, 9];     // the inserts you can still see (the rest stream past)

const cues = {
  type: [B(N.reply) + 0.1, B(N.oss) + 0.35, B(N.oss + 2.8)],
  drop: [B(N.drop0)],
  row: beats(...INS),
  sink: [B(N.sink) + 0.2],
  word: [...beats(N.quote, N.quote + 1, N.split, N.tag2), B(N.tag) - 0.25],
  tile: beats(...N.tiles),
  snip: [B(17)],
  plate: [B(N.plate)],
  relay: Array.from({ length: 7 }, (_, u) => B(N.lights) + u * 0.18),
  swell: [B(21.2)],
  up: [B(N.drop) - 0.05],
  bloom: [B(N.drop) + 0.1],
  whoosh: [B(N.task), B(N.pr) - 0.2, B(N.told) - 0.2, B(N.ws) - 0.2, B(N.oss) - 0.2, B(N.tag) - 0.15],
  check: beats(N.rows, N.rows + 0.5, N.rows + 1),
  ride: [B(N.pr) - 0.35, B(N.told) - 0.1],
  // live previews: the pull request opens, the follow-up is sent
  chime: [B(N.pr) + 2.2, B(N.told) + 1.43, B(N.ws + 3)],
  tap: [0, 1, 2, 3, 4].map((i) => B(N.ws + 0.5 + i * 0.5) + 0.12),
  pop: beats(N.ws + 4, N.cta, N.cta + 0.5),
  enter: [B(N.run)],
  logo: [B(N.mark) - 0.3],
};

const sounds = {
  type: { text: 'a short burst of quick soft typing on a laptop keyboard', duration: 1.0, gain: -21 },
  drop: { text: 'a soft muffled thump, a card dropping into a list', duration: 0.5, gain: -17 },
  row: { text: 'a quick soft paper-like swipe, a list row sliding into place', duration: 0.5, gain: -24 },
  sink: { text: 'a slow low muffled descending whoosh, something sinking deep underwater, soft, no impact', duration: 3.2, gain: -19 },
  word: { text: 'a soft muted pop, a word landing on screen', duration: 0.5, gain: -23 },
  tile: { text: 'a soft wooden tap, a small card set down on a table', duration: 0.5, gain: -20 },
  snip: { text: 'a soft quick thread snipping sound, dotted lines breaking apart', duration: 0.6, gain: -21 },
  plate: { text: 'a soft metal plate sliding into place with a gentle click', duration: 0.7, gain: -20 },
  relay: { text: 'a tiny soft relay click, a small indicator light switching off', duration: 0.5, gain: -22 },
  swell: { text: 'a gentle airy rising swell building anticipation, soft and smooth, no hit at the end', duration: 2.0, gain: -17 },
  up: { text: 'a fast airy upward whoosh, something rising quickly from deep below, bright and soft', duration: 1.1, gain: -15 },
  bloom: { text: 'a soft warm shimmer bloom, light returning, gentle, no impact', duration: 1.4, gain: -19 },
  whoosh: { text: 'a soft airy whoosh as a card slides across the screen', duration: 0.6, gain: -22 },
  check: { text: 'a tiny bright soft check tick', duration: 0.5, gain: -19 },
  ride: { text: 'a quick soft zip, a small tag sliding across', duration: 0.5, gain: -22 },
  chime: { text: 'a short warm soft two-note success chime', duration: 0.8, gain: -18 },
  tap: { text: 'a soft satisfying click, a tile snapping into a grid', duration: 0.5, gain: -20 },
  pop: { text: 'a tiny soft bubbly pop', duration: 0.5, gain: -21 },
  enter: { text: 'a single soft mechanical keyboard enter key press', duration: 0.5, gain: -16 },
  logo: { text: 'a soft airy shimmer bloom, a logo appearing, gentle, no impact', duration: 1.2, gain: -19 },
};

// The candidate chosen for its shape (bin/beats.mjs): a quiet Rhodes intro, the band dropping on its beat 47.
// Same request as music.json bed 1 (generate 40 s), so the cached take is reused.
const bed = JSON.parse(fs.readFileSync(path.join(dir, 'music.json'), 'utf8')).music[1];
const audio = {
  name: 'cmp-jira',
  duration: DURATION,
  video: '../../out/cmp-jira/cmp-jira.mp4',
  master: { lufs: -14, fadeOut: 0.8 },
  music: [{ ...bed, generate: bed.length, at: 0, length: DURATION, from: MUSIC.from, gain: -4, fadeIn: 0.01, fadeOut: 0.6 }],
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues`);
