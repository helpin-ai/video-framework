// Sound for "Solved. Still broken." (Helpin vs Zendesk): the music leads (see timeline.js) and every effect sits on
// the picture's own events, which sit on the track's beats. Paper sounds for the ticket world, clean digital ones
// for the product. No voice. Writes audio.json.
//   node videos/cmp-zendesk/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, FILE, N, SPLICES, DURATION } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const T = Object.fromEntries(Object.entries(N).map(([k, n]) => [k, B(n)]));
const MOVE = 0.55, P3 = 0.9, SPEED = 1.6;           // follow-through preview offset and speed (see index.html)
const at3 = (p) => (p - P3) / SPEED;                   // its own clock → seconds after landing
const SENT = at3(3.4), RELEASED = at3(1.1), DONE = 2.15;   // measured: Released ≈+0.12 s, Sent ≈+1.56 s

const cues = {
  // hook: the split
  seam: [T.seam],
  open: [T.open],
  card: [T.cards, T.cards + 0.1],
  pop: [T.reply, T.chip1, T.chip2, T.chip3, T.crm + 1.2, B(N.end + 3)],
  flip: [T.solved],
  stall: [T.stall],
  slide: [T.three],
  snap: [T.snap],
  word: [T.villain + 0.2, T.broken, T.one, T.chart + 0.35, T.tag + 0.15, T.loop],
  strike: [T.strike],
  swell: [T.drop - 1.65],
  slam: [T.drop],
  // the spine: a swoosh per camera move, a chime per node, ticks on the previews' own steps
  travel: [T.task - MOVE, T.pr - MOVE, T.told - MOVE, T.crm - MOVE, T.chart + 0.05],
  node: [T.task, T.pr, T.told, T.crm],
  tick: [T.task + 1.3, T.pr + 0.3, T.pr + 1.7, T.pr + 2.2, T.told + RELEASED, T.crm + 2.2, B(N.chart + 4)],
  done: [T.pr + 2.7, T.told + DONE + 0.8],
  sent: [T.told + SENT],
  fill: [T.told + DONE],
  // price, tagline, end
  draw: [B(N.chart + 1), B(N.chart + 2)],
  loop: [T.loop + 0.35],
  logo: [T.end + 0.2],
};

const sounds = {
  seam: { text: 'a soft quick pencil line drawn down a sheet of paper, a light swish', duration: 0.6, gain: -18 },
  open: { text: 'a soft airy paper whoosh, a page sliding open', duration: 0.6, gain: -19 },
  card: { text: 'a soft paper card sliding onto a desk, gentle', duration: 0.5, gain: -20 },
  pop: { text: 'a tiny soft bubbly UI pop', duration: 0.5, gain: -21 },
  flip: { text: 'a crisp soft click of a small switch flipping, clean UI sound', duration: 0.5, gain: -15 },
  stall: { text: 'a short soft low muted thunk, like a machine stalling, subtle', duration: 0.5, gain: -7 },
  slide: { text: 'a smooth airy whoosh, a panel sliding sideways', duration: 0.7, gain: -19 },
  snap: { text: 'three tiny soft paper tears in quick succession, delicate', duration: 0.6, gain: -17 },
  word: { text: 'a soft low whoosh-in, a word landing, cushioned, no impact', duration: 0.5, gain: -22 },
  strike: { text: 'a quick felt-tip marker stroke across paper', duration: 0.5, gain: -13 },
  swell: { text: 'a gentle rising airy noise swell building tension, no impact at the end', duration: 1.7, gain: -17 },
  slam: { text: 'two sliding doors meeting softly, a cushioned deep whoosh with a soft thud, not cinematic', duration: 0.8, gain: -16 },
  travel: { text: 'a quick smooth vertical camera swoosh, airy and clean', duration: 0.6, gain: -20 },
  node: { text: 'a soft clean glassy chime, single short note', duration: 0.8, gain: -9 },
  tick: { text: 'a tiny soft digital tick, a UI row appearing', duration: 0.5, gain: -19 },
  done: { text: 'a small soft success ding', duration: 0.6, gain: -17 },
  sent: { text: 'a soft bright two-note message sent chime', duration: 0.8, gain: -15 },
  fill: { text: 'a short smooth rising digital sweep, a progress bar filling', duration: 1.0, gain: -19 },
  draw: { text: 'a smooth soft digital line-drawing sweep, rising', duration: 1.2, gain: -20 },
  loop: { text: 'a quick felt-tip marker drawing a circle on paper', duration: 1.1, gain: -16 },
  logo: { text: 'a soft warm two-note chime, confident and clean, short', duration: 1.2, gain: -15 },
};

// The candidate chosen for its shape (bin/beats.mjs): filtered break for 16 beats, the filter opens on beat 16, full
// to beat 72. Same request as music-candidates.json bed 1 (cached take music-1-e3d68e0174b7ac56.mp3). The cache file
// name carries the bed index, so the take is also copied as music-0-… and music-2-… (identical request hash).
const PROMPT = 'Big beat breakbeat at exactly 128 BPM for a punchy product comparison motion graphics video: chopped funky drum breaks, a squelchy acid 303 bassline, short brassy synth stabs and a little vinyl scratch; gritty, confident and fun. No vocals. It starts immediately with the drum break playing under a heavy low-pass filter, muffled and tense (0 to 7.5 seconds), with a short rising swell at the end, then at 7.5 seconds the filter snaps open into the full, loud big beat groove with the acid bassline and stabs, gets even bigger at 18.75 seconds, and carries at full energy all the way to the end. It ends cleanly on a downbeat at 36 seconds with no big final hit, no breakdown and no fade.';
// Pieces of the one take, butt-spliced on beats (see timeline.js). The bed is also cut at the drop, where the file
// runs on continuously, so the filtered intro can sit 7 dB under the groove: loudnorm's dynamic mode lifts quiet
// sections, and without this the drop only read about 3 dB louder in the energy strip.
const DROP = { at: B(N.drop), from: FILE(N.drop - 4) };   // video beat 20 = file beat 16 (after the first splice)
const cuts = [{ at: 0, from: 0 }, { at: B(SPLICES[0].at), from: FILE(SPLICES[0].from) }, DROP, ...SPLICES.slice(1).map((s) => ({ at: B(s.at), from: FILE(s.from) }))];
const music = cuts.map((c, i) => ({
  at: r(c.at), from: r(c.from), length: r((cuts[i + 1]?.at ?? DURATION) - c.at), generate: 36, gain: c.at < DROP.at ? -11 : -4,
  fadeIn: 0.01, fadeOut: i === cuts.length - 1 ? 0.3 : 0.01, prompt: PROMPT,
}));

const audio = {
  name: 'cmp-zendesk',
  duration: DURATION,
  video: '../../out/cmp-zendesk/cmp-zendesk.mp4',
  master: { lufs: -14, fadeOut: 1.6, lra: 30 },   // a wide LRA keeps the filtered intro under the drop (loudnorm's dynamic mode)
  music,
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${music.length} music pieces, ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues`);
