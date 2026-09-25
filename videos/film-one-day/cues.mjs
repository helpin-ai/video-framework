// Sound-effect cues for "One day", from the voice timings in vo.json. Re-run after bin/vo.mjs.
import fs from 'node:fs';
import path from 'node:path';
const dir = path.dirname(new URL(import.meta.url).pathname);
const VO = JSON.parse(fs.readFileSync(path.join(dir, 'vo.json'), 'utf8'));
const LN = Object.fromEntries(VO.lines.map((l) => [l.id, l]));
const S = (id) => LN[id].start, W = (id, i = 0) => LN[id].words[i].s;
const r = (x) => +x.toFixed(3);
const HOURS = ['ten', 'eleven', 'one', 'three', 'five', 'six'];
const cues = {
  alarm: [0.25],
  tick: HOURS.map((h) => S(h) - 0.3),
  scatter: [W('nine', 7) - 0.3],
  pull: [W('brief', 2) - 0.1],
  line: [W('brief', 5), W('brief', 6), W('brief', 9), W('brief', 10) + 0.2, ...[0, 1, 2, 3, 4].map((i) => W('five', 5) + i * 0.16)],
  msg: [0, 1, 2, 3, 4].map((i) => W('ten', 1) + i * 0.22),
  check: [...[0, 1, 2, 3].map((i) => W('ten', 6) + i * 0.3), ...[0, 1, 2].map((i) => W('three', 13) + i * 0.4)],
  handoff: [W('ten', 13) - 0.1],
  fly: [W('eleven', 8) - 0.1],
  pop: [W('eleven', 4), W('eleven', 6), W('eleven', 6) + 0.25, W('one', 10), W('one', 13), W('three', 7), W('five', 10)],
  owner: [0, 1, 2].map((i) => W('eleven', 12) + i * 0.2),
  morph: [W('one', 5) - 0.1],
  click: [W('one', 17)],
  success: [W('one', 17) + 0.05],
  stamp: [W('three', 2)],
  scribble: [W('three', 4)],
  swell: [S('six') - 0.3],
  sparkle: [S('end') - 0.1],
  soft: HOURS.map((h) => S(h) - 0.1),
  morning: [0.0],
  office: [S('six') - 0.3],
};
const sounds = {
  alarm: { text: 'gentle soft morning chime, two warm notes, like a friendly alarm', duration: 1.0, gain: -14 },
  tick: { text: 'soft mechanical clock tick-tock flip, a clock rolling to the next hour', duration: 0.6, gain: -15 },
  scatter: { text: 'playful scattered pops and swishes, app windows popping up all over', duration: 1.0, gain: -16 },
  pull: { text: 'smooth magical swoosh pulling things together into one place', duration: 1.0, gain: -14 },
  line: { text: 'tiny soft UI tick', duration: 0.5, gain: -19 },
  msg: { text: 'soft warm chat message notification pop', duration: 0.5, gain: -18 },
  check: { text: 'soft bright check-mark ding, satisfying', duration: 0.5, gain: -17 },
  handoff: { text: 'smooth light whoosh of a card sliding across', duration: 0.6, gain: -15 },
  fly: { text: 'airy whoosh of notes flying into a board', duration: 0.8, gain: -15 },
  pop: { text: 'soft bubbly UI pop', duration: 0.5, gain: -17 },
  owner: { text: 'tiny soft plop, an avatar landing', duration: 0.5, gain: -18 },
  morph: { text: 'soft magical morph whoosh, a card transforming', duration: 0.8, gain: -15 },
  click: { text: 'crisp trackpad click', duration: 0.5, gain: -12 },
  success: { text: 'short warm two-note success chime, soft', duration: 0.8, gain: -15 },
  stamp: { text: 'satisfying rubber stamp thump on paper', duration: 0.5, gain: -12 },
  scribble: { text: 'quick pen strike-through on paper, soft', duration: 0.5, gain: -17 },
  swell: { text: 'warm soft evening synth swell, calm and glowing', duration: 2.0, gain: -14 },
  sparkle: { text: 'soft twinkling night-sky shimmer, gentle, no impact', duration: 1.5, gain: -14 },
  soft: { text: 'soft airy whoosh, gentle and smooth, a screen dissolving into the next', duration: 0.8, gain: -18 },
  morning: { text: 'quiet early morning kitchen ambience, soft birdsong outside a window, a laptop lid opening', duration: 4.0, gain: -17 },
  office: { text: 'quiet office winding down in the evening, soft distant chatter, a laptop closing, a chair rolling back', duration: 4.5, gain: -19 },
};
const file = path.join(dir, 'audio.json');
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
j.duration = VO.total; j.music.at(-1).length = r(VO.total - (j.music.at(-1).at || 0));
j.sounds = sounds;
j.cues = Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) }));
fs.writeFileSync(file, JSON.stringify(j, null, 2));
console.log(`${j.cues.reduce((n, c) => n + c.at.length, 0)} cues · ${VO.total} s`);
