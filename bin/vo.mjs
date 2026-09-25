// Voiceover with word timings: generate each line of a script with ElevenLabs
// (text-to-speech/with-timestamps), then lay the lines out on the timeline and
// write vo.json next to the script. Scenes import vo.json so the picture follows
// the voice; audio.mjs places the same clips (voice.from: "vo.json").
//
//   node --env-file=.env bin/vo.mjs videos/launch-film/script.json [--regen]
//
// script.json: { voiceId, model, settings, start, tail, lines: [{ id, text, gap }] }
//   gap = silence before the line (after the previous line's last word).
// Clips are cached in out/audio-cache/ by a hash of the request, like audio.mjs.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.mjs';

const argv = process.argv.slice(2);
const scriptFile = path.resolve(argv.find((a) => !a.startsWith('--')) || '');
if (!fs.existsSync(scriptFile)) throw new Error('usage: bin/vo.mjs <script.json> [--regen]');
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) throw new Error('ELEVENLABS_API_KEY missing — run with node --env-file=.env');
const script = JSON.parse(fs.readFileSync(scriptFile, 'utf8'));
const cacheDir = path.join(ROOT, 'out', 'audio-cache');
fs.mkdirSync(cacheDir, { recursive: true });

async function speak(line, prev, next) {
  const body = {
    text: line.text, model_id: script.model || 'eleven_multilingual_v2',
    voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, ...script.settings },
    // Neighbouring lines keep the delivery continuous across separately generated clips.
    ...(prev ? { previous_text: prev } : {}), ...(next ? { next_text: next } : {}),
  };
  const endpoint = `/text-to-speech/${script.voiceId}/with-timestamps`;
  const hash = crypto.createHash('sha1').update(endpoint + JSON.stringify(body)).digest('hex').slice(0, 16);
  const mp3 = path.join(cacheDir, `vo-${line.id}-${hash}.mp3`), meta = mp3.replace(/\.mp3$/, '.json');
  if (fs.existsSync(mp3) && fs.existsSync(meta) && !argv.includes('--regen')) return { mp3, align: JSON.parse(fs.readFileSync(meta, 'utf8')) };
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1${endpoint}`, { method: 'POST', headers: { 'xi-api-key': KEY, 'content-type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const j = await res.json();
      fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
      fs.writeFileSync(meta, JSON.stringify(j.alignment));
      console.log(`  generated ${line.id}: ${path.relative(ROOT, mp3)}`);
      return { mp3, align: j.alignment };
    }
    const detail = (await res.text()).slice(0, 300);
    if ((res.status === 429 || res.status >= 500) && attempt < 4) { await new Promise((r) => setTimeout(r, attempt * 3000)); continue; }
    throw new Error(`${endpoint} ${res.status}: ${detail}`);
  }
}

// Characters → words with start/end times inside the clip.
function wordsOf(align) {
  const out = []; let cur = null;
  align.characters.forEach((ch, i) => {
    const s = align.character_start_times_seconds[i], e = align.character_end_times_seconds[i];
    if (/\s/.test(ch)) { if (cur) { out.push(cur); cur = null; } return; }
    if (!cur) cur = { w: '', s, e };
    cur.w += ch; cur.e = e;
  });
  if (cur) out.push(cur);
  return out;
}

const lines = script.lines;
const clips = [];
for (let i = 0; i < lines.length; i += 4) {
  clips.push(...(await Promise.all(lines.slice(i, i + 4).map((l, j) => speak(l, lines[i + j - 1]?.text, lines[i + j + 1]?.text)))));
}

let cursor = script.start ?? 0.5;
const out = lines.map((l, i) => {
  const { mp3, align } = clips[i];
  const ws = wordsOf(align);
  const first = ws[0]?.s ?? 0, last = ws.at(-1)?.e ?? 0;
  if (i > 0) cursor += l.gap ?? 0.4;
  // Place the clip so its first word lands on the cursor.
  const at = +(cursor - first).toFixed(3);
  const line = { id: l.id, text: l.text, at, start: +(at + first).toFixed(3), end: +(at + last).toFixed(3), file: path.relative(ROOT, mp3),
    words: ws.map((w) => ({ w: w.w, s: +(at + w.s).toFixed(3), e: +(at + w.e).toFixed(3) })) };
  cursor = line.end;
  return line;
});
const total = +(cursor + (script.tail ?? 3)).toFixed(3);
const voFile = path.join(path.dirname(scriptFile), 'vo.json');
fs.writeFileSync(voFile, JSON.stringify({ voice: script.voiceName || script.voiceId, total, lines: out }, null, 1));
for (const l of out) console.log(`  ${l.id.padEnd(9)} ${l.start.toFixed(2).padStart(6)} → ${l.end.toFixed(2).padStart(6)}  (${(l.end - l.start).toFixed(2)} s)  ${l.text}`);
console.log(`Total ${total} s → ${path.relative(process.cwd(), voFile)}`);
