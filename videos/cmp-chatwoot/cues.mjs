// Sound for "Helpin vs Chatwoot: Open all the way". Music-first (see timeline.js): every effect sits on the picture's
// own events, which sit on the track's beats. No voice. Writes audio.json.
//   node videos/cmp-chatwoot/cues.mjs
import fs from 'node:fs';
import path from 'node:path';
import { B, N, DURATION, FROM, FROM2 } from './timeline.js';

const dir = path.dirname(new URL(import.meta.url).pathname);
const r = (x) => +x.toFixed(3);
const beats = (...ns) => ns.map((n) => B(n));
const bed = JSON.parse(fs.readFileSync(path.join(dir, 'music/b.json'), 'utf8')).music[0];
// The chosen candidate's exact request (styles, avoid, sections), so the cached clip is reused.
const request = { styles: bed.styles, avoid: bed.avoid, sections: bed.sections };

const cues = {
  // terminals: commands type, lines print
  stream: [B(N.cmd), B(N.cmd1), B(N.cmd2)],
  blip: [...beats(N.lines, N.lines + 0.5, N.lines + 1, N.lines + 1.5, N.running, N.verified, N.open)],
  // the corridor: the camera dollies in and pans, doors swing, locks snap
  pan: [B(N.hall) - 0.1, B(N.lockPan), B(N.projPan)],
  door: [...beats(N.door1, N.door2, N.door3, N.projOpen)],
  padlock: [...beats(N.aiLock, N.ssoLock)],
  chip: [...beats(N.aiLock + 0.5, N.ssoLock + 0.5, N.projOpen + 1.1, N.providers, N.providers + 0.5, N.providers + 1, N.providers + 1.5, N.endCta)],
  pull: [B(N.villain)],
  word: [...beats(N.villainLine, N.agpl, N.verdict, N.tag2), B(N.tag) - 0.1],
  // the build into the drop, then every door at once
  swell: [r(B(N.drop) - 3.5)],
  cascade: [B(N.drop)],
  // stations: windows slide in, the spotlight lands on each step
  window: [...beats(N.agents, N.pr, N.crm), B(N.receipt) - 0.12, B(N.receipt + 0.5) - 0.12],
  check: [...beats(N.shot1, N.shot2, N.pr, N.prDiff, N.prShot, N.crmDeal, N.crmMeeting)].map((t) => r(t + 0.55)),
  // the pull request opens in the preview (its own clock: 3 s at 1.1× from prPreview)
  success: [r(B(N.prPreview) + 3 / 1.1), B(N.helpinZero)],
  // the receipt counts up
  counter: [...beats(N.rivalCount, N.yearCount)],
  // the end card
  ring: [r(B(N.end) - 0.3)],
};

const audio = {
  name: 'cmp-chatwoot',
  duration: DURATION,
  video: '../../out/cmp-chatwoot/cmp-chatwoot.mp4',
  master: { lufs: -14, fadeOut: 0.9 },
  music: [
    // Candidate B from source beat 4, so its drop (source beat 32) lands on video beat 28.
    { at: 0, length: r(B(N.tag) + 0.03), from: FROM, gain: -4, fadeIn: 0.01, fadeOut: 0.04, ...request },
    // The same clip's full groove (from source beat 36) takes over on the tagline cut and rides out.
    { at: B(N.tag), length: r(DURATION - B(N.tag) + 0.1), from: FROM2, gain: -4, fadeIn: 0.02, fadeOut: 1, ...request },
  ],
  sounds: {
    stream: { text: 'a quick soft burst of typing on a quiet laptop keyboard', duration: 0.6, gain: -21 },
    blip: { text: 'a tiny soft 8-bit square-wave blip, a retro terminal line printing', duration: 0.5, gain: -24 },
    pan: { text: 'a soft airy whoosh, a camera gliding sideways down a hallway', duration: 0.8, gain: -21 },
    door: { text: 'a soft clean whoosh of a door swinging open, airy, with a faint latch click', duration: 0.7, gain: -19 },
    padlock: { text: 'a small metal padlock snapping shut, a dry short clack', duration: 0.5, gain: -16 },
    chip: { text: 'a tiny soft bubbly pop', duration: 0.5, gain: -21 },
    pull: { text: 'a soft low whoosh, a camera pulling back to reveal a long corridor', duration: 1, gain: -20 },
    word: { text: 'a soft punchy pop, a bold word landing on screen', duration: 0.5, gain: -18 },
    swell: { text: 'a gentle airy rising swell building anticipation, soft and smooth, no hit at the end', duration: 3.5, gain: -21 },
    cascade: { text: 'a bright sweeping cascade of soft airy whooshes, many doors swinging open at once, with a light shimmer', duration: 1.4, gain: -15 },
    window: { text: 'a soft airy whoosh as a card slides up into place', duration: 0.6, gain: -20 },
    check: { text: 'a tiny soft tick, a checkbox being checked', duration: 0.5, gain: -21 },
    success: { text: 'a short warm two-note success chime, soft', duration: 0.8, gain: -17 },
    counter: { text: 'a fast mechanical counter spinning up, rapid light ticking for one and a half seconds', duration: 1.5, gain: -21 },
    ring: { text: 'a soft airy shimmer, a ring expanding', duration: 1, gain: -18 },
  },
  cues: Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r),
    ...(sound === 'stream' ? { trim: 0.45 } : sound === 'counter' ? { trim: 0.5 } : {}) })),
};

fs.writeFileSync(path.join(dir, 'audio.json'), JSON.stringify(audio, null, 1) + '\n');
console.log(`wrote audio.json: ${audio.cues.reduce((n, c) => n + c.at.length, 0)} cues, ${DURATION} s`);
