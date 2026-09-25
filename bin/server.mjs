// Static server rooted at the framework directory, so videos can import
// ../../lib/*.js and fonts from node_modules (ES modules don't load over file://).
// Every other path is proxied to the Helpin website (HV_SITE, default https://helpin.ai)
// with lib/site-clock.js injected, so video pages can embed real website previews
// in a same-origin iframe and drive them frame by frame (see lib/site.js).
// Proxied responses are cached in out/site-cache/ so renders are reproducible;
// set HV_SITE_REFRESH=1 to refetch.
import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.m4a': 'audio/mp4', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const LOCAL = /^\/(lib|videos|assets|node_modules|out|reference)(\/|$)/;
const SITE = (process.env.HV_SITE || 'https://helpin.ai').replace(/\/$/, '');
const CACHE = path.join(ROOT, 'out', 'site-cache');
const inflight = new Map();

async function fetchSite(pathAndQuery) {
  const key = crypto.createHash('sha1').update(SITE + pathAndQuery).digest('hex');
  const body = path.join(CACHE, key), meta = body + '.json';
  if (!process.env.HV_SITE_REFRESH && fs.existsSync(meta)) return { ...JSON.parse(fs.readFileSync(meta, 'utf8')), buf: fs.readFileSync(body) };
  if (inflight.has(key)) return inflight.get(key);
  const p = (async () => {
    const r = await fetch(SITE + pathAndQuery, { headers: { 'user-agent': 'helpin-video-framework' } });
    const buf = Buffer.from(await r.arrayBuffer());
    const out = { status: r.status, type: r.headers.get('content-type') || 'application/octet-stream' };
    fs.mkdirSync(CACHE, { recursive: true });
    fs.writeFileSync(body + '.tmp', buf); fs.renameSync(body + '.tmp', body);
    fs.writeFileSync(meta, JSON.stringify(out));
    return { ...out, buf };
  })().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

async function proxy(req, res, url) {
  try {
    let { status, type, buf } = await fetchSite(url.pathname + url.search);
    if (type.includes('text/html')) {
      buf = Buffer.from(buf.toString('utf8').replace(/<head([^>]*)>/i, '<head$1><script src="/lib/site-clock.js"></script>'));
    }
    res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
    res.end(buf);
  } catch (e) {
    res.writeHead(502).end(String(e));
  }
}

export function serve(port = 0) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (!LOCAL.test(url.pathname) && url.pathname !== '/favicon.ico') return proxy(req, res, url);
    let file = path.join(ROOT, decodeURIComponent(url.pathname));
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err, buf) => {
      if (err) return res.writeHead(404).end('not found');
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(buf);
    });
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve({ server, port: server.address().port })));
}

/** Resolve a CLI video argument (name, dir or index.html path) to its URL path. */
export function videoPath(arg) {
  if (!arg) throw new Error('usage: <video name or path>');
  let dir = fs.existsSync(path.join(ROOT, 'videos', arg)) ? path.join(ROOT, 'videos', arg) : path.resolve(arg);
  if (dir.endsWith('.html')) dir = path.dirname(dir);
  if (!fs.existsSync(path.join(dir, 'index.html'))) throw new Error(`no index.html in ${dir}`);
  if (!dir.startsWith(ROOT)) throw new Error('videos must live inside the framework directory');
  return { dir, name: path.basename(dir), urlPath: '/' + path.relative(ROOT, dir).split(path.sep).join('/') + '/' };
}
