// Soundtrack from a cue file: ElevenLabs music bed + sound effects (+ optional
// voice lines), mixed on the video's timeline with ffmpeg and muxed onto an MP4.
//
//   node --env-file=.env bin/audio.mjs videos/launch/audio.json
//   node --env-file=.env bin/audio.mjs videos/launch/audio.json --video out/launch/launch.mp4
//   options: --out file.mp4  --regen (ignore the clip cache)  --no-music  --no-voice
//
// Every generated clip is cached in out/audio-cache/ by a hash of its request,
// so re-mixing after timing tweaks costs no credits.
import ffmpegPath from 'ffmpeg-static';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.mjs';

const argv = process.argv.slice(2);
const has = (name) => argv.includes(`--${name}`);
const flag = (name) => { const i = argv.indexOf(`--${name}`); return i >= 0 ? argv[i + 1] : undefined; };
const cueFile = path.resolve(argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--')) || '');
if (!fs.existsSync(cueFile)) throw new Error('usage: bin/audio.mjs <audio.json> [--video file.mp4]');
// A cue file may `extends` another (path relative to it); top-level keys override the base.
const loadCues = (file) => {
  const c = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!c.extends) return c;
  const base = loadCues(path.resolve(path.dirname(file), c.extends));
  if (base.video && !c.video) base.video = path.relative(path.dirname(file), path.resolve(path.dirname(path.resolve(path.dirname(file), c.extends)), base.video));
  return { ...base, ...c };
};
const cues = loadCues(cueFile);
const name = cues.name || path.basename(path.dirname(cueFile));
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('ELEVENLABS_API_KEY missing — run with node --env-file=.env');

const API = 'https://api.elevenlabs.io/v1';
const outDir = path.join(ROOT, 'out', name);
const cacheDir = path.join(ROOT, 'out', 'audio-cache');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(cacheDir, { recursive: true });

async function generate(kind, endpoint, body) {
  const hash = crypto.createHash('sha1').update(endpoint + JSON.stringify(body)).digest('hex').slice(0, 16);
  const file = path.join(cacheDir, `${kind}-${hash}.mp3`);
  if (fs.existsSync(file) && !has('regen')) return file;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`${API}${endpoint}`, {
      method: 'POST',
      headers: { 'xi-api-key': KEY, 'content-type': 'application/json', accept: 'audio/mpeg' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      console.log(`  generated ${kind}: ${path.relative(ROOT, file)}`);
      return file;
    }
    const detail = (await res.text()).slice(0, 400);
    if ((res.status === 429 || res.status >= 500) && attempt < 4) {
      await new Promise((r) => setTimeout(r, attempt * 3000));
      continue;
    }
    throw new Error(`${endpoint} ${res.status}: ${detail}`);
  }
}

const run = (args) => new Promise((resolve, reject) => {
  if (process.env.HV_AUDIO_DEBUG) console.error('ffmpeg', args.map((a) => (/[\s;[\]]/.test(a) ? `'${a}'` : a)).join(' '));
  const p = spawn(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
  p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
});

const dB = (x = 0) => Math.pow(10, x / 20).toFixed(4);
const duration = cues.duration;

// 1. Generate (or reuse) every clip. Independent requests run a few at a time.
console.log(`Soundtrack for ${name} (${duration} s)`);
const jobs = [];
// `music` is one bed or an array of beds; several short beds pin each section
// of the edit exactly, where one long track drifts from the requested structure.
const beds = has('no-music') ? [] : [cues.music || []].flat();
beds.forEach((m, bed) => {
  m.length ??= duration - (m.at || 0);
  // `generate` asks for a longer clip than is used, e.g. to skip a lead-in with `from`.
  const want = m.generate || m.length;
  const body = m.sections
    ? { model_id: m.model || 'music_v1', composition_plan: {
        positive_global_styles: m.styles || [], negative_global_styles: m.avoid || [],
        sections: m.sections.map((s) => ({ section_name: s.name, positive_local_styles: s.styles || [], negative_local_styles: s.avoid || [], duration_ms: Math.round(s.duration * 1000), lines: [] })) } }
    // The API's minimum length is 10 s; shorter beds are generated at 10 s and trimmed.
    : { model_id: m.model || 'music_v1', prompt: m.prompt, music_length_ms: Math.round(Math.max(10, want) * 1000), force_instrumental: true };
  jobs.push(async () => ({ kind: 'music', i: bed, file: await generate(`music-${bed}`, '/music', body) }));
});
const sounds = cues.sounds || {};
for (const [id, s] of Object.entries(sounds)) {
  jobs.push(async () => ({ kind: 'sfx', id, file: await generate(`sfx-${id}`, '/sound-generation', {
    text: s.text, duration_seconds: Math.min(30, Math.max(0.5, s.duration)), prompt_influence: s.influence ?? 0.5, // API range 0.5–30 s
  }) }));
}
// voice.from: a vo.json written by bin/vo.mjs (clips already generated, with their start times).
const voFrom = cues.voice?.from && JSON.parse(fs.readFileSync(path.resolve(path.dirname(cueFile), cues.voice.from), 'utf8'));
if (cues.voice && !voFrom && !has('no-voice')) {
  cues.voice.lines.forEach((line, i) => jobs.push(async () => ({ kind: 'voice', i, file: await generate(`voice-${i}`, `/text-to-speech/${cues.voice.voiceId}`, {
    text: line.text, model_id: cues.voice.model || 'eleven_multilingual_v2',
    voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, ...cues.voice.settings },
  }) })));
}
const results = [];
for (let i = 0; i < jobs.length; i += 4) results.push(...(await Promise.all(jobs.slice(i, i + 4).map((j) => j()))));
const clip = (kind, key) => results.find((r) => r.kind === kind && (r.id === key || r.i === key))?.file;

// 2. Place every clip on the timeline and mix.
// Input 0 is silence of exactly the video's length; amix ends with it (duration=first).
// (An `apad` tail instead never reaches end-of-stream on some mixes, so loudnorm never flushes.)
const inputs = ['-f', 'lavfi', '-t', String(duration), '-i', 'anullsrc=r=48000:cl=stereo'];
const filters = ['[0:a]aformat=channel_layouts=stereo[base]'], labels = ['[base]'];
// Buses: music and effects can be ducked under the voice (voice.duck), so they're summed separately.
const bus = { music: [], sfx: [], voice: [] };
let curBus = 'music';
const add = (file, { at = 0, gain = 0, trim, from = 0, fadeIn = 0, fadeOut = 0 }) => {
  const i = inputs.filter((a) => a === '-i').length;
  inputs.push('-i', file);
  const chain = [`aresample=48000`, `aformat=channel_layouts=stereo`];
  if (from || trim) chain.push(`atrim=start=${from}${trim ? `:duration=${trim}` : ''}`, 'asetpts=PTS-STARTPTS');
  if (fadeIn) chain.push(`afade=t=in:d=${fadeIn}`);
  if (fadeOut && trim) chain.push(`afade=t=out:st=${Math.max(0, trim - fadeOut)}:d=${fadeOut}`);
  chain.push(`volume=${dB(gain)}`, `adelay=${Math.round(at * 1000)}:all=1`);
  filters.push(`[${i}:a]${chain.join(',')}[a${i}]`);
  bus[curBus].push(`[a${i}]`);
};

curBus = 'music';
beds.forEach((m, bed) => add(clip('music', bed), {
  at: m.at || 0, gain: m.gain ?? -6, trim: m.length, from: m.from || 0, fadeIn: m.fadeIn ?? 0.3, fadeOut: m.fadeOut ?? 1,
}));
curBus = 'sfx';
for (const c of cues.cues || []) {
  const file = clip('sfx', c.sound);
  if (!file) throw new Error(`cue at ${c.at}s references unknown sound "${c.sound}"`);
  const times = Array.isArray(c.at) ? c.at : [c.at];
  for (const at of times) add(file, { at, gain: c.gain ?? sounds[c.sound].gain ?? -3, trim: c.trim, fadeOut: c.trim ? 0.08 : 0 });
}
curBus = 'voice';
if (cues.voice && !has('no-voice')) {
  if (voFrom) voFrom.lines.forEach((line) => add(path.join(ROOT, line.file), { at: line.at, gain: cues.voice.gain ?? 0 }));
  else cues.voice.lines.forEach((line, i) => add(clip('voice', i), { at: line.at, gain: cues.voice.gain ?? 0 }));
}
const sum = (list, out) => { if (list.length === 1) filters.push(`${list[0]}anull[${out}]`); else filters.push(`${list.join('')}amix=inputs=${list.length}:duration=longest:normalize=0:dropout_transition=0[${out}]`); };
const duck = cues.voice?.duck;
if (duck && bus.voice.length) {
  // Sidechain: the voice bus drives a compressor on the music (+ sfx if duck.sfx) bus.
  const under = [...bus.music, ...(duck.sfx ? bus.sfx : [])];
  sum(bus.voice, 'vox'); filters.push(`[vox]asplit=2[voxout][voxraw]`, `[voxraw]apad=whole_dur=${duration}[voxkey]`); // the key must outlast the voice, or the ducked bus ends with it
  if (under.length) {
    sum(under, 'under');
    filters.push(`[under][voxkey]sidechaincompress=threshold=${duck.threshold ?? 0.02}:ratio=${duck.ratio ?? 8}:attack=${duck.attack ?? 20}:release=${duck.release ?? 400}:makeup=1[ducked]`);
    labels.push('[ducked]');
  } else filters.push('[voxkey]anullsink');
  labels.push(...(duck.sfx ? [] : bus.sfx), '[voxout]');
} else labels.push(...bus.music, ...bus.sfx, ...bus.voice);

const master = cues.master || {};
filters.push(`${labels.join('')}amix=inputs=${labels.length}:duration=first:normalize=0:dropout_transition=0,` +
  `afade=t=out:st=${duration - (master.fadeOut ?? 1.5)}:d=${master.fadeOut ?? 1.5},` +
  `loudnorm=I=${master.lufs ?? -14}:TP=-1.5:LRA=${master.lra ?? 16},aresample=48000[mix]`);
const wav = path.join(outDir, `${name}${cues.label ? `-${cues.label}` : ''}-soundtrack.wav`);
await run([...inputs, '-filter_complex', filters.join(';'), '-map', '[mix]', '-c:a', 'pcm_s16le', wav]);
console.log(`Mixed ${labels.length - 1} clips → ${path.relative(process.cwd(), wav)}`);

// Energy report: you can't listen from a terminal, so check the mix's shape.
// One cell per second (RMS dBFS); look for drops/drops-outs where the edit expects energy.
if (!has('quiet')) {
  const { spawnSync } = await import('node:child_process');
  const rms = spawnSync(ffmpegPath, ['-hide_banner', '-i', wav, '-af', 'asetnsamples=48000,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level', '-f', 'null', '-'], { encoding: 'utf8' }).stderr
    .split('\n').filter((l) => l.includes('RMS_level=')).map((l) => Number(l.split('=')[1]));
  const bars = ' ▁▂▃▄▅▆▇█';
  const bar = (db) => bars[Math.max(0, Math.min(8, Math.round((db + 40) / 30 * 8)))] || ' ';
  for (let s = 0; s < rms.length; s += 15) {
    const row = rms.slice(s, s + 15);
    console.log(`  ${String(s).padStart(3)}s ${row.map(bar).join('')}  ${row.map((d) => (Number.isFinite(d) ? Math.round(d) : '-∞')).join(' ')}`);
  }
  const ebu = spawnSync(ffmpegPath, ['-hide_banner', '-i', wav, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' }).stderr;
  const lufs = ebu.match(/I:\s+(-?[\d.]+) LUFS/g)?.pop(), peak = ebu.match(/Peak:\s+(-?[\d.]+) dBFS/g)?.pop();
  console.log(`  loudness ${lufs?.replace(/\s+/g, ' ')} · true peak ${peak?.replace(/Peak:\s+/, '')}`);
}

// 3. Mux onto the picture.
const videoIn = flag('video') || (cues.video && path.resolve(path.dirname(cueFile), cues.video));
if (videoIn && !fs.existsSync(videoIn)) {
  console.log(`Video ${path.relative(process.cwd(), videoIn)} not rendered yet; soundtrack only. Re-run after rendering to mux.`);
} else if (videoIn) {
  const out = path.resolve(flag('out') || path.join(outDir, `${path.basename(videoIn, '.mp4')}-sound.mp4`));
  await run(['-i', videoIn, '-i', wav, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out]);
  console.log(`Wrote ${path.relative(process.cwd(), out)}`);
}
