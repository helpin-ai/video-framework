# Launch voices (YC-style launch video)

62.4 s · 1920×1080 · four people talking to camera, then a narrator over live helpin.ai demos · output
`out/launch-voices/helpin-launch-voices.mp4`.

The format of a YC launch video: real-looking people say the problem in their own words, then the product answers each
of them. The people are **fictional, AI-generated characters**: a support lead, an engineer, a product manager and a
founder. They're labelled by role only, never named, and never presented as Helpin's founders or customers. There's no
on-screen AI tag (the user's call, Sep 26); when posting, use the platform's AI-content label where it asks. They only
describe the problem; the claims come from the narrator and the product.

## How the people are made (`bin/cast.mjs`, `cast.json`)

1. Portrait: Higgsfield Soul, 1080p, video-call framing (about $0.19 each).
2. Line: ElevenLabs eleven_v3 in the character's voice (Jessica, Will, Matilda, Roger), used as the audio reference.
3. Clip: Seedance 2.0 reference-to-video on Higgsfield animates the portrait speaking the line, with natural head and
   hand motion and lips in sync with its own speech (about $1.06 per 5 s at 720p). Higgsfield's `speak` model failed on
   every input (Sep 26) and ElevenLabs' avatar API (Creatify Aurora) needs a Pro plan, so neither is used.
4. Voice: ElevenLabs speech-to-speech turns the clip's speech into the character's voice; the timing holds (word starts
   within 0.02 s), so the lips stay in sync. A transcript gives the word timings for the captions.

The narrator is River (`script.json` → `vo.json`), each line pinned to a beat of the music (99.4 BPM, bed
`music-0-251a5830c147d4d6`, soft under the four people, the full band from 16.0 s; the bed starts five beats in).

**Pace (Sep 26 feedback: "the starting video feels a bit slow").** `cuts.json` holds the talking-head cuts, shared by the
page and `cues.mjs`: each starts about 0.1 s before its first word and ends 0.1 s after its last, and they play at 1.15×
(picture and voice together; the voice through a pitch-preserving `atempo`), so the lips stay in sync. The opening went
from 16 s to 12.7 s.

```sh
node --env-file=.env bin/cast.mjs videos/launch-voices/cast.json
node --env-file=.env bin/vo.mjs videos/launch-voices/script.json
node videos/launch-voices/cues.mjs
npm run render -- launch-voices
npm run audio -- videos/launch-voices/audio.json --out out/launch-voices/helpin-launch-voices.mp4
```

| Time | Voice | Picture |
|---|---|---|
| 0–12.7 | Support lead: "I answer the same question five times a week." Engineer: "Bug reports show up with zero context. Who asked for this?" PM: "Half my week is copying things from one tool to another." Founder: "Our customer lives in five tools. And none of them talk." | Full-frame talking heads, hard cuts, punch-in jump cuts, word-timed captions, role chips |
| 13.0–16.6 | "Same customer. Same story. Split across five tools." | The four in a video-call grid; Maya Chen (Northstar) in the middle, a thread to each; the tiles split apart, each with its tool |
| 16.6–22.6 | "Helpin brings support, projects, CRM, meetings and docs into one open-source workspace." | The tiles fly into the Helpin mark; the lock-up; the five modules pop on their words |
| 22.9–29.5 | "Echo answers the repeat questions from your docs and past conversations, and hands your team the rest." | Support lead's quote → live demo: Maya asks how to export selected contacts; Helpin AI answers with the doc |
| 29.5–35.6 | "Bugs arrive with the customer's conversation attached, and a coding agent can prepare the fix for review." | Engineer's quote → live coding-agent demo: the task with Maya's conversation attached, the change, the review |
| 35.6–41.6 | "Turn a conversation into a task, or link it to one already underway. No copying." | PM's quote → live projects demo: Maya's SSO request becomes a proposed task |
| 41.6–46.4 | "Email, meeting notes and the linked task live on one customer record." | Founder's quote → live CRM record for Maya Chen |
| 46.4–51.9 | "When the fix ships, Helpin prepares the customer update. A teammate approves it." | Live follow-up demo: EXP-142 released → "The export fix is live" to Maya, approved by Sam |
| 51.9–56.1 | "Helpin is open source. Self-host it free, or let us run it." | "Open source." and the real install command typing |
| 56.1–62.4 | "One workspace. The whole story. Try it free at helpin.ai." | The four again with checks; the lock-up; Start free at helpin.ai |

## Claims check

- Support, projects, CRM, meetings and docs in one connected workspace; open source: README.
- Echo answers from docs and past conversations and hands off the rest: helpin.ai customer support ("Use product
  knowledge, customer history, and selected tools… Choose direct AI replies or assistance your team reviews"; "Pass on
  the findings, not just the ticket") and the launch film's claims.
- Bugs with the conversation attached; a coding agent prepares the fix for review: helpin.ai customer support ("For a
  bug, bring in a coding agent to prepare the fix as a pull request for your team to review") and AI agents.
- "Turn a conversation into a new task, or link it to one already underway": helpin.ai projects (#project-context).
- "Email, meeting notes, and the linked task, summarized on one record": helpin.ai CRM (#crm-record).
- "Helpin prepares the customer update… A teammate approves it before it goes to the original conversation":
  helpin.ai projects (#project-followup); the follow-up after release is a committed roadmap claim.
- Open source, self-host free, or let us run it; `curl -fsSL https://helpin.ai/install.sh | bash`: README, helpin.ai.
- The four people state problems, not product claims or testimonials. Every product screen
  is a live helpin.ai demo (`lib/site.js`), with the site's own demo data (Maya Chen at Northstar, Sam Rivera, EXP-142).
