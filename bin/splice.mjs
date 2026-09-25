// Replace part of an existing video with a rendered clip, cutting on exact frames.
// Used to give a finished MP4 a new ending (or middle) without its source.
//
//   node bin/splice.mjs --base original.mp4 --at 937 --insert out/new-ending/new-ending.mp4 --out final.mp4
//   node bin/splice.mjs --base original.mp4 --at 300 --insert new-middle.mp4 --resume 420 --out final.mp4
//
// --at      first base frame to replace (base frames 0..at-1 are kept)
// --resume  base frame to continue from after the insert (omit to end with the insert)
// Picture only; add sound afterwards with bin/audio.mjs.
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const flag = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
const base = flag('base'), insert = flag('insert'), at = Number(flag('at')), resume = flag('resume');
const out = path.resolve(flag('out') || 'spliced.mp4');
if (!base || !insert || !Number.isInteger(at)) throw new Error('usage: bin/splice.mjs --base a.mp4 --at FRAME --insert b.mp4 [--resume FRAME] --out c.mp4');
for (const f of [base, insert]) if (!fs.existsSync(f)) throw new Error(`missing ${f}`);

const fpsOf = (f) => Number(spawnSync(ffmpegPath, ['-hide_banner', '-i', f], { encoding: 'utf8' }).stderr.match(/([\d.]+) fps/)?.[1]);
const fps = fpsOf(base);
if (fpsOf(insert) !== fps) throw new Error(`frame rates differ: base ${fps} fps, insert ${fpsOf(insert)} fps`);

const parts = [`[0:v]trim=end_frame=${at},setpts=PTS-STARTPTS[a]`, `[1:v]setpts=PTS-STARTPTS[b]`];
let n = 2;
if (resume !== undefined) { parts.push(`[0:v]trim=start_frame=${Number(resume)},setpts=PTS-STARTPTS[c]`); n = 3; }
parts.push(`${['[a]', '[b]', '[c]'].slice(0, n).join('')}concat=n=${n}:v=1:a=0,format=yuv420p[v]`);
const r = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', base, '-i', insert,
  '-filter_complex', parts.join(';'), '-map', '[v]', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-r', String(fps), '-movflags', '+faststart', out], { stdio: 'inherit' });
if (r.status !== 0) process.exit(r.status);
console.log(`Wrote ${path.relative(process.cwd(), out)} (base frames 0–${at - 1}, then insert${resume !== undefined ? `, then base from frame ${resume}` : ''})`);
console.log(`Check the joins: node bin/inspect.mjs ${path.relative(process.cwd(), out)} --frames ${at - 3}-${at + 2}`);
