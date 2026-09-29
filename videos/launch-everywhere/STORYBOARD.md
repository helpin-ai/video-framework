# Everywhere: Helpin launch film

50 s · 1920×1080 · 30 fps · narrated (ElevenLabs "Lily – Velvety Actress") · output `out/launch-everywhere/helpin-launch-everywhere.mp4`

Motion level benchmarked on the Cosmos launch video made with HyperFrames (Sep 25, `reference/cosmos`); the concept is
Helpin's own: **one emerald thread** stitches a customer's scattered story back together.

Everything sits on one 120 BPM grid (`timeline.js`): `script.json` pins each voice line to a beat, the page animates
on the same times, `cues.mjs` places every effect on them, and four music beds cut with the picture's hard cuts.

```sh
node videos/launch-everywhere/prep.mjs                                  # photo tiles from existing plates
node --env-file=.env bin/vo.mjs videos/launch-everywhere/script.json    # voice, pinned to the grid
node videos/launch-everywhere/cues.mjs                                   # audio.json: beds + effects
npm run render -- launch-everywhere
npm run audio -- videos/launch-everywhere/audio.json --out out/launch-everywhere/helpin-launch-everywhere.mp4
node bin/beats.mjs out/audio-cache/music-….mp3 --bpm 120                 # check a bed's tempo and phase
```

| Time | Voice | Picture | Sound |
|---|---|---|---|
| 0–5.5 | "Once. Twice. Three times. Every handoff, your customer starts over." | Full-bleed hard cuts (Maya, the support specialist, Sam) with Maya's same message each time: a chat, an email, an engineering thread. Then Maya again, greying out: "I already told you this." | A cut hit and a message pop on each; sparse intro bed |
| 5.5–10.5 | "Their story is everywhere." | Her frame shatters into 48 tiles that land as a wall of fragments; the needle stitches one tile per column; the wall tilts into 3D and collapses into a knot | Shatter, cascade, a thread zip, a pluck per stitch, a reverse whoosh into the drop |
| 10.5–13.75 | "One customer. One record." | The knot becomes the Helpin mark; the wordmark sets letter by letter; Support · Projects · CRM · Meetings · Docs | The drop, a chime, letter ticks |
| 13.75–19.5 | "Ask anything. Get the whole story." | The mark shrinks to a dot that grows into the Ask bar, a question types, enter: a burst and a fly-through; the story lands on one thread | Typing, enter, a sparkle burst, a fly-by whoosh, a bead click per card |
| 19.5–30.25 | "AI agents that do more than answer." "Echo answers from your docs." "Forge prepares the fix." "Lens reviews it." "Quill updates the docs." | The agents lift out of the story. Maya's card drops onto the thread and rides through one beat per agent, on its colour: Echo's reply with sources, Forge's diff, Lens's checks, Quill's doc edit. Each agent stamps the card (3 sources → PR #284 → Reviewed ✓ → Docs updated) | A handoff whoosh per beat, a stamp per agent, keys, scan, checks, strike |
| 30.25–33.5 | "You choose when they ask first." | Echo's refund tool switches to Ask first; the request waits at the gate; the cursor approves | Toggle, click, success |
| 33.5–36.75 | "Open source." "Your data, on your servers." | Hard cuts to dark cards | Bass slams on a stripped bed |
| 36.75–41 | "Built by the team behind ContentStudio and Usermaven." | A giant 4: products bootstrapped before Helpin, with the ContentStudio, Usermaven, Replug and Contentpen logos | A thud, pops |
| 41–44.5 | "Every handoff keeps the story." | Every fragment winds into a ball of thread (the hook's line, answered) | A winding swirl |
| 44.5–50 | "Helpin." | The mark; "Put your customer history to work.", Self-host free / Helpin Cloud, helpin.ai; a giant wordmark rises off the bottom | Gather, a bell, a rise; the bed settles |

## Claims check

- "One customer. One record." / "AI agents that do more than answer." / "Choose when it asks first." / "Your data, on your
  servers." / "Self-host free, or let us run it" / "Put your customer history to work.": helpin.ai (`website/src/app/new`).
- Open source, AGPL-3.0: README.
- Support, projects, CRM, meetings and docs: site title line.
- Echo answers from docs and history and hands off; Forge prepares the fix; Lens reviews; Quill drafts the docs update:
  /products/ai-agents, /products/knowledge (as in the launch film's claims check).
- Built by the team behind ContentStudio and Usermaven; four products bootstrapped before Helpin (ContentStudio,
  Usermaven, Replug, Contentpen): the founder, Sep 25. Logos from each product's website (`assets/logos/products`).
- No GitHub URL shown (repo not public yet).

## Footage

No new generation: the cold open and photo tiles reuse the launch film and One day plates, from ranges already checked
for brand marks (`sam` from frame 100; `sunrise` inside 46–139; `maya-smile`, which shows a laptop logo, isn't used).
