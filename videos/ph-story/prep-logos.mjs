// The tools in the ending ("Don't lose context between tools and handoffs"): real logos from simple-icons,
// written to logos.json (path data + a colour that reads on the dark stage: the brand colour, or white when the
// brand colour is too dark). Used only to name the tools.
//   node videos/ph-story/prep-logos.mjs
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(dir, '../..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/simple-icons/data/simple-icons.json'), 'utf8'));
const SLUGS = ['intercom', 'zendesk', 'linear', 'jira', 'github', 'hubspot', 'notion', 'zoom', 'asana', 'trello', 'confluence', 'googledocs', 'googlemeet', 'gmail', 'clickup', 'helpscout'];
const lum = (hex) => { const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const out = SLUGS.map((slug) => {
  const svg = fs.readFileSync(path.join(root, `node_modules/simple-icons/icons/${slug}.svg`), 'utf8');
  const d = svg.match(/<path d="([^"]+)"/)[1];
  const meta = data.find((x) => (x.slug || x.title.toLowerCase().replace(/[^a-z0-9]/g, '')) === slug) || data.find((x) => x.title.toLowerCase().replace(/[^a-z0-9]/g, '') === slug);
  const hex = meta?.hex || 'FFFFFF';
  return { slug, title: meta?.title || slug, hex: `#${hex}`, fill: lum(hex) < 0.15 ? '#FFFFFF' : `#${hex}`, d };
});
fs.writeFileSync(path.join(dir, 'logos.json'), JSON.stringify(out));
for (const l of out) console.log(`  ${l.title.padEnd(12)} ${l.hex}  →  ${l.fill}`);
