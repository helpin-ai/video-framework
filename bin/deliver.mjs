// Delivery files for the website and social, from a finished master with audio (render with --scale 2 for 4K,
// then mux with bin/audio.mjs --video).
//
//   node bin/deliver.mjs out/<name>/helpin-<name>-4k-master.mp4 [--name helpin-launch] [--card 48.5]
//
// Writes out/<name>/deliver/:
//   <name>-4k.mp4       the master, H.264 3840×2160 + AAC: YouTube, press kit, archive
//   <name>-1080p.mp4    H.264 1920×1080 (Lanczos from 4K), faststart: the website's <video> fallback, X, LinkedIn
//   <name>-1440p.webm   VP9 2560×1440 + Opus: a lighter, sharper source for the website in Chrome and Firefox
//   <name>-poster.jpg   the first frame, as the <video poster> (no jump when autoplay starts)
//   <name>-card.jpg     a still chosen with --card (default 1.5 s before the end), for link previews and thumbnails
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d);
const master = path.resolve(argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--')) || '');
if (!fs.existsSync(master)) throw new Error('usage: bin/deliver.mjs <master.mp4> [--name base] [--card seconds]');
const base = opt('name', path.basename(master, '.mp4').replace(/-4k-master$/, ''));
const dir = path.join(path.dirname(master), 'deliver');
fs.mkdirSync(dir, { recursive: true });
const ff = (args) => { const r = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' }); if (r.status !== 0) throw new Error(`ffmpeg failed: ${args.join(' ')}`); };
const info = spawnSync(ffmpegPath, ['-hide_banner', '-i', master], { encoding: 'utf8' }).stderr;
const dur = (([, h, m, s]) => +h * 3600 + +m * 60 + +s)(info.match(/Duration: (\d+):(\d+):([\d.]+)/));
const out = (suffix) => path.join(dir, `${base}${suffix}`);

fs.copyFileSync(master, out('-4k.mp4'));
ff(['-i', master, '-vf', 'scale=1920:1080:flags=lanczos', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-profile:v', 'high', '-level', '4.1',
  '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out('-1080p.mp4')]);
ff(['-i', master, '-vf', 'scale=2560:1440:flags=lanczos', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2',
  '-pix_fmt', 'yuv420p', '-c:a', 'libopus', '-b:a', '160k', out('-1440p.webm')]);
ff(['-ss', '0', '-i', master, '-frames:v', '1', '-q:v', '2', out('-poster.jpg')]);
ff(['-ss', String(Number(opt('card', Math.max(0, dur - 1.5)))), '-i', master, '-frames:v', '1', '-q:v', '2', out('-card.jpg')]);

for (const f of fs.readdirSync(dir).filter((f) => f.startsWith(base)).sort()) {
  const p = path.join(dir, f), mb = fs.statSync(p).size / 1e6;
  const res = (spawnSync(ffmpegPath, ['-hide_banner', '-i', p], { encoding: 'utf8' }).stderr.match(/, (\d{3,4}x\d{3,4})/) || [])[1];
  console.log(`  ${f.padEnd(46)} ${res || ''}  ${mb.toFixed(1)} MB`);
}
