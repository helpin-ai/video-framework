// Sound for "Everywhere": four music beds cut with the picture's acts (timeline.js), and every effect sits
// on the same grid the picture animates on. Writes audio.json. Re-run after changing
// timeline.js, then `npm run audio -- videos/launch-everywhere/audio.json`.
import fs from 'node:fs';
import path from 'node:path';
import { T, DURATION, STAMP, stitchTimes } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const seq = (a, n, step) => Array.from({ length: n }, (_, i) => a + i * step);
const VO = JSON.parse(fs.readFileSync(path.join(dir, 'vo.json'), 'utf8'));
const LN = Object.fromEntries(VO.lines.map((l) => [l.id, l]));
const wordAt = (id, prefix) => (LN[id].words.find((w) => w.w.toLowerCase().startsWith(prefix)) || LN[id].words[0]).s;

// Four beds cut with the picture: the seams sit on hard cuts (the drop on the mark, the dark cards, the team).
// `from` skips each bed's lead-in so its first beat lands on the grid (measured with bin/beats.mjs: 120.2 BPM).
const STYLE = 'Modern minimal electronic at exactly 120 BPM in A minor, a premium tech product launch: crisp tight drums, round sub bass, plucked synths, airy pads, clean and confident. No vocals.';
const BEDS = [
  { at: 0, length: T.knot, generate: 12, from: 0.275, fadeIn: 0.02, fadeOut: 0.04,
    prompt: `${STYLE} The intro: it starts immediately, sparse and tense, with muted plucked hits on the beat over a soft sub-bass pulse; hi-hats creep in and it builds steadily with a rising filter sweep that peaks at the very end, ready for a drop. No silence at the start.` },
  { at: T.knot, length: T.oss - T.knot, generate: 27, from: 0.08, fadeIn: 0.01, fadeOut: 0.03,
    prompt: `${STYLE} It starts immediately at full groove on the first beat, like a drop: punchy kick, round bass and bouncing plucks, playful and driving, steady energy with small variations. No breaks, no build-downs and no ending.` },
  { at: T.oss, length: T.team - T.oss, generate: 10, from: 0.03, fadeIn: 0.01, fadeOut: 0.03,
    prompt: `${STYLE} Stripped back and dramatic: only deep sub-bass hits and a clap on the beat, with space between them. It starts immediately with a hit on the first beat.` },
  { at: T.team, length: DURATION - T.team, generate: 14, from: 0.03, fadeIn: 0.01, fadeOut: 1.5,
    prompt: `${STYLE} It starts immediately at full groove on the first beat, warm and uplifting, with a soft pad opening up. In the last four seconds the drums drop out and the pad settles gently. No final hit.` },
];

const cues = {
  cut: [T.cut1, T.cut2, T.cut3, T.cut4],
  msg: [T.cut1 + 0.15, T.cut2 + 0.15, T.cut3 + 0.15, T.cut4 + 0.25],
  shatter: [T.shatter],
  cascade: [T.shatter + 0.12],
  thread: [T.threadIn],
  stitch: stitchTimes(),
  tilt: [T.tilt],
  collapse: [T.collapse],
  mark: [T.knot],
  letters: [T.word],
  blip: [T.markOut + 0.2],
  tick: [...seq(T.mods, 5, 0.25), ...seq(T.echo + 1.1, 3, 0.15)],
  draw: [T.bar],
  type: [T.typeA],
  enter: [T.enter],
  burst: [T.enter + 0.02],
  fly: [T.enter + 0.12],
  bead: seq(T.settle + 0.32, 7, 0.12),
  pop: [T.agents + 0.3, T.agents + 0.45, T.agents + 0.6, T.agents + 0.75,
    wordAt('team', 'contentstudio'), wordAt('team', 'usermaven'), wordAt('team', 'usermaven') + 0.35, wordAt('team', 'usermaven') + 0.55],
  handoff: [T.relay, T.echo, T.forge, T.lens, T.quill],
  stamp: [T.echo + STAMP.echo, T.forge + STAMP.forge, T.lens + STAMP.lens, T.quill + STAMP.quill],
  keys: [T.forge + 0.55],
  scan: [T.lens + 0.1],
  check: seq(T.lens + 0.35, 3, 0.2),
  scribble: [T.quill + 0.35],
  knob: [T.knob - 0.05],
  click: [T.approve],
  success: [T.approve + 0.05],
  slam: [T.oss, T.servers],
  swoosh: [T.light, T.markOut, T.agents, T.gate, T.team, T.ball],
  digit: [T.team + 0.05],
  wind: [T.ball + 0.1],
  gather: [T.end],
  chime: [T.name - 0.05],
  rise: [T.giant],
};

const sounds = {
  cut: { text: 'a crisp hard cut in a film trailer: a soft camera shutter click with a short low thump', duration: 0.5, gain: -13 },
  shatter: { text: 'a photo breaking apart into dozens of small paper tiles, airy and light, not glass, not harsh', duration: 1.0, gain: -15 },
  cascade: { text: 'many small paper cards landing on a table in quick succession, soft taps', duration: 1.2, gain: -18 },
  thread: { text: 'a thread pulled fast through fabric, a soft rising zip', duration: 1.2, gain: -14 },
  stitch: { text: 'a single tiny soft plucked string, like a needle catching a thread', duration: 0.5, gain: -21 },
  tilt: { text: 'a deep airy whoosh, a huge sheet of paper rotating in the air', duration: 1.0, gain: -16 },
  collapse: { text: 'a reverse whoosh sucking everything into one point, ending in a soft tight thock', duration: 1.0, gain: -13 },
  mark: { text: 'a warm bright synth chime, an elegant logo reveal, short', duration: 1.5, gain: -13 },
  letters: { text: 'soft quick letter taps, like type setting into place, five light clicks', duration: 0.6, gain: -20 },
  blip: { text: 'a tiny soft round blip', duration: 0.5, gain: -18 },
  tick: { text: 'a tiny soft UI tick, very short', duration: 0.5, gain: -21 },
  draw: { text: 'a smooth pen stroke drawing a long line, soft swish', duration: 0.7, gain: -17 },
  type: { text: 'soft fast typing on a laptop keyboard for a second and a half', duration: 1.5, gain: -17 },
  enter: { text: 'a crisp keyboard enter key press', duration: 0.5, gain: -14 },
  burst: { text: 'a sparkly particle burst, airy shimmer spreading out', duration: 1.0, gain: -15 },
  fly: { text: 'a fast airy whoosh flying through space as cards rush past the camera', duration: 1.3, gain: -14 },
  bead: { text: 'a small soft wooden bead click onto a string', duration: 0.5, gain: -19 },
  pop: { text: 'soft bubbly UI pop', duration: 0.5, gain: -17 },
  msg: { text: 'a soft warm chat message notification pop', duration: 0.5, gain: -15 },
  handoff: { text: 'a smooth light whoosh of a card being passed across a table', duration: 0.6, gain: -17 },
  stamp: { text: 'a satisfying soft rubber stamp thump on paper', duration: 0.5, gain: -14 },
  keys: { text: 'three quick soft keyboard taps', duration: 0.5, gain: -19 },
  scan: { text: 'a soft electronic scan sweep, gentle', duration: 0.8, gain: -18 },
  check: { text: 'soft bright check-mark ding, satisfying', duration: 0.5, gain: -18 },
  scribble: { text: 'a quick pen strike-through on paper, soft', duration: 0.5, gain: -18 },
  knob: { text: 'a smooth toggle switch sliding across with a soft click at the end', duration: 0.6, gain: -15 },
  click: { text: 'crisp trackpad click', duration: 0.5, gain: -12 },
  success: { text: 'short warm two-note success chime, soft', duration: 0.8, gain: -16 },
  slam: { text: 'a deep soft bass thump with a short tail, bold text slamming onto a dark screen', duration: 0.8, gain: -11 },
  swoosh: { text: 'a clean short swoosh, a screen transition, smooth', duration: 0.6, gain: -19 },
  digit: { text: 'a heavy soft thud as a big number lands, with a tiny click', duration: 0.6, gain: -13 },
  wind: { text: 'a rope winding into a ball, a soft swirling whoosh that spins up', duration: 2.0, gain: -15 },
  gather: { text: 'a soft inward swoosh gathering everything to the centre, ends quietly', duration: 0.8, gain: -15 },
  chime: { text: 'a single warm soft bell tone with a long gentle tail, calm', duration: 2.0, gain: -15 },
  rise: { text: 'a soft airy rising swell, big letters rising into frame', duration: 1.5, gain: -17 },
};

const audio = {
  name: 'launch-everywhere',
  duration: DURATION,
  video: '../../out/launch-everywhere/launch-everywhere.mp4',
  master: { lufs: -14, fadeOut: 1.2 },
  voice: { from: 'vo.json', gain: 0, duck: { threshold: 0.03, ratio: 5, attack: 20, release: 380, sfx: false } },
  music: BEDS.map((b) => ({ gain: -5, ...b })),
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues, ${BEDS.length} music beds`);
