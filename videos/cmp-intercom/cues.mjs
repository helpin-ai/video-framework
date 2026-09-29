// Sound for "Helpin vs Intercom: The meter". Music-first (see timeline.js): every effect sits on an event of the
// picture, and the picture sits on the bed's beats. No voice. Writes audio.json.
//   node videos/cmp-intercom/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, N, MUSIC, DURATION, trackTime } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const music = JSON.parse(fs.readFileSync(path.join(dir, 'music.json'), 'utf8'));
const r = (x) => +x.toFixed(3);
const T = Object.fromEntries(Object.entries(N).map(([k, v]) => [k, B(v)]));
const PER = B(1);
const seatAt = (i) => T.seats + PER * 0.5 * i;           // matches seatAt() - 0.12 in index.html (the face lands)
const ansDone = T.ai + 0.2 + ((5.0 - 0.3) / (5.4 - 0.3)) * (T.task - 0.35 - T.ai - 0.2); // "Answered with product knowledge"
const sent = T.follow + (3.2 - 1.6) / 1.3;                // "Helpin AI → Maya · Sent"

const cues = {
  typing: [T.chat + 0.25, T.fixQ + 0.1],
  pop: [T.answer, T.fixA, T.fixA + 0.3],
  clink: [T.resolved - 0.12, T.fixResolved],
  spin: [T.flood + 0.1],
  seat: Array.from({ length: 8 }, (_, i) => seatAt(i)),
  whoosh: [T.fix, T.villain, T.team, T.ai, T.task, T.follow, T.receipt],
  slide: [T.fixOut + 0.05],
  year: [T.year],
  swell: [T.drop - 2.4],
  rollback: [T.drop],
  bloom: [T.drop + 0.25],
  lock: [T.locked],
  faces: [T.team + 0.35, T.team20, T.team40],
  blip: [T.pr + 0.15, T.prOpen],
  chime: [ansDone, T.prOpen + 0.45, sent],
  paper: [T.receipt + 0.05],
  row: [...Array.from({ length: 4 }, (_, i) => T.receipt + 0.45 + i * PER * 0.5), ...Array.from({ length: 5 }, (_, i) => T.receipt + 0.6 + i * PER * 0.5)].sort((a, b) => a - b),
  counter: [T.verdict - 0.1],
  settle: [T.verdict + 1.0],
  word: [T.tag + 0.1, T.tag2],
  shimmer: [T.end],
  cta: [T.end + PER * 1.5],
};

const sounds = {
  typing: { text: 'quick soft typing on a quiet laptop keyboard', duration: 1.4, gain: -24 },
  pop: { text: 'a soft bubbly pop, a chat message appearing', duration: 0.5, gain: -21 },
  clink: { text: 'a single small bright coin clink with a crisp mechanical taxi meter click', duration: 0.5, gain: -15 },
  spin: { text: 'a mechanical taxi meter counter spinning faster and faster, rapid light clicking for two seconds', duration: 2.0, gain: -19 },
  seat: { text: 'a short crisp cash register key press, mechanical and light', duration: 0.5, gain: -21 },
  whoosh: { text: 'a soft airy whoosh, a screen sliding past', duration: 0.6, gain: -22 },
  slide: { text: 'a quick paper card sliding away across a desk', duration: 0.6, gain: -19 },
  year: { text: 'an old mechanical counter rolling steadily for four seconds, a long even rattle of small clicks', duration: 4.0, gain: -21 },
  swell: { text: 'a gentle airy rising swell building anticipation, soft and smooth, no hit at the end', duration: 2.5, gain: -21 },
  rollback: { text: 'a mechanical counter spinning quickly backwards, whirring down, then a soft solid click', duration: 1.2, gain: -15 },
  bloom: { text: 'a bright soft shimmer bloom, a logo appearing', duration: 1.2, gain: -19 },
  lock: { text: 'a small soft lock click', duration: 0.5, gain: -18 },
  faces: { text: 'a quick soft cluster of tiny bubbly pops, many small avatars appearing', duration: 0.8, gain: -20 },
  blip: { text: 'a tiny bright digital blip, a quick computer confirmation', duration: 0.5, gain: -21 },
  chime: { text: 'a short warm soft two-note success chime', duration: 0.8, gain: -18 },
  paper: { text: 'a soft paper receipt sliding out of a printer', duration: 0.8, gain: -20 },
  row: { text: 'a tiny soft tick', duration: 0.5, gain: -24 },
  counter: { text: 'a fast soft mechanical counter spinning for one second, light rapid clicks', duration: 1.1, gain: -20 },
  settle: { text: 'a warm soft chime with a gentle shimmer', duration: 1.0, gain: -18 },
  word: { text: 'a very soft short airy whoosh', duration: 0.5, gain: -24 },
  shimmer: { text: 'a soft airy shimmer, pieces clicking together into a logo', duration: 1.0, gain: -19 },
  cta: { text: 'a soft rounded pop, a button appearing', duration: 0.5, gain: -20 },
};

// Candidate 0 of music.json, chosen for its shape (bin/beats.mjs): the same request, so the cached take is reused.
const bed = music.music[0];
const seam = B(MUSIC.seam);
const audio = {
  name: 'cmp-intercom',
  duration: r(DURATION),
  video: '../../out/cmp-intercom/cmp-intercom.mp4',
  master: { lufs: -14, fadeOut: 1.2 },
  music: [
    { at: 0, length: r(seam + 0.03), generate: 38, from: trackTime(MUSIC.fromBeat), gain: -4, fadeIn: 0.01, fadeOut: 0.03, prompt: bed.prompt },
    { at: r(seam), length: r(DURATION - seam), generate: 38, from: trackTime(MUSIC.seamFromBeat), gain: -4, fadeIn: 0.03, fadeOut: 0.3, prompt: bed.prompt },
  ],
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues, ${r(DURATION)} s`);
