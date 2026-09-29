// Sound for "Launch voices": the four people (their lip-synced cuts), the narrator (vo.json, pinned to the music's
// beats), a warm indie bed ducked under both, and a light touch of effects on the picture's events. Writes audio.json.
//   node videos/launch-voices/cues.mjs
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const VO = JSON.parse(fs.readFileSync(path.join(dir, 'vo.json'), 'utf8'));
const r = (x) => +x.toFixed(3);
const LN = Object.fromEntries(VO.lines.map((l) => [l.id, l]));
const WP = (id, p) => (LN[id].words.find((w) => w.w.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(p)) || LN[id].words[0]).s;
const S = (id) => LN[id].start;

// The cuts (cuts.json, shared with index.html), played at SPEED: each voice gets a pitch-preserving tempo change
// (ffmpeg atempo) to a new file, and the cut's in point and length scale with it, so the lips stay in sync.
const { speed: SPEED, cuts: CUTS } = JSON.parse(fs.readFileSync(path.join(dir, 'cuts.json'), 'utf8'));
const ROOT = path.resolve(dir, '../..');
const GAIN = { support: 0.5, engineer: -1.5, pm: 0.3, founder: -0.5 };
const faster = (id) => {
  const src = `out/launch-voices/cast/${id}-voice.mp3`;
  if (SPEED === 1) return src;
  const out = src.replace(/\.mp3$/, `-x${Math.round(SPEED * 100)}.wav`);
  if (!fs.existsSync(path.join(ROOT, out))) spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', path.join(ROOT, src), '-af', `atempo=${SPEED}`, '-c:a', 'pcm_s16le', path.join(ROOT, out)], { stdio: 'inherit' });
  return out;
};
let t = 0;
const clips = CUTS.map(([id, a, b]) => { const len = (b - a) / SPEED; const c = { file: faster(id), at: r(t), from: r(a / SPEED), trim: r(len), gain: GAIN[id] }; t += len; return c; });
const T_GRID = t;
const demos = ['echo', 'bugs', 'link', 'record', 'ships'].map((id) => S(id) - 0.35);

const cues = {
  cut: clips.slice(1).map((c) => c.at),
  grid: [T_GRID - 0.05],
  pop: [S('same') + 0.05, WP('same', 'split'), WP('same', 'split') + 0.45],
  reveal: [S('helpin') + 0.3],
  chip: ['support', 'projects', 'crm', 'meetings', 'docs'].map((w) => WP('helpin', w)),
  window: demos,
  type: [S('oss') - 0.35 + 0.8],
  check: [0, 1, 2, 3].map((i) => WP('end', 'whole') + i * 0.1),
  cta: [WP('end', 'try')],
};
const sounds = {
  cut: { text: 'a very soft short camera shutter click', duration: 0.5, gain: -26 },
  grid: { text: 'a soft airy whoosh as a video call grid opens', duration: 0.7, gain: -19 },
  pop: { text: 'a soft bubbly pop, a small card appearing', duration: 0.5, gain: -21 },
  reveal: { text: 'a warm soft shimmer, a logo appearing, gentle and bright', duration: 1.0, gain: -18 },
  chip: { text: 'a tiny soft wooden tick, a label snapping into place', duration: 0.5, gain: -22 },
  window: { text: 'a soft airy whoosh as an app window slides up', duration: 0.6, gain: -22 },
  type: { text: 'fast soft typing on a laptop keyboard for one and a half seconds', duration: 1.6, gain: -22 },
  check: { text: 'a tiny soft bright tick, a check mark appearing', duration: 0.5, gain: -22 },
  cta: { text: 'a soft warm two-note chime, friendly', duration: 0.8, gain: -19 },
};
// The bed chosen for its shape (bin/beats.mjs): soft under the four people, the full band from beat 31 (19.0 s),
// resolving from about 58 s. Same request as out/launch-voices/music-candidates.json bed 0, so the cached take is reused.
// The opening got shorter (tighter cuts, faster playback): the bed starts SHIFT seconds (five beats) in, and script.json's
// pins moved five beats earlier, so every line keeps its place on the music.
const SHIFT = +(5 * 60 / 99.4).toFixed(3);
const PROMPT = 'Bright, warm, optimistic indie pop instrumental for a startup launch video, like a Y Combinator launch: strummed acoustic guitar, hand claps, light snappy drums, warm electric piano and a plucky bass, around 100 BPM, human and upbeat. No vocals. It starts soft and intimate for the first 16 seconds (just guitar and light percussion, leaving room for people talking), lifts at 20 seconds into the full band with claps and a bright groove, stays warm and steady under a narrator until 64 seconds, then resolves gently on the tonic by 70 seconds, with no big final hit.';
const audio = {
  name: 'launch-voices',
  duration: VO.total,
  video: '../../out/launch-voices/launch-voices.mp4',
  master: { lufs: -14, fadeOut: 1.2 },
  music: [{ at: 0, length: VO.total, generate: 70, from: SHIFT, gain: -7, fadeIn: 0.01, fadeOut: 1.5, prompt: PROMPT }],
  voice: { from: 'vo.json', gain: 0, clips, duck: { threshold: 0.03, ratio: 6, attack: 15, release: 350 } },
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${clips.length} cast cuts, ${VO.lines.length} narrator lines, ${Object.values(cues).flat().length} effects`);
