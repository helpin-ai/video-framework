// Look at any MP4 without watching it: contact sheets at chosen times or frame
// ranges, optional crop and brightness boost for spotting faint ghosts.
//
//   node bin/inspect.mjs <file.mp4>                        → info + 12-frame overview sheet
//   node bin/inspect.mjs <file.mp4> --times 5,9,16.1        → sheet at those times
//   node bin/inspect.mjs <file.mp4> --frames 935-940        → every frame in the range
//   node bin/inspect.mjs <file.mp4> --every 0.9 --from 30   → one frame every 0.9 s from 30 s
//   options: --crop x,y,w,h  --boost (lift shadows)  --width 640  --cols 4  --out sheet.png
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { ROOT } from './server.mjs';

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
const file = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--'));
if (!file || !fs.existsSync(file)) throw new Error('usage: bin/inspect.mjs <file.mp4> [--times …|--frames a-b|--every s]');

const probe = spawnSync(ffmpegPath, ['-hide_banner', '-i', file], { encoding: 'utf8' }).stderr;
const duration = (() => { const m = probe.match(/Duration: (\d+):(\d+):([\d.]+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0; })();
const fps = Number(probe.match(/([\d.]+) fps/)?.[1] || 30);
const size = probe.match(/, (\d{2,5})x(\d{2,5})/);
console.log(`${path.basename(file)}: ${duration.toFixed(2)} s · ${size?.[1]}×${size?.[2]} · ${fps} fps · ${Math.round(duration * fps)} frames${/Audio:/.test(probe) ? ' · has audio' : ' · no audio'}`);

let select, labels;
const from = Number(flag('from') || 0);
if (flag('frames')) {
  const [a, b] = flag('frames').split('-').map(Number);
  select = `between(n\\,${a}\\,${b ?? a})`;
  labels = Array.from({ length: (b ?? a) - a + 1 }, (_, i) => `f${a + i}`);
} else {
  const times = flag('times') ? flag('times').split(',').map(Number)
    : flag('every') ? Array.from({ length: Math.floor((duration - from) / Number(flag('every'))) + 1 }, (_, i) => from + i * Number(flag('every')))
    : Array.from({ length: 12 }, (_, i) => (duration * (i + 0.5)) / 12);
  const frames = times.map((t) => Math.min(Math.round(t * fps), Math.round(duration * fps) - 1));
  select = frames.map((n) => `eq(n\\,${n})`).join('+');
  labels = times.map((t) => `${t.toFixed(2)}s`);
}
const cols = Number(flag('cols') || Math.min(4, labels.length));
const rows = Math.ceil(labels.length / cols);
const filters = [`select='${select}'`];
if (flag('crop')) { const [x, y, w, h] = flag('crop').split(',').map(Number); filters.push(`crop=${w}:${h}:${x}:${y}`); }
if (argv.includes('--boost')) filters.push(`curves=all='0/0 0.25/0.9 1/1'`);
filters.push(`scale=${flag('width') || (flag('crop') ? -1 : 640)}:-2`, `tile=${cols}x${rows}:padding=4`);
const out = path.resolve(flag('out') || path.join(ROOT, 'out', 'inspect', `${path.basename(file, path.extname(file))}-sheet.png`));
fs.mkdirSync(path.dirname(out), { recursive: true });
const r = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-vf', filters.join(','), '-vsync', '0', '-frames:v', '1', out], { encoding: 'utf8' });
if (r.status !== 0) throw new Error(r.stderr);
console.log(`Sheet (${cols}×${rows}, left→right, top→bottom): ${labels.join(', ')}`);
console.log(`→ ${path.relative(process.cwd(), out)}`);
