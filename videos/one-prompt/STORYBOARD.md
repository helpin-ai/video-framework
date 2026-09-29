# One prompt

50.6 s · 1920×1080 (4K master) · no voice, music and effects · output `out/one-prompt/helpin-one-prompt.mp4`.
Tracked in Helpin as HEL-170 (Open-source launch day).

Benchmark: Melvyn's Lumail launch video (`reference/lumail`, x.com/melvynx/status/2103741783234732518): 45 s of
light editorial motion graphics, music and effects only. Stacked heavy headlines with mono bracket notes, an odometer,
an old wizard UI, a dot matrix that fills, empties and turns red, a price that climbs, "your team ships with AI
agents now" and a terminal error, a pause, the reveal, "Plug in the agent you already use", one prompt with real
tool calls, the pricing wedge, and a CTA click. We keep the structure and write every line in Helpin's words.

**Our device: agent streaming.** Headlines stream in character by character behind an emerald caret, as an AI
answer does. The caret blinks on the beat through the quiet, swallows the five tools as the count rolls 5 → 1, and
on the drop grows into the Helpin icon. Warm paper, heavy Instrument Sans, JetBrains Mono notes, one emerald accent,
red only for the problem.

**Music-first.** Three candidates were generated; `bin/beats.mjs` picked the one whose shape fits the story
(120.2 BPM, full from 8.1 s, a fade to near silence around 28 s, the drop on beat 63 at 31.6 s, full until 47.6 s).
`timeline.js` names the beats, and the page and `cues.mjs` use the same names.

```sh
node videos/one-prompt/prep-logos.mjs
node videos/one-prompt/cues.mjs
npm run render -- one-prompt
npm run audio -- videos/one-prompt/audio.json --out out/one-prompt/helpin-one-prompt.mp4
```

| Beats | Picture |
|---|---|
| 0–7 | "Five tools." "Five bills." "Zero shared context." stream in and stack; notes print: [ support · projects · crm · meetings · docs ] [ per seat, per tool ] [ between them ] |
| 8–15 | [ One customer question touches ] 1 → 5 tools on an odometer, two real tool logos per count; everything greys out |
| 16–21 | A hand-off wizard: copy the ticket ✓, paste it into the tracker ✓, find the CRM record…, Next → "Please wait…"; [ Same copy-paste. Every hand-off. ] |
| 22–33 | A dot matrix: "Hundreds of customer conversations." → most empty out: "Most of them never reach the roadmap." → all turn red: "You still pay for a seat in every tool." |
| 34–39 | [ Your team grew. So did the bills. ] 12 → 60 seats, [ 12 people × 5 tools ], "Every. Single. Month." |
| 40–47 | [ Your team works with AI agents now ]: "why is Northstar upset, and is it fixed?" → connecting to your tools… → the wire breaks |
| 48–57 | The music falls away. [ And your tools can't share the story ]: "The story is split across 5 tools." Then "5 tools." alone, the caret blinking on the beat |
| 58–62 | The build: 5 → 4 → 3 → 2 → 1, a tool flying into the caret on each count; "tools." deletes, "1 workspace." types in green |
| 63 (drop) | The caret grows into the Helpin icon; "Helpin"; "The open-source workspace your team and AI agents share."; Support · Projects · CRM · Meetings · Docs |
| 70–75 | "Plug in the AI client you already use.": Claude, Codex, Cursor, VS Code, dotted paths into Helpin; MCP (beta) · SDKs · CLI · Events |
| 76–87 | One prompt: "which customers are waiting on the export fix?" → four real Helpin MCP tool calls; 23 conversations light up and fly into "EXP-142 · 23 waiting ✓"; [ One prompt. The whole story. ] |
| 88–93 | "Every module. Every teammate. One price per workspace." Teammates 12 → 120+, per-seat fees $0; "Self-host free, or let us run it, with AI included." |
| 93.5–end | The icon in a ring, the lock-up, "Start free at helpin.ai" clicked; open source · self-host free · helpin cloud |

## Claims check

- Support, projects, CRM, meetings and docs in one connected workspace; "Your team and AI agents use a shared customer
  history"; open source: README.
- AI clients: "A user can connect clients such as Codex, Claude, Cursor, VS Code, or another remote MCP client":
  `helpin/docs/public-mcp-server.md` §1. MCP is in controlled beta (helpin.ai/new/developers FAQ), so the row says
  "MCP (beta)". SDKs, CLI, and events (GitHub/GitLab, workspace, schedules): helpin.ai/new/developers.
- Tool names in the demo are real public MCP tools: `list_support_conversations`, `search_workspace`,
  `get_task_context`, `add_task_comment` (`public-mcp-server.md` §7). EXP-142 "Customer export" is the site's demo task;
  the counts are illustrative.
- "When it ships, you approve the follow-up": follow-up in the original conversation when linked work ships, with
  approvals (committed roadmap claim).
- "Every module. Every teammate. One price per workspace.", "No per-seat fees on any plan", "Self-host the complete
  open-source product for free, or let us run it with AI included": helpin.ai/pricing. "Start free": the site's CTA.
- The problem half ("Five bills", "12 people × 5 tools = 60 seats", "never reach the roadmap") is framing, not a claim
  about any named product. The tool logos (Intercom, Zendesk, Linear, Jira, HubSpot, Zoho, Zoom, Google Meet, Notion,
  Confluence) come from simple-icons (`prep-logos.mjs`) and only name the categories; the AI client logos are in
  `logos/` (lobehub icons, devicon for VS Code).
