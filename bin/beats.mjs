// Tempo, beat phase and energy of an audio file, to check that music lands on the picture's grid.
//
//   node bin/beats.mjs out/audio-cache/music-0-….mp3 [--bpm 120] [--marks 3.5,8.5,14] [--json out.json]
//
// Prints the tempo found near --bpm (autocorrelation of an onset envelope), the offset of the beat grid
// (so `from` can shift the bed onto the picture's beats), and a half-second energy strip with the
// --marks (e.g. section starts) flagged, so drops and breaks can be checked against the edit.
// --json writes { bpm, firstBeat, period, duration, energy: [dB per beat], hits: [strong onsets, s] } so a
// music-first edit can put its impacts on the track's real drum hits.
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const file = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
const opt = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d);
const target = +opt('bpm', 120);
const marks = opt('marks', '').split(',').filter(Boolean).map(Number);
const SR = 11025, HOP = 128; // ~11.6 ms frames
const pcm = spawnSync(ffmpegPath, ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 }).stdout;
const x = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4);
const n = Math.floor(x.length / HOP), fr = SR / HOP;
// Onset envelope: positive change of log energy per frame.
const en = new Float32Array(n), on = new Float32Array(n);
for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < HOP; j++) { const v = x[i * HOP + j]; s += v * v; } en[i] = Math.log(1e-9 + s); }
for (let i = 1; i < n; i++) on[i] = Math.max(0, en[i] - en[i - 1]);
// Tempo: autocorrelation peak within ±12% of the target.
let best = { bpm: target, score: -1 };
for (let bpm = target * 0.88; bpm <= target * 1.12; bpm += 0.05) {
  const lag = (60 / bpm) * fr; let s = 0;
  for (let i = 0; i + lag + 1 < n; i++) { const l = Math.floor(i + lag), f = i + lag - l; s += on[i] * (on[l] * (1 - f) + on[l + 1] * f); }
  if (s > best.score) best = { bpm, score: s };
}
// Phase: the grid offset that collects the most onset energy on the beats.
const period = 60 / best.bpm;
let phase = { off: 0, score: -1 };
for (let off = 0; off < period; off += 0.005) {
  let s = 0; for (let t = off; t < n / fr; t += period) { const i = Math.round(t * fr); s += on[i] + 0.5 * (on[i - 1] || 0) + 0.5 * (on[i + 1] || 0); }
  if (s > phase.score) phase = { off, score: s };
}
console.log(`${file}\n  tempo ${best.bpm.toFixed(2)} BPM (target ${target}) · first beat at ${phase.off.toFixed(3)} s · ${(n / fr).toFixed(2)} s long`);
// Energy per half second, in dB relative to the loudest half second.
const half = Math.round(fr / 2), rows = [];
for (let i = 0; i < n; i += half) { let s = 0, c = 0; for (let j = i; j < Math.min(n, i + half); j++) { s += Math.exp(en[j]); c++; } rows.push(10 * Math.log10(s / c + 1e-12)); }
const top = Math.max(...rows), bars = ' ▁▂▃▄▅▆▇█';
let line = '', lab = '';
rows.forEach((db, i) => {
  const t = i / 2, mark = marks.some((m) => Math.abs(m - t) < 0.25);
  line += bars[Math.max(0, Math.min(8, Math.round((db - top + 36) / 4.5)))];
  lab += mark ? '^' : i % 10 === 0 ? '|' : ' ';
});
for (let i = 0; i < line.length; i += 60) console.log(`  ${String(i / 2).padStart(5)}s ${line.slice(i, i + 60)}\n         ${lab.slice(i, i + 60)}`);
// Beat-level energy and the strong onsets (local maxima of the onset envelope in the top 15%), for --json.
const jsonOut = opt('json', null);
if (jsonOut) {
  const beatsN = Math.floor((n / fr - phase.off) / period);
  const energy = Array.from({ length: beatsN }, (_, b) => {
    const a = Math.round((phase.off + b * period) * fr), z = Math.round((phase.off + (b + 1) * period) * fr);
    let s = 0; for (let i = a; i < z; i++) s += Math.exp(en[i]); return +(10 * Math.log10(s / Math.max(1, z - a) + 1e-12)).toFixed(1);
  });
  const sorted = [...on].sort((a, b) => a - b), thr = sorted[Math.floor(sorted.length * 0.85)];
  const hits = [];
  for (let i = 2; i < n - 2; i++) if (on[i] > thr && on[i] >= on[i - 1] && on[i] >= on[i + 1] && on[i] >= on[i - 2] && on[i] >= on[i + 2]) { const t = i / fr; if (!hits.length || t - hits.at(-1) > 0.08) hits.push(+t.toFixed(3)); }
  const { writeFileSync } = await import('node:fs');
  writeFileSync(jsonOut, JSON.stringify({ file, bpm: +best.bpm.toFixed(2), firstBeat: +phase.off.toFixed(3), period: +period.toFixed(5), duration: +(n / fr).toFixed(3), energy, hits }));
  console.log(`  wrote ${jsonOut}: ${energy.length} beats, ${hits.length} hits`);
}
