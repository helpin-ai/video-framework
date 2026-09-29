// Music-first: the picture follows the chosen bed's own grid, measured with
//   node bin/beats.mjs out/audio-cache/music-1-e3d68e0174b7ac56.mp3 --bpm 128 --json out/cmp-zendesk/beats-1.json
// 129.19 BPM, first beat at 0.02 s. In the file the break plays low-pass filtered for beats 0–15, the filter snaps
// open on beat 16 (+9 dB), a lift lands on beat 31–32, there's a one-beat dip at 47–48, and the track ends on beat 72.
//
// audio.json cuts the bed on the beat grid to fit the story (every splice sits on a scene change):
//   video beats 0–7   = file beats 0–7
//   video beats 8–43  = file beats 4–39   (one extra filtered bar, so the hook gets 20 beats; splice at "three")
//   video beats 44–83 = file beats 32–71  (two lift bars again; splice as the camera lands on "told")
// So the drop is video beat 20, the dip lands on the chart (video 59) and the final hit (video 84) is faded out.
export const MUSIC = { bpm: 129.19, first: 0.02, period: 0.46443 };
export const B = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of video beat n
export const FILE = (n) => +(MUSIC.first + n * MUSIC.period).toFixed(3); // time of file beat n in the bed
export const SPLICES = [{ at: 8, from: 4 }, { at: 44, from: 32 }];     // video beat → file beat it jumps to
export const DURATION = 39.0;                                            // just before video beat 84 (the track's last hit)

// Named beats (video beat indices).
export const N = {
  // hook: the split (filtered break)
  seam: 0, open: 0.5, labels: 1, cards: 1, reply: 1.5, solved: 2, headA: 2, stall: 3, headB: 3,
  // the seam slides: three tools, three versions of the story
  three: 7.5, chip1: 8.5, chip2: 9, chip3: 9.5, snap: 10.5,
  // the villain: Solved. | Still broken.
  villain: 13, broken: 14, strike: 15, pull: 16.5,
  // the drop: the seam slams shut and becomes the spine
  drop: 20, one: 21, oneOut: 26.5,
  // stations down the spine (the camera lands on the bar line)
  task: 28, pr: 36, told: 44, crm: 52,
  // price (on the track's one-beat dip), tagline, end
  chart: 59, tag: 69, loop: 71, end: 76,
};
