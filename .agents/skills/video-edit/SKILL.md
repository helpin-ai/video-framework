---
name: video-edit
description: Change a finished MP4 whose source isn't in this repo, e.g. replace its ending, remove an on-screen element, re-cut a section, or add sound, by rebuilding only the changed span in the framework and splicing it in on exact frames. Use when the user shares a video file or link and asks for edits.
---

# Editing a finished video

The launch reel was edited this way: the original MP4 (0–31.2 s) plus a new ending built
in `videos/launch-ending`, joined at frame 937. The join can't be seen.

Always ask for the original source first (for the launch reel, `launch.html` from the
author). With the source, bring it into `videos/<name>` and edit it directly using the
helpin-video skill. Use this skill when the source isn't available, or while you wait for it.

## Steps

1. **Get the file** into `reference/` (gitignored). Download public links with `curl -sSfL -o`.
2. **Map it.** You can't watch it, so sample it:
   ```sh
   npm run inspect -- reference/x.mp4                        # info + overview
   npm run inspect -- reference/x.mp4 --every 1 --from 28    # around the section to change
   ```
   Build a timeline of scenes and cuts, and check it against any storyboard you have.
3. **Choose the cut point.** Pick a frame where the picture is only background, usually the gap
   between a fade-out and the next fade-in. Check frame by frame with a shadow boost, because faint
   ghosts are easy to miss:
   ```sh
   npm run inspect -- reference/x.mp4 --frames 933-942 --crop 100,200,560,140 --boost
   ```
   Only a frame with no text of either scene is safe. For the launch reel, frames 937–938 were clean,
   while 936 still had the old headline and 939 already had the new eyebrow.
4. **Plate.** Export that clean frame as the new section's background:
   `ffmpeg -i x.mp4 -vf "select=eq(n\,937)" -frames:v 1 videos/<new>/plate.png`. Start the new
   section on the plate unchanged, so the first frame matches the join exactly, then add slow motion (scale
   1 → 1.045) so it doesn't look frozen.
5. **Match the look.** Pull full-resolution stills of neighbouring scenes and copy their layout, type sizes,
   colours and entrance style. Layouts the viewer has already seen (eyebrow + headline + card)
   make the new part feel native.
6. **Build the section** in `videos/<new>/` with `OFFSET = cutFrame / fps` and `A(abs)` for
   scene bounds, so the times in the code read as reel times. Review it with the helpin-video skill.
7. **Render and splice:**
   ```sh
   npm run render -- <new>
   npm run splice -- --base reference/x.mp4 --at 937 --insert out/<new>/<new>.mp4 --out out/<name>/<name>-picture.mp4
   npm run inspect -- out/<name>/<name>-picture.mp4 --frames 934-940
   ```
   Check the frame count and duration against the original, then read the join frames.
8. **Sound.** Re-time the sound effects in the changed span to the new beats, and keep the approved music (see video-sound).
   Mux onto the spliced picture.

## Notes

- The splice re-encodes the whole picture once (x264, CRF 16), which is visually lossless for this footage.
- To remove an element from a finished video (a URL, a badge), rebuild the whole scene that contains it.
  Patching pixels over animated backgrounds shows.
- Keep the user's original file untouched in `reference/`, and write every output to `out/`.
