// Frame-exact renderer: seeks the page to each frame, screenshots it, and pipes
// the frames into ffmpeg. Several browser pages render chunks in parallel.
//
//   node bin/render.mjs <video>                       → out/<video>/<video>.mp4
//   node bin/render.mjs <video> --stills 2,7.5,12     → PNG stills for review
//   node bin/render.mjs <video> --sheet 12            → contact sheet of 12 evenly spaced frames
//   node bin/render.mjs <video> --from 19 --to 26     → render a range only
//   node bin/render.mjs <video> --size 1080x1920      → alternate format (vertical)
//   node bin/render.mjs <video> --audio track.mp3     → mux a soundtrack
//   options: --fps N  --workers N  --crf N  --scale 0.5 (draft)  --out file.mp4
import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT, serve, videoPath } from './server.mjs';

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : fallback;
};
const video = videoPath(argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--')));
const size = flag('size');
const scale = Number(flag('scale', 1));
const outDir = path.join(ROOT, 'out', video.name);
fs.mkdirSync(outDir, { recursive: true });

const { server, port } = await serve();
const url = `http://127.0.0.1:${port}${video.urlPath}?render=1${size ? `&size=${size}` : ''}`;
const browser = await chromium.launch({ args: ['--disable-lcd-text', '--font-render-hinting=none', '--autoplay-policy=no-user-gesture-required'] });

async function openPage() {
  const probe = size?.split('x').map(Number);
  const page = await browser.newPage({ viewport: { width: probe?.[0] || 1920, height: probe?.[1] || 1080 }, deviceScaleFactor: scale });
  // Only our server (which proxies the website) and font CDNs; no analytics or third-party timers.
  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    return ['127.0.0.1', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'].includes(host) || route.request().url().startsWith('data:')
      ? route.continue() : route.abort();
  });
  page.on('pageerror', (e) => console.error('page error:', e.message));
  page.on('console', (m) => m.type() === 'error' && console.error('console:', m.text()));
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__video);
  const meta = await page.evaluate(async () => {
    await window.__video.ready;
    const { width, height, fps, duration, frames, audio, scenes } = window.__video;
    return { width, height, fps, duration, frames, audio, scenes };
  });
  await page.setViewportSize({ width: meta.width, height: meta.height });
  return { page, meta };
}

const shoot = async (page, t) => {
  await page.evaluate((x) => window.__video.seek(x), t);
  return page.screenshot({ type: 'png', clip: undefined, animations: 'allow', caret: 'initial' });
};

const run = (args, input) => new Promise((resolve, reject) => {
  const p = spawn(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  if (input) input(p.stdin);
});

try {
  const stills = flag('stills');
  const sheet = flag('sheet');
  if (stills || sheet) {
    const { page, meta } = await openPage();
    const times = stills ? stills.split(',').map(Number)
      : Array.from({ length: Number(sheet) }, (_, i) => (meta.duration * (i + 0.5)) / Number(sheet));
    const dir = path.join(outDir, sheet ? 'sheet' : 'stills');
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const files = [];
    for (const t of times) {
      const file = path.join(dir, `t${t.toFixed(2).padStart(6, '0')}.png`);
      fs.writeFileSync(file, await shoot(page, t));
      files.push(file);
    }
    if (sheet) {
      const cols = Math.ceil(Math.sqrt(times.length));
      const rows = Math.ceil(times.length / cols);
      const sheetFile = path.join(outDir, 'contact-sheet.png');
      // -reinit_filter 0 + format: stills can mix RGB and RGBA, and a format change would reset tile.
      await run(['-reinit_filter', '0', '-framerate', '1', '-pattern_type', 'glob', '-i', path.join(dir, '*.png'),
        '-vf', `format=rgb24,scale=640:-1,tile=${cols}x${rows}:padding=6:color=black`, '-frames:v', '1', sheetFile]);
      console.log(`Contact sheet: ${path.relative(ROOT, sheetFile)} (frames at ${times.map((t) => t.toFixed(1)).join(', ')} s)`);
    } else {
      files.forEach((f) => console.log(path.relative(ROOT, f)));
    }
  } else {
    const probe = await openPage();
    const meta = probe.meta;
    await probe.page.close();
    const fps = Number(flag('fps', meta.fps));
    const from = Number(flag('from', 0));
    const to = Math.min(Number(flag('to', meta.duration)), meta.duration);
    const first = Math.round(from * fps);
    const last = Math.round(to * fps); // exclusive
    const total = last - first;
    const workers = Math.max(1, Math.min(Number(flag('workers', Math.min(6, os.cpus().length))), Math.ceil(total / fps)));
    const ranged = from > 0 || to < meta.duration;
    const suffix = `${size ? `-${size}` : ''}${ranged ? `-${from}-${to}` : ''}`;
    const out = path.resolve(flag('out', path.join(outDir, `${video.name}${suffix}.mp4`)));
    const tmp = fs.mkdtempSync(path.join(outDir, '.segments-'));
    const crf = flag('crf', '16');
    const started = Date.now();
    let done = 0;

    console.log(`Rendering ${video.name}: ${total} frames @ ${fps} fps, ${meta.width}×${meta.height}${scale !== 1 ? ` ×${scale}` : ''}, ${workers} workers`);
    const chunk = Math.ceil(total / workers);
    const segments = await Promise.all(Array.from({ length: workers }, async (_, w) => {
      const a = first + w * chunk, b = Math.min(last, a + chunk);
      const file = path.join(tmp, `seg${String(w).padStart(3, '0')}.mp4`);
      if (a >= b) return null;
      const { page } = await openPage();
      await run(['-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', crf, '-pix_fmt', 'yuv420p', '-r', String(fps), file],
        async (stdin) => {
          for (let f = a; f < b; f++) {
            const buf = await shoot(page, f / fps);
            if (!stdin.write(buf)) await new Promise((r) => stdin.once('drain', r));
            done++;
            if (done % fps === 0 || done === total) {
              const rate = done / ((Date.now() - started) / 1000);
              process.stdout.write(`\r  ${done}/${total} frames · ${rate.toFixed(1)} fps · eta ${Math.ceil((total - done) / rate)} s   `);
            }
          }
          stdin.end();
        });
      await page.close();
      return file;
    }));
    process.stdout.write('\n');

    const list = path.join(tmp, 'list.txt');
    fs.writeFileSync(list, segments.filter(Boolean).map((f) => `file '${f}'`).join('\n'));
    const audio = flag('audio') || (meta.audio && path.join(video.dir, meta.audio));
    const audioArgs = audio && fs.existsSync(audio)
      ? ['-ss', String(from), '-i', audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '256k', '-shortest']
      : [];
    await run(['-f', 'concat', '-safe', '0', '-i', list, ...audioArgs, '-c:v', 'copy', '-movflags', '+faststart', out]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`Wrote ${path.relative(process.cwd(), out)} in ${((Date.now() - started) / 1000).toFixed(0)} s${audioArgs.length ? ' (with audio)' : ''}`);
  }
} finally {
  await browser.close();
  server.close();
}
