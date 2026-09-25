// node bin/new-video.mjs <name>  → copies videos/_template to videos/<name>.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './server.mjs';

const name = process.argv[2];
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error('usage: npm run new -- <kebab-case-name>');
  process.exit(1);
}
const dest = path.join(ROOT, 'videos', name);
if (fs.existsSync(dest)) {
  console.error(`videos/${name} already exists`);
  process.exit(1);
}
fs.cpSync(path.join(ROOT, 'videos', '_template'), dest, { recursive: true });
for (const f of ['index.html', 'STORYBOARD.md']) {
  const file = path.join(dest, f);
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replaceAll('__NAME__', name));
}
console.log(`Created videos/${name}\n  preview: npm run preview -- ${name}\n  render:  npm run render -- ${name}`);
