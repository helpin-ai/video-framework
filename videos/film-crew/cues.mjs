// Sound-effect cues for "The crew", from the voice timings in vo.json. Re-run after bin/vo.mjs.
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const VO = JSON.parse(fs.readFileSync(path.join(dir, 'vo.json'), 'utf8'));
const LN = Object.fromEntries(VO.lines.map((l) => [l.id, l]));
const S = (id) => LN[id].start, W = (id, i = 0) => LN[id].words[i].s;
const WP = (id, p) => (LN[id].words.find((w) => w.w.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(p)) || LN[id].words[0]).s;
const CREW = ['echo', 'atlas', 'scribe', 'forge', 'lens', 'quill', 'beacon', 'mira'];
const A = CREW.map((c) => S(c) - 0.5);
const r = (x) => +x.toFixed(3);
const cues = {
  gather: [W('meet') - 0.2],
  wipe: [...A.map((a) => a + 0.02), S('share') - 0.48],
  name: A.map((a) => a + 0.25),
  pop: [W('echo', 3) - 0.1, WP('echo', 'help') - 0.15, W('echo', 11) - 0.1, WP('echo', 'bring') - 0.1, WP('atlas', 'plan') - 0.35, WP('forge', 'opens') - 0.1, WP('beacon', 'followup') - 0.3, WP('mira', 'into') - 0.2],
  sticky: [0, 1, 2].map((i) => WP('atlas', 'customer') - 0.2 + i * 0.15),
  tick: [...[0, 1, 2, 3].map((i) => WP('atlas', 'plan') + 0.25 + i * 0.15), ...[0, 1, 2, 3].map((i) => WP('scribe', 'details') + 0.15 + i * 0.22), ...[0, 1, 2].map((i) => WP('mira', 'launch') + 0.45 + i * 0.18)],
  typing: [WP('forge', 'writes')],
  testdots: [WP('forge', 'runs') + 0.1],
  scan: [WP('lens', 'looks') - 0.1],
  flag: [WP('lens', 'risks'), WP('lens', 'missing')],
  scribble: [WP('quill', 'prepares')],
  chime: [WP('atlas', 'review'), WP('scribe', 'begins'), WP('quill', 'updates'), WP('beacon', 'ready')],
  swoosh: [WP('mira', 'launch') - 0.1],
  comet: [WP('share', 'history') - 0.1],
  click: [WP('share', 'act')],
  approve: [WP('share', 'act') + 0.05],
  sparkle: [WP('own', 'build'), W('end') - 0.2],
};
const sounds = {
  gather: { text: 'soft magical swish as small dots gather into a row, light and playful', duration: 1.0, gain: -14 },
  wipe: { text: 'quick bright whoosh with a soft round pop, a burst of colour filling the screen', duration: 0.7, gain: -12 },
  name: { text: 'short soft snap, a title landing', duration: 0.5, gain: -17 },
  pop: { text: 'soft bubbly UI pop', duration: 0.5, gain: -16 },
  sticky: { text: 'light paper sticky note slap', duration: 0.5, gain: -16 },
  tick: { text: 'tiny crisp soft UI tick', duration: 0.5, gain: -19 },
  typing: { text: 'short soft burst of quiet keyboard typing', duration: 0.8, gain: -19 },
  testdots: { text: 'quick rising run of tiny soft beeps, tests passing', duration: 1.0, gain: -17 },
  scan: { text: 'soft whooshing glass sweep, a magnifier gliding', duration: 1.2, gain: -17 },
  flag: { text: 'short soft warning blip', duration: 0.5, gain: -15 },
  scribble: { text: 'quick pen strike-through on paper, soft', duration: 0.5, gain: -17 },
  chime: { text: 'short warm two-note chime, soft and friendly', duration: 0.7, gain: -16 },
  swoosh: { text: 'smooth airy swoosh, notes flying into a card', duration: 0.7, gain: -15 },
  comet: { text: 'bright shimmering sparkle travelling left to right, delicate', duration: 1.0, gain: -17 },
  click: { text: 'crisp trackpad click', duration: 0.5, gain: -12 },
  approve: { text: 'short warm two-note success chime, soft', duration: 0.8, gain: -15 },
  sparkle: { text: 'soft warm shimmer, gentle, no impact', duration: 1.2, gain: -15 },
};
const file = path.join(dir, 'audio.json');
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
j.duration = VO.total; j.music.at(-1).length = r(VO.total - (j.music.at(-1).at || 0));
j.sounds = sounds;
j.cues = Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) }));
fs.writeFileSync(file, JSON.stringify(j, null, 2));
console.log(`${j.cues.reduce((n, c) => n + c.at.length, 0)} cues · ${VO.total} s`);
