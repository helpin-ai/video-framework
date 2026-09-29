// Sound for the Product Hunt film: the music leads (music-first, see timeline.js), and every effect sits on the
// track's own beats, where the picture has its impact. Writes audio.json.
import fs from 'node:fs';
import path from 'node:path';
import { B, N, DURATION, MUSIC } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => B(n));
const P = MUSIC.period;

const cues = {
  word: beats(N.support, N.projects, N.crm, N.meetings, N.docs),
  bounce: beats(2, 3, 6, 7, 13),
  spread: [B(N.scatter)],
  snap: beats(N.snap).map((t) => t + 0.02),
  windup: [B(N.windup)],
  drop: [B(N.drop)],
  letters: [B(N.word)],
  slam: [B(N.one)],
  chips: [B(N.mods)],
  hop: Array.from({ length: 7 }, (_, i) => B(N.relay + i)),
  check: [B(N.kept)],
  launch: [B(N.launch)],
  fall: [B(N.land)],
  agent: Array.from({ length: 8 }, (_, i) => B(N.agents + i * 2)),
  scribble: Array.from({ length: 4 }, (_, i) => B(N.agents + i * 2 + 1)),
  knob: [B(N.knob)],
  click: [B(N.approve)],
  success: [B(N.approve) + 0.04],
  whoosh3d: [B(N.oss) - 0.05],
  type: [B(N.install)],
  logo: beats(N.team, N.team + 1, N.team + 2, N.team + 3),
  tag: [B(N.tag), B(N.tag) + P * 0.5, B(N.tag) + P],
  zip: [B(N.tag)],
  plink: [B(N.end)],
  note: [B(N.end + 2)],
};
const sounds = {
  word: { text: 'a punchy soft pop, a bold word landing on screen', duration: 0.5, gain: -15 },
  bounce: { text: 'a tiny soft rubber ball bounce, short and light', duration: 0.5, gain: -19 },
  spread: { text: 'a quick paper whoosh, cards spreading apart', duration: 0.6, gain: -17 },
  snap: { text: 'three quick thin threads snapping, light plucky snaps', duration: 0.6, gain: -15 },
  windup: { text: 'a short rising swoosh, a ball winding up to jump', duration: 0.5, gain: -16 },
  drop: { text: 'a deep punchy impact with a bright shimmer, a ball slamming down and a logo appearing', duration: 1.2, gain: -11 },
  letters: { text: 'five quick soft letter taps', duration: 0.5, gain: -20 },
  slam: { text: 'a quick tight whoosh-thump as bold text snaps in', duration: 0.5, gain: -16 },
  chips: { text: 'five tiny bubbly pops in quick succession', duration: 0.6, gain: -19 },
  hop: { text: 'a soft rubber ball bounce with a tiny wooden click', duration: 0.5, gain: -17 },
  check: { text: 'soft bright check-mark ding, satisfying', duration: 0.5, gain: -17 },
  launch: { text: 'a springy boing, a ball launched high into the air', duration: 0.6, gain: -15 },
  fall: { text: 'a short falling whistle ending just before an impact', duration: 0.5, gain: -18 },
  agent: { text: 'a fast whoosh-snap, a bold colourful card cutting in', duration: 0.5, gain: -15 },
  scribble: { text: 'a quick marker pen scribble on paper', duration: 0.5, gain: -21 },
  knob: { text: 'a smooth toggle switch sliding with a soft click', duration: 0.5, gain: -15 },
  click: { text: 'crisp trackpad click', duration: 0.5, gain: -12 },
  success: { text: 'short warm two-note success chime, soft', duration: 0.8, gain: -16 },
  whoosh3d: { text: 'a deep airy swoosh, a camera flying around big 3D letters', duration: 1.0, gain: -15 },
  type: { text: 'fast soft typing on a mechanical keyboard for one and a half seconds', duration: 1.5, gain: -18 },
  logo: { text: 'a soft bouncy thud, a card landing with a little bounce', duration: 0.5, gain: -16 },
  tag: { text: 'a soft punchy pop, a word landing', duration: 0.5, gain: -17 },
  zip: { text: 'a smooth pen stroke drawing a long line, soft swish', duration: 0.9, gain: -18 },
  plink: { text: 'a bright playful plink, a ball landing perfectly on top of a letter, with a soft sparkle', duration: 1.0, gain: -12 },
  note: { text: 'a quick marker pen scribble on paper', duration: 0.5, gain: -20 },
};
const PROMPT = 'Energetic, bouncy, playful modern electronic at exactly 120 BPM for a product launch motion graphics video: a punchy kick on every beat, snappy claps, rubbery plucked bass, bright marimba-like plucks and playful percussion hits; crisp, clean and joyful. No vocals and no long silences. It starts immediately with a sparse pulse and quick hits for the first 8 seconds, then a big drop at 8 seconds into a full bouncing groove, an extra lift at 22 seconds, the fullest part from 30 seconds, and it winds down cleanly in the last 3 seconds without a big final hit.';
const audio = {
  name: 'ph-launch',
  duration: DURATION,
  video: '../../out/ph-launch/ph-launch.mp4',
  master: { lufs: -14, fadeOut: 1.0 },
  // The candidate chosen for its shape (bin/beats.mjs): hits in bars 1–4, the drop at 8.05 s, the last hit at 32.01 s.
  music: [{ at: 0, length: DURATION, generate: 40, from: 0, gain: -4, fadeIn: 0.01, fadeOut: 1.5, prompt: PROMPT }],
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues`);
