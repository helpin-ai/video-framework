// Tile PNGs into a sheet: node videos/cmp-help-scout/tile.mjs out.png cols w a.png b.png …
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';
const [out, cols, w, ...files] = process.argv.slice(2);
const W = +w, H = Math.round(W * 9 / 16), C = +cols;
const f = files.map((_, i) => `[${i}]scale=${W}:${H}[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') +
  `xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % C) * W}_${Math.floor(i / C) * H}`).join('|')}:fill=black`;
const r = spawnSync(ffmpegPath, ['-v', 'error', '-y', ...files.flatMap((x) => ['-i', x]), '-filter_complex', f, out], { stdio: 'inherit' });
process.exit(r.status);
