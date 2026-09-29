// Photo tiles for "Everywhere", cut from footage plates already generated for other films (no new credits).
// Run after bin/genvideo.mjs has produced the launch-film and film-one-day plates:
//   node videos/launch-everywhere/prep.mjs
// Frames are chosen from ranges checked for brand marks (see those films' STORYBOARD.md):
// sam starts after frame ~85 (monitor badge); sunrise only before frame ~60 (a maker's logo shows on the lid from
// then on); dusk only after the lid is closed and out of frame; maya-smile (laptop logo) is not used.
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const out = path.join(root, 'out/launch-everywhere/photos');
fs.mkdirSync(out, { recursive: true });
export const PHOTOS = [
  ['launch-film', 'maya-night', [20, 110, 200]], ['launch-film', 'support', [15, 70, 115]], ['launch-film', 'product', [10, 60, 110]],
  ['launch-film', 'sam', [110, 170, 230]], ['launch-film', 'team', [30, 90, 140]],
  ['film-one-day', 'ten', [40, 150]], ['film-one-day', 'eleven', [20, 140]], ['film-one-day', 'one', [60, 160]],
  ['film-one-day', 'three', [50, 150]], ['film-one-day', 'five', [120, 170]], ['film-one-day', 'sunrise', [50]], ['film-one-day', 'dusk', [150]],
];
let n = 0;
for (const [film, id, frames] of PHOTOS) {
  for (const f of frames) {
    const src = path.join(root, `out/${film}/plates/${id}/f${String(f).padStart(4, '0')}.jpg`);
    if (!fs.existsSync(src)) throw new Error(`missing ${path.relative(root, src)}: generate that film's plates first`);
    const dst = path.join(out, `${id}-${f}.jpg`);
    const r = spawnSync(ffmpegPath, ['-v', 'error', '-y', '-i', src, '-vf', 'scale=720:-2:flags=lanczos', '-q:v', '4', dst]);
    if (r.status !== 0) throw new Error(`ffmpeg failed on ${src}`);
    n++;
  }
}
fs.writeFileSync(path.join(out, 'photos.json'), JSON.stringify(PHOTOS.flatMap(([, id, frames]) => frames.map((f) => `${id}-${f}.jpg`))));
console.log(`${n} photo tiles → ${path.relative(root, out)}`);
