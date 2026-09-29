// Music-first: the picture follows the chosen track's grid (candidate B, music/b.json), measured with
//   node bin/beats.mjs out/audio-cache/music-0-78e4d6c537d9b87d.mp3 --bpm 126
// 126.03 BPM, first beat at 0.025 s. Arpeggio + kick intro (source beats 0–31), a lift on 28–31, the full groove from
// source beat 32 (15.26 s) to beat 71 (33.8 s), then a fade. The bed starts at source beat 4 (`from` 1.929 s), so video
// beat n is source beat n + 4 and the drop lands on video beat 28 (13.33 s). A second copy of the full section
// (from source beat 36) takes over on video beat 64, the tagline cut, so the groove carries through the end card.
export const MUSIC = { bpm: 126.03, first: 0.025, period: 60 / 126.03, skip: 4 };
export const B = (n) => +(n * MUSIC.period).toFixed(3); // video time of beat n (0-based, may be fractional)
export const FROM = +(MUSIC.first + MUSIC.skip * MUSIC.period).toFixed(3);
export const FROM2 = +(MUSIC.first + 36 * MUSIC.period).toFixed(3);

// Named beats (beat indices, not seconds).
export const N = {
  // hook: a self-hosted stack starts in a terminal
  hook: 0, cmd: 0.4, lines: 2, running: 4, hookOut: 6,
  // the corridor: the open core, doors swing one per beat
  hall: 6, door1: 7, door2: 8, door3: 9, core: 7.5, mit: 9,
  // the locked doors
  lockPan: 11, ai: 11.5, aiLock: 12.5, sso: 14, ssoLock: 14.5,
  // the projects door opens onto another tool
  projPan: 16, projOpen: 17, fix: 17, other: 18,
  // the villain: pull back over the corridor
  villain: 21, villainLine: 21.5,
  // the install (the swell), the drop
  install: 24.5, cmd1: 24.7, cmd2: 25.9, verified: 26.8, open: 27.1,
  drop: 28, every: 28.5, agpl: 30,
  // stations
  agents: 34, providers: 35, shot1: 36, shot2: 38.5, agentsOut: 41,
  pr: 41, prPreview: 41.5, prDiff: 43.5, prHead2: 45, prShot: 46.5, prOut: 50,
  crm: 50, crmDeal: 52, crmMeeting: 54, crmOut: 57,
  // the receipt
  receipt: 57, rivalCount: 58, yearCount: 59, helpinZero: 60, verdict: 61, receiptOut: 64,
  // tagline and end
  tag: 64, tag2: 65.5, end: 70, endCta: 71.5, last: 77,
};
export const DURATION = B(N.last);
