# One day

~56 s · 1920×1080 · narrated (ElevenLabs "Sarah – Mature, Reassuring, Confident") · acoustic indie-pop score · output `out/film-one-day/helpin-film-one-day.mp4`

A workday with Helpin from 9 a.m. to 6 p.m. The sky follows the clock (peach dawn, cream morning, sky-blue noon,
golden afternoon, sunset, dusk, night), a sun tracks the hours and a rolling clock turns. One screen per hour.
Voice-timed: `script.json` → `bin/vo.mjs` → `vo.json`; `cues.mjs` writes the SFX cues.

| Time | Voice | Picture |
|---|---|---|
| 9:00 | "Your day starts with a briefing, not a scavenger hunt. Ask Agent pulls…" | Six app tiles scatter (the hunt), then pull into "Your morning brief" with sources |
| 10:00 | "Echo answers what your docs already cover, and hands you the rest, with context." | Inbox: four answered by Echo; Maya's export bug lifts into "For you" with context |
| 11:00 | "Decisions and action items land in your projects, each with an owner." | Planning call with notes; a decision and two actions fly into Projects; owners pop on |
| 1 p.m. | "This morning's bug is now a pull request. Forge wrote it. Lens checked it. You approve it." | The bug card morphs into PR #284; Forge and Lens chips; you click Approve |
| 3 p.m. | "It ships. Quill drafts the docs update, and the customers who asked get an answer." | SHIPPED stamp; docs edit; three customers get replies |
| 5 p.m. | "Before your renewal call, the whole account story is one question away." | Northstar's day on its record; Ask Agent's answer with sources |
| 6 p.m. | "You spent the day on the work, not the handoffs." | Sunset; the day on one line |
| night | "Helpin. Open source." | Stars, moon, the lockup, helpin.ai |

## Claims check
- Ask Agent brings conversations, work and calls together: /products/crm ("Bring the latest email, meeting decisions, support issues, and linked work into one view").
- Echo answers from docs and hands off with context: /products/ai-agents, support hero.
- Meeting decisions and action items become owned work: /products/meetings.
- Forge / Lens / approval: /products/ai-agents. Quill drafts docs updates: /products/knowledge.
- Customers who asked get an answer after release: committed claim (follow-up after release, with approvals).
- Open source: README.

## Generated footage

Seven plates via Higgsfield (`plates.json` → `node --env-file=.env bin/genvideo.mjs videos/film-one-day/plates.json`),
720p upscaled to 1080p with light grain, played as frame sequences (frame-exact). One woman carries the day: every
prompt describes her the same way (long wavy honey-blonde hair, cream cable-knit sweater).
- **sunrise** (Seedance 2.5, 0–3.9 s): she lifts her laptop lid at sunrise under the "9:00 AM" clock; the app tiles
  burst out of the laptop and the shot dissolves into the peach sky. Only frames 46–139, at 0.8×: the closed lid shows
  a laptop maker's badge before frame 44 and an HP logo after ~150.
- **ten, eleven, one, three, five** (Seedance 2.0): each hour opens on its footage full frame (the clock turns white
  over it) and after about a second the shot docks into a portrait frame on the left while the product cards play on
  the right. 10: answering at her desk by the window. 11: on the planning call, taking notes. 1 p.m.: approving with the
  engineer at his desk. 3: the team celebrating the release. 5: sitting down for the renewal call with an earbud. The
  first `five` take had a logo on the laptop she carried in, so it was regenerated with a notebook and no devices.
- **dusk** (Seedance 2.5, 6 p.m.): an office at sunset, someone closing their laptop and heading out, under a scrim
  with the wrap-up type and timeline.
Lids, monitors and notebooks were cropped at full size and checked for brand marks and readable text.
