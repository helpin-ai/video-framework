// The five tools a customer question touches (support, projects, CRM, meetings, docs): real logos from simple-icons,
// written to logos.json (path data + a colour that reads on the paper stage: the brand colour, or ink when the brand
// colour is too light). The AI clients (Claude, Codex, Cursor, VS Code) are SVG files in logos/. Used only to name them.
//   node videos/one-prompt/prep-logos.mjs
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(dir, '../..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'node_modules/simple-icons/data/simple-icons.json'), 'utf8'));
const SLUGS = ['intercom', 'zendesk', 'linear', 'jira', 'hubspot', 'zoho', 'zoom', 'googlemeet', 'notion', 'confluence'];
const lum = (hex) => { const c = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const out = SLUGS.map((slug) => {
  const svg = fs.readFileSync(path.join(root, `node_modules/simple-icons/icons/${slug}.svg`), 'utf8');
  const d = svg.match(/<path d="([^"]+)"/)[1];
  const meta = data.find((x) => (x.slug || norm(x.title)) === slug) || data.find((x) => norm(x.title) === slug);
  const hex = meta?.hex || '151716';
  return { slug, title: meta?.title || slug, hex: `#${hex}`, fill: lum(hex) > 0.6 ? '#151716' : `#${hex}`, d };
});
fs.writeFileSync(path.join(dir, 'logos.json'), JSON.stringify(out));
for (const l of out) console.log(`  ${l.title.padEnd(12)} ${l.hex}  →  ${l.fill}`);
