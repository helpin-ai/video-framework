// Sound-effect cues for the launch film, computed from the voice timings in vo.json
// (the same anchors the scene uses), written into audio.json. Re-run after bin/vo.mjs.
//   node videos/launch-film/cues.mjs
import fs from 'node:fs';
import path from 'node:path';

const dir = path.dirname(new URL(import.meta.url).pathname);
const VO = JSON.parse(fs.readFileSync(path.join(dir, 'vo.json'), 'utf8'));
const LN = Object.fromEntries(VO.lines.map((l) => [l.id, l]));
const W = (id, i = 0) => LN[id].words[i].s;
const T = {
  support: W('support'), product: W('ships', 0), eng: W('ships', 2), lost0: W('lost', 0), five: W('lost', 3), lost: W('lost', 8), lostEnd: LN.lost.end,
  keeps: W('keeps'), place: W('keeps', 7), hist: W('history', 0), proj: W('history', 1), crm: W('history', 2), meet: W('history', 3), docs: W('history', 5), one: W('history', 6), shared: W('history', 8),
  writes: W('writes', 0), docs1: W('writes', 8), past: W('writes', 10), conv: W('writes', 11), bug: W('bug', 3), hands: W('bug', 5), everything: W('bug', 11),
  task: W('task', 0), linked: W('task', 4), forge: W('fix', 0), lens: W('fix', 4), approve: W('fix', 8),
  ship: W('ship', 0), shipsw: W('ship', 2), quill: W('ship', 3), echo2: W('ship', 9), cust2: W('ship', 12), same: W('ship', 15), shipEnd: LN.ship.end,
  call: W('call', 0), ask: W('call', 3), sources: W('call', 9), control: W('control', 0), decide: W('control', 1), dodo: W('control', 6), approval: W('control', 11),
  open: W('open', 0), free: LN.open.words.find((w) => w.w.startsWith('free')).s, cloud: LN.open.words.at(-1).s, tag: W('tagline', 0), name: W('name', 0),
};
const r = (x) => +x.toFixed(3);
const cues = {
  msg: [0.35, T.writes + 0.15, T.conv + 0.35, T.cust2 + 0.55, T.same + 0.3],
  draw: [T.support - 0.1, T.product, T.eng, T.five - 0.1],
  fly: [T.product + 0.05, T.eng + 0.05],
  fall: [T.product + 0.2, T.eng + 0.2],
  pullback: [T.lost0],
  snap: [T.lost],
  swell: [T.lostEnd - 0.15],
  reveal: [T.keeps - 0.05],
  sweep: [T.place - 0.35, T.tag - 0.5],
  pluck: [T.hist, T.proj, T.crm, T.meet, T.docs],
  comet: [T.one - 0.05],
  blip: [0, 1, 2, 3, 4, 5].map((i) => T.shared + i * 0.13),
  zoom: [T.writes - 0.75],
  tick: [T.docs1, T.past, T.conv + 0.12, T.everything, T.everything + 0.22, T.everything + 0.44, T.lens + 0.25, T.lens + 0.5, T.lens + 0.75, T.ask + 0.65, T.ask + 1.0, T.ask + 1.35],
  stamp: [T.bug],
  whip: [T.hands, T.task, T.forge - 0.05, T.ship - 0.05],
  land: [T.hands + 0.95, T.task + 0.85],
  zip: [T.linked + 0.05],
  keys: [T.forge + 0.1],
  scan: [T.lens - 0.05],
  click: [T.approve],
  success: [T.approve + 0.05, T.shipEnd + 0.1],
  release: [T.shipsw],
  scribble: [T.quill + 0.45],
  overview: [T.echo2 - 0.45],
  zoomin: [T.cust2 + 0.05],
  soft: [T.call - 0.4, T.control - 0.4, T.open - 0.4],
  srcpop: [0, 1, 2].map((i) => T.sources - 0.1 + i * 0.1),
  thunk: [T.decide + 0.1, T.decide + 0.3, T.dodo, T.approval],
  bracket: [T.open - 0.1],
  shimmer: [T.open + 0.1, T.name - 0.25],
  drop: [T.free - 0.1, T.cloud - 0.1],
};
const file = path.join(dir, 'audio.json');
const j = JSON.parse(fs.readFileSync(file, 'utf8'));
j.duration = VO.total;
j.music.at(-1).length = r(VO.total - j.music.at(-1).at);
for (const k of Object.keys(cues)) if (!j.sounds[k]) throw new Error(`audio.json has no sound "${k}"`);
j.cues = Object.entries(cues).map(([sound, at]) => ({ sound, at: at.map(r) }));
fs.writeFileSync(file, JSON.stringify(j, null, 2));
console.log(`${j.cues.reduce((n, c) => n + c.at.length, 0)} cues · ${VO.total} s`);
