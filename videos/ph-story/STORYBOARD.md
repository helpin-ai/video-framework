# The story block (Product Hunt, narrated)

76 s · 1920×1080 (4K master) · narrated (ElevenLabs "Bella – Professional, Bright, Warm") · output
`out/ph-story/helpin-ph-story.mp4`, delivery set in `out/ph-story/deliver/`.

Benchmark: CircleCI's explainer (`reference/circleci`): a glowing code-block character that travels the whole story on a
dark stage, neon particles, orbiting rings, light trails and bloom, red "bug" pieces crumbling, a pipeline drawn as a
glowing track, and a classic arc (aspiration → stakes → conflict → "what if" → the product → benefits → a quotable close),
with a warm female narrator over light, steady upbeat music (~100 BPM).

Ours, on the forest brand: a glowing **story block** made of the customer's messages, tasks and fixes. In the old way it
chips apart at every handoff (red pieces fall); it rewinds whole, opens into the Helpin mark, and rides one pipeline
from Echo to the fix and back to the customer in the same conversation.

The music was chosen first (two candidates plus a longer take, measured with `bin/beats.mjs`: 99.4 BPM, full until
73.5 s, then a natural wind-down). Every voice line is snapped to its beats (`script.json` `at`), and `music.json`
keeps the grid for the page's beat pulses.

```sh
node --env-file=.env bin/vo.mjs videos/ph-story/script.json
node videos/ph-story/cues.mjs
npm run render -- ph-story
npm run audio -- videos/ph-story/audio.json --out out/ph-story/helpin-ph-story.mp4
```

| Voice | Picture |
|---|---|
| "You're building something your customers love. And every day, they tell you what they need." | A spark blooms into the story block; customer messages orbit in and merge into it |
| "Their questions start in support, move to product, and land with engineering." | Three stations; the block hops between them on a light trail |
| "But at every handoff, a little of the story gets lost. Context disappears. Customers repeat themselves." | Red pieces chip off at every hop; the links flicker and break; the block dims; the same message arrives again and again |
| "What if the story stayed whole, from the first message to the fix?" | The pieces rewind and the block rebuilds; one line draws from the first message to the fix |
| "That's Helpin." | The block opens into the Helpin mark with a bloom flash and a ring |
| "Support, projects, CRM, meetings and docs, in one open-source workspace, with AI agents that share the whole history." | Five modules pop on their words and close into one workspace; the agents join in orbit, each threaded into it |
| "Echo answers… it hands your team everything it found. Forge prepares the fix. Lens reviews it. You approve. Quill updates the docs, and your customer hears back in the same conversation." | One glowing pipeline: the whole block rides it station by station (each agent working at its station), carrying its findings; a scan, an approval pulse; then it loops back to the first station and a green ring closes |
| "You decide what each agent can do, and when it asks first." | Agent switches; Echo's flips to Ask first |
| "So your team spends its time on the work, not the handoffs." | The team's work rises on the beat; the old handoff lines fade |
| "Helpin is open source. Self-host it for free, or run it on Helpin Cloud." | Brackets around the mark, the real install command, your server or Helpin Cloud |
| "Every handoff keeps the story." | The block, ringed; the lockup, helpin.ai, Open source, Self-host free |

## Revision (Sep 26): CircleCI density

The first cut held the block in the centre too long ("feels empty at the start"). The rebuild keeps something
transforming every beat or two and adds kinetic type:
- Opening: a ring drifts down on a trail, lands in a confetti burst, snaps into an outline that draws and fills; the
  glyph rows write themselves in; "You're building something / your customers love." frame it; a heart burst on
  "love"; seven day-dots light around it; real requests ("Export to CSV?", "SSO for our team?") swirl in on light
  trails; a speed-line push-in.
- The old way: the block launches on a beam, the camera follows it station to station, SUPPORT / PRODUCT /
  ENGINEERING slam in, then a wide shot where it hops back along the chain and chips at every handoff; a red pile grows;
  the letters of "lost." fall; "Context" turns to dust; "Customers repeat themselves." stutters three times.
- The rest: the rewind, a flash reveal with a confetti burst, module names that fly into place, agents swirling in on
  trails, a camera ride down the pipeline with big station names (BUG and APPROVED slams, the fix typing, three checks,
  the docs rewrite), a zoom out to reveal the loop, "The fix is live ✓", "You decide." with switches, "On the work, not
  the handoffs." over rising bars, open source with the install command, rings, and a confetti lockup.

## Claims check

- One open-source workspace for support, projects, CRM, meetings and docs; AI agents with the full customer context:
  helpin.ai, README.
- Echo answers from docs and past conversations and hands off what it found; Forge prepares the fix; Lens reviews;
  Quill updates the docs; the customer hears back in the same conversation (committed roadmap claim): as in the launch
  film's claims check.
- You decide what each agent can do and when it asks first: helpin.ai ("Choose when it asks first").
- Open source, self-host free, Helpin Cloud, `curl -fsSL https://helpin.ai/install.sh | bash`: README, helpin.ai.
- "Context disappears. Customers repeat themselves.": the problem framing, not a product claim.
- Ending: "Don't lose context between tools and handoffs. Keep everything in one place." (the user's line). The tool logos
  (Intercom, Zendesk, Help Scout, Linear, Jira, Asana, Trello, ClickUp, GitHub, HubSpot, Notion, Confluence, Google Docs,
  Zoom, Google Meet, Gmail) come from simple-icons (`prep-logos.mjs` → `logos.json`) and are used only to name the tools.
