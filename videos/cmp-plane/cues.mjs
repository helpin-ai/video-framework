// Sound for "Helpin vs Plane: every request lands". Music-first (see timeline.js): every effect sits on the
// picture's own events, which sit on the track's beats. No voice. Writes audio.json.
//   node videos/cmp-plane/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, N, MUSIC, DURATION } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => B(n));

const cues = {
  // paper planes gliding in, and the station planes
  glide: [B(N.p2) + 0.1, B(N.p3) + 0.1, B(4.5) + 0.1, B(N.where) - 0.1, ...N.landed.map((n) => B(n) - 0.9), ...beats(N.s1, N.s2, N.s3, N.s4).map((x) => x - 0.2), B(N.fly) - 0.05],
  land: [B(N.land), B(N.veer), ...N.landed.map((n) => B(n)), B(N.arrive)],
  unfold: [B(N.unfold)],
  crash: [B(N.crash)],
  tick: [...beats(N.blank, N.chipA, N.chipB, N.rowA, N.rowB), B(N.s3) + 0.9, B(N.s3) + 2.0],
  word: beats(N.miss + 1, N.where + 0.8, N.drop + 1, N.check + 1.2, N.tag2),
  chime: [B(N.lit), B(N.s1) + 1.35, B(N.s2) + 2.24, B(N.sent)],
  heard: [B(N.arrive) + 0.05],
  swell: [B(N.swell) - 0.2],
  check: N.ticks.map((n) => B(n)),
  logo: [B(N.mark) - 0.3],
  pop: beats(N.cta, N.note),
};

const sounds = {
  glide: { text: 'a soft airy whoosh of a paper plane gliding past, light and breezy', duration: 0.8, gain: -21 },
  land: { text: 'a soft light paper tap, a folded paper plane landing on a desk', duration: 0.5, gain: -19 },
  unfold: { text: 'a quick soft paper unfolding crinkle, a sheet opening flat', duration: 0.7, gain: -18 },
  crash: { text: 'a soft muffled paper crumple as a paper plane bumps into a wall', duration: 0.6, gain: -19 },
  tick: { text: 'a tiny crisp soft tick, a status changing', duration: 0.5, gain: -20 },
  word: { text: 'a soft muted pop, a word landing on screen', duration: 0.5, gain: -24 },
  chime: { text: 'a short warm soft two-note success chime', duration: 0.8, gain: -19 },
  heard: { text: 'a gentle bright bell-like ping, a message received, soft and warm', duration: 0.8, gain: -17 },
  swell: { text: 'a gentle airy rising swell building anticipation, soft and smooth, no hit at the end', duration: 2.2, gain: -18 },
  check: { text: 'a tiny bright soft check tick', duration: 0.5, gain: -19 },
  logo: { text: 'a soft airy shimmer bloom, a logo appearing, gentle, no impact', duration: 1.2, gain: -19 },
  pop: { text: 'a tiny soft bubbly pop', duration: 0.5, gain: -22 },
};

// The candidate chosen for its shape (bin/beats.mjs): music.json bed 0, a composition plan, so its cached take is
// found by hash at any bed index and any length. It plays from its beat 12; a second copy picks up the groove from
// its beat 36 at video beat 56, under the cut to the checklist.
const bed = JSON.parse(fs.readFileSync(path.join(dir, 'music.json'), 'utf8')).music[0];
const cut = B(MUSIC.loopAt);
const audio = {
  name: 'cmp-plane',
  duration: DURATION,
  video: '../../out/cmp-plane/cmp-plane.mp4',
  master: { lufs: -14, fadeOut: 0.8 },
  music: [
    { ...bed, at: 0, length: r(cut), from: MUSIC.from, gain: -4, fadeIn: 0.01, fadeOut: 0.06 },
    { ...bed, at: r(cut), length: r(DURATION - cut), from: MUSIC.loopFrom, gain: -4, fadeIn: 0.04, fadeOut: 0.6 },
  ],
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues`);
