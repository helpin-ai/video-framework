# Helpin vs Jira: "Out of the backlog"

The storyboard lives in Helpin Docs: GTM → Use-case videos → "Storyboard: Helpin vs Jira — "Out of the backlog""
(doc `a7b9c2a5-0b28-4c3a-9bbe-56c7fbf776dd`, task HEL-178). This file keeps the build notes and the claims check.

36.6 s · 1920×1080 (4K master) · music and effects, no voice · for the hero of helpin.ai/compare/jira, which autoplays it
on a loop, so frame 0 is the composed hook and the last 0.8 s dissolves back to it.

**Device:** the request sinks. It drops into our own neutral backlog, work piles in above it, the rank climbs to #1,284
and the shaft darkens; its context splits across separate Atlassian products; Data Center's lights go out; on the drop it
rises back up as the Helpin task with the customer attached and rides through the stations.

**Music:** music.json bed 1 (prompt: nu-jazz broken beat at 124 BPM, Rhodes, walking upright bass, brushes, a horn stab
on the drop), measured 123.05 BPM. Played from 11.872 s so its drop (file beat 47) lands on video beat 23 (11.2 s).
`timeline.js` names the beats; `cues.mjs` writes audio.json from the same names.

```sh
node videos/cmp-jira/cues.mjs
npm run render -- cmp-jira --scale 2 --crf 14 --workers 4 --out out/cmp-jira/cmp-jira-4k.mp4
npm run audio -- videos/cmp-jira/audio.json --video out/cmp-jira/cmp-jira-4k.mp4 --out out/cmp-jira/helpin-cmp-jira-4k-master.mp4
node bin/deliver.mjs out/cmp-jira/helpin-cmp-jira-4k-master.mp4
```

| Beats | Picture |
|---|---|
| 0–6 | Frame 0: HELPIN VS JIRA, "Your customer asked.", Maya's message over a backlog. Support replies "Passed to engineering."; the request drops in at #12 |
| 6–12 | "“It’s in the backlog.”" Rows pile in above it, it slides out of view, the backlog dims, a marker follows it down to #1,284 |
| 12–18 | "Support, feedback and notes. Separate products." Help desk: Service Collection (per agent); Customer feedback: Product Discovery (per creator); Meeting notes: Loom (Business + AI plan); Docs: Confluence (knowledge base). The spokes to the request break |
| 18–23 | "Your own servers? Data Center is closing." A rack's lights go out; plate: closed to new customers March 30, 2026 · read-only March 28, 2029 |
| 23–29 (drop) | "Bring it back up." The request rises as Helpin task EXP-142: "The customer, attached to the work." (conversation, earlier workaround, account) |
| 29–37 | 01 · Pull request: live coding-agent preview. "Agents start with the context. You review the PR." |
| 37–44 | 02 · Follow-up: live follow-up preview (Released → Sent). "Your customer hears back in the same thread." |
| 44–51 | 03 · One workspace: Support, Projects, CRM, Meetings, Docs land in one frame; "One workspace price · AI usage included" |
| 51–59 | 04 · Open source: the README's install commands → "Open http://localhost:8085". "Open source. On your servers, for good." |
| 59–66 | "Out of the backlog. Back to the customer." |
| 66–75 | Helpin · Start free at helpin.ai · 14-day trial · no card · or self-host free; dissolves back to frame 0 |

## Claims check

Jira facts come from the `jira` entry in `helpin/website/src/app/(site)/compare/compare-data.ts` (official Atlassian
sources, checked 2026-09-28):
- Jira points help-desk teams to Jira Service Management, now sold inside Service Collection and priced per agent
  (support.atlassian.com "create issues and comments from email"; atlassian.com/collections/service/pricing).
- Jira Product Discovery is priced per creator; Loom's automatic meeting notes come with its Business + AI plan; Atlassian's
  knowledge base uses Confluence (JPD, Loom and JSM knowledge-base pages).
- Data Center: new customers can't buy since March 30, 2026; read-only on March 28, 2029
  (atlassian.com/licensing/data-center-end-of-life). The small print on screen names the announcement.
- "It's in the backlog." is a generic line, not an Atlassian quote. The backlog, rows, ranks and EXP ids are our own demo
  data in a neutral tracker design (no Jira UI, no Atlassian blue, no logos; Jira named only with the "J" monogram chip).
- No price comparison: Jira costs less than Helpin for small teams, and the page says so.

Helpin facts:
- A task with the customer's conversation attached; coding agents open a pull request for review (live helpin.ai preview,
  /products/ai-agents); "Coding agents need a connected GitHub or GitLab repository" on screen.
- Follow-up in the original conversation when the fix ships (live preview, /products/customer-support; committed roadmap).
- Support, projects, CRM, meetings and docs in one workspace; one workspace price with AI usage included (pricing page).
- Open source (AGPL-3.0), Community edition 0.2 beta; install commands exactly as the README's "Install with the CLI";
  local setup opens http://localhost:8085 (README).
