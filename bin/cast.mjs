// Talking-head cast for a video: a portrait (Higgsfield Soul), a spoken line (ElevenLabs), and a lip-synced clip
// (Seedance 2.0 with the line as its audio reference, then ElevenLabs speech-to-speech into the chosen voice). Everything is cached by request; every paid Higgsfield call is priced
// with the free estimate endpoint first and appended to out/video-cache/ledger.json.
//
//   node --env-file=.env bin/cast.mjs videos/<name>/cast.json [--only id[,id]] [--step portrait|voice|talk] [--dry]
//
// cast.json: { name, fps, size, portrait: { resolution, aspect_ratio }, talk: { duration, quality },
//              cast: [{ id, role, portrait: "prompt", seed?, voiceId, line, model?, settings?, motion: "prompt" }] }
// Writes out/<name>/cast/<id>.png (portrait), <id>.mp3 (line), <id>.mp4 (clip), and exploded frames in
// out/<name>/plates/<id>/f0001.jpg… with out/<name>/plates/plates.json, the same layout as bin/genvideo.mjs,
// so pages show them with plateFrame() from lib/film.js. cast-meta.json records each line's length.
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.mjs';

const argv = process.argv.slice(2);
const flag = (n) => (argv.includes(`--${n}`) ? argv[argv.indexOf(`--${n}`) + 1] : null);
const file = path.resolve(argv.find((a, i) => !a.startsWith('--') && !['--only', '--step'].includes(argv[i - 1])) || '');
if (!fs.existsSync(file)) throw new Error('usage: bin/cast.mjs <cast.json> [--only id] [--step portrait|voice|talk] [--dry]');
const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
const dry = argv.includes('--dry');
const only = flag('only')?.split(',');
const step = flag('step');
const HF = 'https://api.higgsfield.ai', EL = 'https://api.elevenlabs.io/v1';
const hfh = { Authorization: `Key ${process.env.HIGGSFIELD_API_KEY}`, 'content-type': 'application/json', accept: 'application/json' };
const cacheDir = path.join(ROOT, 'out', 'video-cache');
const castDir = path.join(ROOT, 'out', cfg.name, 'cast');
const plateDir = path.join(ROOT, 'out', cfg.name, 'plates');
for (const d of [cacheDir, castDir, plateDir]) fs.mkdirSync(d, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (b) => crypto.createHash('sha1').update(b).digest('hex').slice(0, 16);
const rel = (p) => path.relative(ROOT, p);

function ledger(row) {
  const f = path.join(cacheDir, 'ledger.json');
  const rows = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  rows.push({ at: new Date().toISOString(), video: cfg.name, ...row });
  fs.writeFileSync(f, JSON.stringify(rows, null, 1));
}
async function estimate(model, body) {
  const r = await fetch(`${HF}/estimate/${model}`, { method: 'POST', headers: hfh, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`estimate ${model}: ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
  return +j.usd;
}
const upFile = path.join(cacheDir, 'uploads.json');
const uploads = fs.existsSync(upFile) ? JSON.parse(fs.readFileSync(upFile, 'utf8')) : {};
async function upload(p, type) {
  const buf = fs.readFileSync(p);
  const h = sha(buf);
  if (uploads[h]) return uploads[h];
  const res = await fetch(`${HF}/files/generate-upload-url`, { method: 'POST', headers: hfh, body: JSON.stringify({ content_type: type }) });
  const u = await res.json();
  if (!res.ok) throw new Error(`upload ${rel(p)}: ${res.status} ${JSON.stringify(u).slice(0, 200)}`);
  const put = await fetch(u.upload_url, { method: 'PUT', headers: u.upload_headers || { 'content-type': type }, body: buf });
  if (!put.ok) throw new Error(`upload ${rel(p)}: PUT ${put.status}`);
  uploads[h] = u.public_url;
  fs.writeFileSync(upFile, JSON.stringify(uploads, null, 1));
  return u.public_url;
}
// Submit a Higgsfield job, poll it, and return the finished status object.
async function run(id, model, body, usd) {
  const res = await fetch(`${HF}/${model}`, { method: 'POST', headers: hfh, body: JSON.stringify(body) });
  const sub = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${id}: submit ${res.status} ${JSON.stringify(sub).slice(0, 300)}`);
  console.log(`  ${id}: submitted ${model} (~$${usd.toFixed(3)})`);
  const statusUrl = sub.status_url || `${HF}/requests/${sub.request_id}/status`;
  for (let i = 0; ; i++) {
    const st = await (await fetch(statusUrl, { headers: hfh })).json().catch(() => ({}));
    if (st.status === 'completed') { ledger({ id, request: sub.request_id, model, usd }); return st; }
    if (['failed', 'nsfw', 'canceled', 'cancelled'].includes(st.status)) throw new Error(`${id}: ${st.status} ${JSON.stringify(st).slice(0, 300)}`);
    if (i % 6 === 0) console.log(`  ${id}: ${st.status ?? 'polling'}…`);
    await sleep(4000);
  }
}
const seconds = (p) => { const r = spawnSync(ffmpegPath, ['-hide_banner', '-i', p], { encoding: 'utf8' }); const m = r.stderr.match(/Duration: (\d+):(\d+):([\d.]+)/); return m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : NaN; };

async function portrait(c) {
  if (step === 'voice') return null;
  const body = { prompt: c.portrait, aspect_ratio: cfg.portrait?.aspect_ratio || '16:9', resolution: cfg.portrait?.resolution || '1080p', enhance_prompt: false, batch_size: 1, ...(c.seed ? { seed: c.seed } : {}) };
  const out = path.join(castDir, `${c.id}-${sha(JSON.stringify(body))}.png`);
  if (fs.existsSync(out)) return out;
  const usd = await estimate('higgsfield-ai/soul/standard', body);
  if (dry) { console.log(`  ${c.id}: portrait ~$${usd.toFixed(3)}`); return null; }
  const st = await run(`${c.id}/portrait`, 'higgsfield-ai/soul/standard', body, usd);
  const url = st.images?.[0]?.url || st.image?.url || st.output?.images?.[0]?.url;
  if (!url) throw new Error(`${c.id}: portrait without an image url: ${JSON.stringify(st).slice(0, 300)}`);
  fs.writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log(`  ${c.id}: portrait → ${rel(out)}`);
  return out;
}

// ElevenLabs allows a few concurrent requests per plan: generate lines one at a time.
let voiceQueue = Promise.resolve();
const voice = (c) => (voiceQueue = voiceQueue.then(() => voiceOne(c), () => voiceOne(c)));
async function voiceOne(c) {
  const body = { text: c.line, model_id: c.model || cfg.voiceModel || 'eleven_v3', voice_settings: { stability: 0.5, similarity_boost: 0.8, ...(cfg.voiceSettings || {}), ...(c.settings || {}) } };
  const out = path.join(castDir, `${c.id}-${sha(c.voiceId + JSON.stringify(body))}.mp3`);
  if (fs.existsSync(out)) return out;
  if (dry) { console.log(`  ${c.id}: voice (${c.line.length} chars)`); return null; }
  const r = await fetch(`${EL}/text-to-speech/${c.voiceId}?output_format=mp3_44100_128`, { method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'content-type': 'application/json', accept: 'audio/mpeg' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${c.id}: voice ${r.status} ${(await r.text()).slice(0, 300)}`);
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  console.log(`  ${c.id}: voice ${seconds(out).toFixed(2)} s → ${rel(out)}`);
  return out;
}

// The talking clip: Seedance 2.0 animates the portrait speaking the line (the ElevenLabs take is its audio reference),
// with natural head and hand motion and lips in sync with its own speech. Higgsfield's speak model failed on every
// input we tried (Sep 26), so it isn't used. The clip's speech is then turned into the cast member's ElevenLabs voice
// with speech-to-speech, which keeps the timing (word starts within 0.02 s), and transcribed for word-timed captions.
const TALK_MODEL = 'bytedance/seedance-2.0/reference-to-video';
const talkPrompt = (c) => c.talkPrompt || `The person from the reference image sits exactly as in the image and talks straight into the camera on a casual video call, speaking the words of the reference audio with lips precisely in sync with it: "${c.line.replace(/\[[^\]]*\]\s*/g, '')}" ${c.motion} Static webcam framing, same room, lighting and clothes as the reference image. No text, no music.`;
async function talk(c, img, mp3) {
  const len = seconds(mp3);
  const duration = Math.max(4, Math.ceil(len + 0.6));
  const body = { prompt: talkPrompt(c), duration, resolution: cfg.talk?.resolution || '720p', aspect_ratio: '16:9', generate_audio: true };
  const jpg = img.replace(/\.png$/, '-720.jpg');
  if (!fs.existsSync(jpg)) spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', img, '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '2', jpg]);
  // Higgsfield takes WAV (not MP3) uploads.
  const wav = mp3.replace(/\.mp3$/, `-${duration}s.wav`);
  if (!fs.existsSync(wav)) spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp3, '-af', 'apad', '-t', String(duration), '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', wav]);
  const out = path.join(castDir, `${c.id}-${sha(JSON.stringify(body) + sha(fs.readFileSync(jpg)) + sha(fs.readFileSync(wav)))}.mp4`);
  if (!fs.existsSync(out)) {
    const usd = (duration * 1280 * 720 * 24) / 1024 / 1000 * 0.014 * 0.7; // Seedance 2.0 720p, promo price (see genvideo.mjs)
    if (dry) { console.log(`  ${c.id}: talk ${duration} s ~$${usd.toFixed(3)} (line ${len.toFixed(2)} s) → ${rel(out)}`); return null; }
    body.image_urls = [await upload(jpg, 'image/jpeg')];
    body.audio_urls = [await upload(wav, 'audio/wav')];
    const st = await run(`${c.id}/talk`, TALK_MODEL, body, usd);
    const url = st.video?.url || st.videos?.[0]?.url || st.output?.video?.url;
    if (!url) throw new Error(`${c.id}: clip without a video url: ${JSON.stringify(st).slice(0, 300)}`);
    fs.writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
    console.log(`  ${c.id}: clip ${seconds(out).toFixed(2)} s → ${rel(out)}`);
  }
  // Speech-to-speech into the cast member's voice, then word timings.
  const voiced = out.replace(/\.mp4$/, `-${c.voiceId.slice(0, 6)}.mp3`);
  if (!fs.existsSync(voiced)) {
    const raw = out.replace(/\.mp4$/, '-raw.mp3');
    spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', out, '-vn', '-ac', '1', '-ar', '44100', '-b:a', '160k', raw]);
    const fd = new FormData();
    fd.append('audio', new Blob([fs.readFileSync(raw)], { type: 'audio/mpeg' }), 'a.mp3');
    fd.append('model_id', 'eleven_multilingual_sts_v2');
    fd.append('remove_background_noise', 'true');
    fd.append('voice_settings', JSON.stringify({ stability: 0.5, similarity_boost: 0.85 }));
    const r = await fetch(`${EL}/speech-to-speech/${c.voiceId}?output_format=mp3_44100_128`, { method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, body: fd });
    if (!r.ok) throw new Error(`${c.id}: speech-to-speech ${r.status} ${(await r.text()).slice(0, 200)}`);
    fs.writeFileSync(voiced, Buffer.from(await r.arrayBuffer()));
  }
  const words = voiced.replace(/\.mp3$/, '-words.json');
  if (!fs.existsSync(words)) {
    const fd = new FormData();
    fd.append('model_id', 'scribe_v1'); fd.append('timestamps_granularity', 'word');
    fd.append('file', new Blob([fs.readFileSync(voiced)], { type: 'audio/mpeg' }), 'a.mp3');
    const r = await fetch(`${EL}/speech-to-text`, { method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY }, body: fd });
    const j = await r.json();
    if (!r.ok) throw new Error(`${c.id}: speech-to-text ${r.status}`);
    fs.writeFileSync(words, JSON.stringify(j.words.filter((w) => w.type === 'word').map((w) => ({ w: w.text, s: +w.start.toFixed(3), e: +w.end.toFixed(3) }))));
  }
  return { mp4: out, voiced, words };
}

const fps = cfg.fps || 30, [W, H] = (cfg.size || '1920x1080').split('x').map(Number);
const plates = fs.existsSync(path.join(plateDir, 'plates.json')) ? JSON.parse(fs.readFileSync(path.join(plateDir, 'plates.json'), 'utf8')) : {};
const metaFile = path.join(ROOT, 'videos', cfg.name, 'cast-meta.json');
const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, 'utf8')) : {};
const todo = cfg.cast.filter((c) => !only || only.includes(c.id));
const results = await Promise.allSettled(todo.map(async (c) => {
  const [img, mp3] = await Promise.all([portrait(c), step === 'portrait' ? null : voice(c)]);
  if (img) fs.copyFileSync(img, path.join(castDir, `${c.id}.png`));
  if (mp3) { fs.copyFileSync(mp3, path.join(castDir, `${c.id}.mp3`)); meta[c.id] = { ...(meta[c.id] || {}), line: c.line, seconds: +seconds(mp3).toFixed(3) }; }
  if (step === 'portrait' || step === 'voice' || !img || !mp3) return;
  const clip = await talk(c, img, mp3);
  if (!clip) return;
  const mp4 = clip.mp4;
  fs.copyFileSync(mp4, path.join(castDir, `${c.id}.mp4`));
  fs.copyFileSync(clip.voiced, path.join(castDir, `${c.id}-voice.mp3`));
  meta[c.id].words = JSON.parse(fs.readFileSync(clip.words, 'utf8'));
  const dir = path.join(plateDir, c.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const vf = `fps=${fps},scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H}`;
  const r = spawnSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', mp4, '-vf', vf, '-q:v', '3', path.join(dir, 'f%04d.jpg')], { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`${c.id}: frame extraction failed`);
  const frames = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg')).length;
  plates[c.id] = { frames, fps, src: rel(mp4) };
  meta[c.id].clip = +seconds(mp4).toFixed(3);
  console.log(`  ${c.id}: ${frames} frames → ${rel(dir)}`);
}));
todo.forEach((c, i) => results[i].status === 'rejected' && console.error(`  ${c.id}: ${results[i].reason.message}`));
if (!dry) { fs.writeFileSync(path.join(plateDir, 'plates.json'), JSON.stringify(plates, null, 1)); fs.writeFileSync(metaFile, JSON.stringify(meta, null, 1)); }
if (results.some((r) => r.status === 'rejected')) process.exitCode = 1;
