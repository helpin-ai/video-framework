// node bin/preview.mjs <video> [--port 8090]  → serves the live preview.
import { serve, videoPath } from './server.mjs';

const args = process.argv.slice(2);
const { urlPath } = videoPath(args.find((a) => !a.startsWith('--')));
const portArg = args.indexOf('--port');
const { port } = await serve(portArg >= 0 ? Number(args[portArg + 1]) : 8090);
console.log(`Preview: http://127.0.0.1:${port}${urlPath}`);
console.log('Space play/pause · ←/→ one frame · Shift+←/→ one second · 1–9 jump to scene · #12.5 in the URL starts at 12.5 s');
