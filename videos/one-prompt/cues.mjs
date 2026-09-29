// Sound for "One prompt": the music leads (music-first, see timeline.js) and every effect sits on the picture's own
// events, which sit on the track's beats. No voice. Writes audio.json.
//   node videos/one-prompt/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, N, DURATION } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => B(n));
const range = (a, b, step = 1) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => a + i * step);

const cues = {
  // hook: each line streams, each bracket note prints
  stream: [...beats(N.hook, N.bills, N.zero, N.dots + 0.3, N.hollow, N.red, N.hub, N.price, N.price + 1),
    B(N.five) + 0.15, B(N.workspace) + 0.18, B(N.drop) + 0.75, B(N.end) + 1.05],
  note: [...beats(N.hook + 1, N.bills + 1, N.zero + 1, N.touch, N.handoff + 2, N.seats, N.agents, N.cant, N.done),
    B(N.seatRoll) + 0.1, B(N.sub), B(N.price + 3), B(N.click) + 0.3],
  // 1 → 5 tools
  roll: [...beats(N.roll, N.roll + 1, N.roll + 2, N.roll + 3), ...beats(N.count, N.count + 1, N.count + 2, N.count + 3)],
  tile: range(0, 9).map((i) => B(N.touch + Math.floor(i / 2)) + (i % 2) * 0.12),
  grey: [B(N.grey)],
  // the hand-off window
  window: [B(N.handoff) - 0.04, B(N.agents) - 0.04, B(N.demo) - 0.04],
  check: beats(N.handoff + 1, N.handoff + 2),
  click: [B(N.handoff + 4), B(N.click)],
  wait: [B(N.handoff + 4) + 0.1],
  shrink: [B(N.handoffOut)],
  // the dot matrix
  dotsIn: [B(N.dots)],
  hollow: [B(N.hollow)],
  redSweep: [B(N.red)],
  dotsOut: [B(N.dotsOut)],
  // seats
  counter: [B(N.seatRoll), B(N.price + 2.2)],
  word: [...beats(N.every, N.every + 1, N.every + 2, N.row, N.price + 2, N.button)],
  // the agent can't reach the tools
  type: [B(N.agents + 0.6), B(N.demo) + 0.35],
  connect: [B(N.connect)],
  snap: [B(N.snap)],
  error: [B(N.cant + 0.5)],
  // the quiet: the caret blinks on the beat
  blink: range(N.cant + 2, N.count - 1).map((n) => B(n)),
  hum: [B(N.cant + 0.5)],
  // the build: tools fly into the caret, "tools." deletes, "workspace." types
  absorb: [...[0, 1, 2, 3].map((i) => B(N.count + i) + 0.2), B(N.workspace) + 0.5],
  swell: [B(N.count - 2)],
  backspace: [B(N.workspace)],
  // the drop
  drop: [B(N.drop)],
  chip: range(0, 4).map((i) => B(N.chips + i * 0.5)),
  // the hub
  client: range(0, 3).map((i) => B(N.clients + i * 0.5)),
  flow: [B(N.flow)],
  // one prompt
  call: range(0, 3).map((i) => B(N.calls + i * N.callGap)),
  light: [B(N.calls) + 0.2],
  fly: [B(N.badge) + 0.1],
  success: [B(N.done)],
  // pricing and the end
  lock: [B(N.price + 2.5)],
  ring: [B(N.end)],
};

const sounds = {
  stream: { text: 'a quick soft burst of typing on a quiet laptop keyboard', duration: 0.6, gain: -21 },
  note: { text: 'three tiny soft mechanical clicks, a small label printing', duration: 0.5, gain: -25 },
  roll: { text: 'a quick mechanical counter flip, a single crisp click-clack', duration: 0.5, gain: -17 },
  tile: { text: 'a soft bubbly pop, a small app icon appearing', duration: 0.5, gain: -20 },
  grey: { text: 'a soft low deflating whoosh, colour draining away', duration: 0.8, gain: -20 },
  window: { text: 'a soft airy whoosh as a card slides up into place', duration: 0.6, gain: -19 },
  check: { text: 'a tiny soft tick, a checkbox being checked', duration: 0.5, gain: -19 },
  click: { text: 'crisp soft trackpad click', duration: 0.5, gain: -14 },
  wait: { text: 'a small dull soft error bonk', duration: 0.5, gain: -21 },
  shrink: { text: 'a quick soft suck-in whoosh, a window shrinking to a point', duration: 0.5, gain: -19 },
  dotsIn: { text: 'a quick sparkly digital shimmer sweep, hundreds of tiny dots appearing', duration: 1.0, gain: -18 },
  hollow: { text: 'a soft descending digital sweep, lights emptying out', duration: 0.8, gain: -19 },
  redSweep: { text: 'a low soft digital buzz sweep, a warning tone', duration: 0.8, gain: -21 },
  dotsOut: { text: 'a quick reverse shimmer, dots vanishing', duration: 0.6, gain: -20 },
  counter: { text: 'a fast mechanical counter spinning up, rapid light ticking for one and a half seconds', duration: 1.5, gain: -20 },
  word: { text: 'a soft punchy pop, a bold word landing on screen', duration: 0.5, gain: -17 },
  type: { text: 'steady soft typing on a laptop keyboard for one and a half seconds', duration: 1.6, gain: -21 },
  connect: { text: 'a few quick soft digital blips, a connection trying to reach a server', duration: 1.0, gain: -22 },
  snap: { text: 'a short soft electric error buzz, a connection breaking', duration: 0.5, gain: -17 },
  error: { text: 'a soft two-tone low error beep', duration: 0.6, gain: -19 },
  blink: { text: 'a single soft muted clock tick', duration: 0.5, gain: -17 },
  hum: { text: 'a sustained low synth drone pad, dark and tense, steady and clearly audible, no melody, no rhythm', duration: 5.0, gain: -16 },
  absorb: { text: 'a quick soft whoop, a small card being sucked into a point', duration: 0.5, gain: -18 },
  swell: { text: 'a gentle airy rising swell building anticipation, soft and smooth, no hit at the end', duration: 3.5, gain: -21 },
  backspace: { text: 'three quick soft keyboard backspace taps', duration: 0.5, gain: -20 },
  drop: { text: 'a bright soft shimmer bloom with a deep soft thump, a logo appearing', duration: 1.2, gain: -15 },
  chip: { text: 'a tiny soft bubbly pop', duration: 0.5, gain: -21 },
  client: { text: 'a soft bouncy thud, a small card landing', duration: 0.5, gain: -18 },
  flow: { text: 'a smooth digital whoosh with tiny blips flowing into a hub', duration: 1.0, gain: -19 },
  call: { text: 'a tiny bright digital blip, a quick computer confirmation', duration: 0.5, gain: -18 },
  light: { text: 'a quick sparkly twinkle, many small lights turning on', duration: 0.8, gain: -19 },
  fly: { text: 'a quick soft whoosh of many small particles flying together', duration: 0.7, gain: -19 },
  success: { text: 'a short warm two-note success chime, soft', duration: 0.8, gain: -16 },
  lock: { text: 'a small soft lock click', duration: 0.5, gain: -19 },
  ring: { text: 'a soft airy shimmer, a ring expanding', duration: 1.0, gain: -20 },
};

// The candidate chosen for its shape (bin/beats.mjs): full from 8.1 s, near silence around 28 s, the drop at 31.6 s.
// Same request as out/one-prompt/music-candidates.json bed 1, so the cached take is reused.
const PROMPT = 'Modern minimal tech-house at exactly 120 BPM for a sleek product launch motion graphics film about AI agents: crisp clicky hi-hats, a tight kick, deep sub bass, glassy digital plucks and small glitchy blips; clean, precise and confident. No vocals. It starts immediately with a tight ticking pulse (0 to 12 seconds, curious and slightly tense), builds with claps and a rolling bassline from 12 seconds, rises with a filter sweep from 20 seconds, stops for one beat at 25.5 seconds, then drops at 26 seconds into a bright, full, uplifting groove with warm chords that carries all the way to the end, with a lift at 38 seconds. It ends cleanly on a downbeat at 54 seconds with no big final hit and no fade.';
const audio = {
  name: 'one-prompt',
  duration: DURATION,
  video: '../../out/one-prompt/one-prompt.mp4',
  master: { lufs: -14, fadeOut: 0.8 },
  music: [{ at: 0, length: DURATION, generate: 54, from: 0, gain: -4, fadeIn: 0.01, fadeOut: 1.2, prompt: PROMPT }],
  sounds,
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) })),
};
fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1));
console.log(`audio.json: ${Object.keys(sounds).length} sounds, ${Object.values(cues).flat().length} cues`);
