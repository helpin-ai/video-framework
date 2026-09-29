// Generated footage ("plates") for a video, via Higgsfield (Seedance).
// Each plate is generated once, cached by request, and exploded into a JPEG frame sequence so scenes
// stay frame-exact: the page shows frame floor((t - start) * fps) of out/<name>/plates/<id>/.
//
//   node --env-file=.env bin/genvideo.mjs videos/<name>/plates.json [--regen] [--only id[,id]] [--dry]
//
// plates.json: { name, fps, size: "1920x1080", model,
//                plates: [{ id, prompt, duration, aspect_ratio, resolution, refs?: ["assets/…/face.webp"], model? }] }
// `refs` are local images uploaded once (cached in out/video-cache/uploads.json) and sent as image_urls to a
// reference-to-video model, so a character keeps the same face across plates.
// --dry prints what would be generated and the estimated cost; every paid generation is appended to
// out/video-cache/ledger.json with its estimate.
// Writes out/<name>/plates/<id>/f0001.jpg… and out/<name>/plates/plates.json (frame counts).
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.mjs';

const argv = process.argv.slice(2);
const file = path.resolve(argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--only') || '');
if (!fs.existsSync(file)) throw new Error('usage: bin/genvideo.mjs <plates.json> [--regen] [--only id[,id]] [--dry]');
const dry = argv.includes('--dry');
const KEY = process.env.HIGGSFIELD_API_KEY;
if (!KEY && !dry) throw new Error('HIGGSFIELD_API_KEY missing — run with node --env-file=.env');
const only = argv.includes('--only') ? argv[argv.indexOf('--only') + 1].split(',') : null;
const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
const API = 'https://api.higgsfield.ai';
const headers = { Authorization: `Key ${KEY}`, 'content-type': 'application/json', accept: 'application/json' };
const cacheDir = path.join(ROOT, 'out', 'video-cache');
const outDir = path.join(ROOT, 'out', cfg.name, 'plates');
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (b) => crypto.createHash('sha1').update(b).digest('hex').slice(0, 16);

// Token-metered pricing from Higgsfield's estimate endpoint (list price per 1,000 video tokens; tokens =
// seconds × width × height × 24 / 1024). PROMO is the discount running when this was written (30% off).
const PX = { '480p': 854 * 480, '720p': 1280 * 720, '1080p': 1920 * 1080, '4k': 3840 * 2160 };
const RATE = { 'seedance-2.5': { '480p': 0.0214, '720p': 0.0214 }, 'seedance-2.0': { '480p': 0.014, '720p': 0.014, '1080p': 0.014, '4k': 0.008 } };
const PROMO = 0.7;
const estimate = (model, sec, res) => {
  const fam = Object.keys(RATE).find((k) => model.includes(k));
  const r = fam && RATE[fam][res];
  return r ? Math.ceil((sec * PX[res] * 24) / 1024) / 1000 * r * PROMO : NaN;
};

const upFile = path.join(cacheDir, 'uploads.json');
const uploads = fs.existsSync(upFile) ? JSON.parse(fs.readFileSync(upFile, 'utf8')) : {};
async function upload(rel) {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  const h = sha(buf);
  if (uploads[h]) return uploads[h];
  const type = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }[path.extname(rel).toLowerCase()];
  const res = await fetch(`${API}/files/generate-upload-url`, { method: 'POST', headers, body: JSON.stringify({ content_type: type }) });
  const u = await res.json();
  if (!res.ok) throw new Error(`upload ${rel}: ${res.status} ${JSON.stringify(u).slice(0, 200)}`);
  const put = await fetch(u.upload_url, { method: 'PUT', headers: u.upload_headers || { 'content-type': type }, body: buf });
  if (!put.ok) throw new Error(`upload ${rel}: PUT ${put.status}`);
  uploads[h] = u.public_url;
  fs.writeFileSync(upFile, JSON.stringify(uploads, null, 1));
  return u.public_url;
}

const plan = (p) => {
  const model = p.model || (p.refs ? cfg.refModel || 'bytedance/seedance-2.0/reference-to-video' : cfg.model || 'bytedance/seedance-2.0/text-to-video');
  const body = { prompt: p.prompt, duration: p.duration ?? 5, resolution: p.resolution || '720p', aspect_ratio: p.aspect_ratio || '16:9', generate_audio: false, ...(p.extra || {}) };
  const refHash = (p.refs || []).map((r) => sha(fs.readFileSync(path.join(ROOT, r)))).join(',');
  const hash = sha(model + JSON.stringify(body) + refHash);
  return { model, body, mp4: path.join(cacheDir, `${p.id}-${hash}.mp4`), cost: estimate(model, body.duration, body.resolution) };
};

async function generate(p) {
  const { model, body, mp4, cost } = plan(p);
  if (fs.existsSync(mp4) && !argv.includes('--regen')) return mp4;
  if (p.refs) body.image_urls = await Promise.all(p.refs.map(upload));
  const res = await fetch(`${API}/${model}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const sub = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${p.id}: submit ${res.status} ${JSON.stringify(sub).slice(0, 300)}`);
  const id = sub.request_id;
  console.log(`  ${p.id}: submitted ${id} (${model}, ${body.duration} s ${body.resolution}, ~$${cost.toFixed(2)})`);
  const statusUrl = sub.status_url || `${API}/requests/${id}/status`;
  for (let i = 0; ; i++) {
    const st = await (await fetch(statusUrl, { headers })).json().catch(() => ({}));
    if (st.status === 'completed') {
      const url = st.video?.url || st.videos?.[0]?.url || st.output?.video?.url;
      if (!url) throw new Error(`${p.id}: completed without a video url: ${JSON.stringify(st).slice(0, 300)}`);
      fs.writeFileSync(mp4, Buffer.from(await (await fetch(url)).arrayBuffer()));
      const ledger = path.join(cacheDir, 'ledger.json');
      const rows = fs.existsSync(ledger) ? JSON.parse(fs.readFileSync(ledger, 'utf8')) : [];
      rows.push({ at: new Date().toISOString(), video: cfg.name, id: p.id, request: id, model, seconds: body.duration, resolution: body.resolution, usd: +cost.toFixed(3) });
      fs.writeFileSync(ledger, JSON.stringify(rows, null, 1));
      console.log(`  ${p.id}: done → ${path.relative(ROOT, mp4)}`);
      return mp4;
    }
    if (['failed', 'nsfw', 'canceled', 'cancelled'].includes(st.status)) throw new Error(`${p.id}: ${st.status} ${JSON.stringify(st).slice(0, 300)}`);
    if (i % 6 === 0) console.log(`  ${p.id}: ${st.status ?? 'polling'}…`);
    await sleep(5000);
  }
}

const fps = cfg.fps || 30, [W, H] = (cfg.size || '1920x1080').split('x').map(Number);
const meta = fs.existsSync(path.join(outDir, 'plates.json')) ? JSON.parse(fs.readFileSync(path.join(outDir, 'plates.json'), 'utf8')) : {};
const todo = cfg.plates.filter((p) => !only || only.includes(p.id));
if (dry) {
  let sum = 0;
  todo.forEach((p) => { const { model, body, mp4, cost } = plan(p); const cached = fs.existsSync(mp4); if (!cached) sum += cost; console.log(`  ${p.id.padEnd(14)} ${body.duration}s ${body.resolution} ${model.split('/').slice(1).join('/')}${p.refs ? ' +refs' : ''}  ${cached ? 'cached' : `~$${cost.toFixed(2)}`}`); });
  console.log(`  to generate: ~$${sum.toFixed(2)}`);
  process.exit(0);
}
const results = await Promise.allSettled(todo.map((p) => generate(p)));
todo.forEach((p, i) => {
  if (results[i].status === 'rejected') { console.error(`  ${p.id}: ${results[i].reason.message}`); return; }
  const mp4 = results[i].value;
  const dir = path.join(outDir, p.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  // Upscale to the film's size with Lanczos, resample to the film's fps, light grain to match a filmic look.
  const vf = `fps=${fps},scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}${p.grain === false ? '' : ',noise=alls=4:allf=t'}`;
  const r = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-vf', vf, '-q:v', '3', path.join(dir, 'f%04d.jpg')], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${p.id}: frame extraction failed`);
  const frames = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).length;
  meta[p.id] = { frames, fps, src: path.relative(ROOT, mp4) };
  console.log(`  ${p.id}: ${frames} frames (${(frames / fps).toFixed(2)} s) → ${path.relative(ROOT, dir)}`);
});
fs.writeFileSync(path.join(outDir, 'plates.json'), JSON.stringify(meta, null, 1));
if (results.some((r) => r.status === 'rejected')) process.exitCode = 1;
