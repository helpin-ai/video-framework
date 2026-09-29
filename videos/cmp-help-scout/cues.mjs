// Sound for "Past Send": the music leads (music-first, see timeline.js) and every effect sits on the picture's own
// events, which sit on the track's beats. No voice. Writes audio.json.
//   node videos/cmp-help-scout/cues.mjs
//
// The music is candidate 1 from music-candidates.json (cached as out/audio-cache/music-1-e2d3c9af25ad5d6d.mp3).
// Its first two bars play twice so the drop lands on the video's beat 24. audio.mjs has no way to place one cached
// bed twice (a bed's cache name includes its index), so both copies go in as finished clips (voice.clips, no ducking).
import fs from 'node:fs';
import path from 'node:path';
import { B, N, DURATION, REPEAT_AT } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const MUSIC = 'out/audio-cache/music-1-e2d3c9af25ad5d6d.mp3';
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => r(B(n)));

const sounds = {
  typing: { text: 'soft quiet typing on a laptop keyboard, one short sentence', duration: 1.5, gain: -21 },
  click: { text: 'crisp soft trackpad click', duration: 0.5, gain: -14 },
  sent: { text: 'a soft airy swoosh, an email being sent', duration: 0.6, gain: -18 },
  pull: { text: 'a slow soft airy whoosh, a camera pulling back through a room', duration: 1.2, gain: -17 },
  slide: { text: 'a paper card sliding quickly across a wooden desk, soft', duration: 0.6, gain: -16 },
  coin: { text: 'a tiny soft coin tick, bright and small', duration: 0.5, gain: -20 },
  pop: { text: 'a soft bubbly pop, a small round button appearing', duration: 0.5, gain: -22 },
  swell: { text: 'a gentle rising airy swell building up, no impact at the end', duration: 2.5, gain: -17 },
  snap: { text: 'a soft satisfying magnetic click, a card docking into place', duration: 0.5, gain: -16 },
  whoosh: { text: 'a soft short airy whoosh', duration: 0.5, gain: -21 },
  tick: { text: 'a tiny soft UI tick', duration: 0.5, gain: -22 },
  roll: { text: 'a quick soft mechanical counter rolling', duration: 1, gain: -20 },
  chime: { text: 'a soft bright bell chime, gentle and short', duration: 1, gain: -21 },
};

const cues = {
  typing: [{ at: r(B(N.type)), trim: 1.4 }],
  click: beats(N.press),
  sent: beats(N.sent),
  pull: [r(B(N.pull) - 0.08)],
  slide: beats(N.card1, N.card2, N.card3),
  coin: [0, 1, 2, 3, 4].map((j) => r(B(N.token + j))),
  pop: [...beats(N.avatars, N.strip), r(B(N.agents) + 1.7), r(B(N.totals)), r(B(N.totals + 0.5))],
  swell: [r(B(N.drop) - 2.5)],
  whoosh: [...beats(N.villain, N.drop, N.projects, N.crm, N.meetings, N.agents, N.receipt, N.docs, N.tag, N.end)].map((x) => r(x - 0.05)),
  snap: [...N.dock.map((n) => r(B(n) + 0.5)), r(B(N.land))],
  tick: [r(B(N.projects) + 1.1), r(B(N.crm) + 1.3), r(B(N.meetings) + 1.2), ...beats(N.rows, N.rows + 0.25, N.rows + 0.5, N.rows + 0.75, N.rows + 1.25)],
  chime: [r(B(N.projects) + 2.4), r(B(N.meetings) + 2.33), r(B(N.agents) + 1.45), r(B(N.counted) - 0.1)],
  roll: beats(N.verdict),
};
const slideDocs = { sound: 'slide', at: r(B(N.fly)), gain: -18 };

const audio = {
  name: 'cmp-help-scout',
  duration: DURATION,
  video: '../../out/cmp-help-scout/cmp-help-scout.mp4',
  master: { lufs: -14, fadeOut: 1.4 },
  music: [],
  sounds,
  cues: [
    ...Object.entries(cues).flatMap(([sound, list]) => list.map((c) => (typeof c === 'number' ? { sound, at: c } : { sound, ...c }))),
    slideDocs,
  ],
  voice: {
    lines: [],
    gain: -4,
    clips: [
      { file: MUSIC, at: 0, from: 0, trim: REPEAT_AT, fadeIn: 0.01, fadeOut: 0.03 },
      { file: MUSIC, at: REPEAT_AT, from: 0, trim: r(DURATION - REPEAT_AT), fadeIn: 0.02, fadeOut: 0.05 },
    ],
  },
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1) + '\n');
console.log(`wrote audio.json: ${audio.cues.length} cues, ${Object.keys(sounds).length} sounds`);
