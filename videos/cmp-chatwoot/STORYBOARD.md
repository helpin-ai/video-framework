# Helpin vs Chatwoot: "Open all the way"

36.7 s · 1920×1080 (4K master) · music and effects, no voice · for helpin.ai/compare/chatwoot.
Tracked in Helpin as HEL-174. **The storyboard is the Helpin doc** "Storyboard: Helpin vs Chatwoot — Open all the way"
(GTM → Use-case videos, id `8a7def5a-d843-4585-a28b-afed0bec5fcf`). This file only records how the build maps to it
and the claims check.

**Device:** doors. Chatwoot's corridor: the open core swings open (neutral light), the Captain AI agent and SSO · SLAs
doors stay locked in amber, the Projects door opens onto an outside link ("Linear integration"). The camera pulls back:
"The locked room." Helpin's install types in the build, and on the drop every Helpin door opens at once (mint light).

**Music-first:** candidate B of three (`music/a.json`, `b.json`, `c.json`), chiptune-tinged electro house measured at
126.03 BPM; its drop (source beat 32) lands on video beat 28 (13.33 s). `timeline.js` names the beats; the page and
`cues.mjs` use the same names. A second copy of the same clip takes over on the tagline cut so the groove rides out.

```sh
node videos/cmp-chatwoot/cues.mjs
npm run render -- cmp-chatwoot --workers 3
npm run audio -- videos/cmp-chatwoot/audio.json --out out/cmp-chatwoot/helpin-cmp-chatwoot.mp4
npm run render -- cmp-chatwoot --scale 2 --crf 14 --workers 3 --out out/cmp-chatwoot/cmp-chatwoot-4k.mp4
npm run audio -- videos/cmp-chatwoot/audio.json --video out/cmp-chatwoot/cmp-chatwoot-4k.mp4 --out out/cmp-chatwoot/helpin-cmp-chatwoot-4k-master.mp4
node bin/deliver.mjs out/cmp-chatwoot/helpin-cmp-chatwoot-4k-master.mp4
```

| Beats | Picture |
|---|---|
| 0–6 | HELPIN VS [C] CHATWOOT. "Open source. / On your server." A terminal: `docker compose up -d`, four containers start, "→ Your support stack is running." |
| 6–11 | Chatwoot corridor: "The core is open source." Inbox, Contacts and Channels swing open, one per beat |
| 11–16 | Pan to the locked doors: "The AI agent? / A paid plan, even on your server." Padlocks drop; tags "Paid plan · from $19 per agent", "Enterprise edition" |
| 16–21 | The Projects door opens onto "Linear integration ↗": "And the fix / happens in another tool." |
| 21–24.5 | Pull back over the corridor: "The locked room." |
| 24.5–28 | Helpin terminal: `curl -fsSL https://helpin.ai/install.sh \| bash`, `"$HOME/.local/bin/helpin" install`, "✓ Bundle downloaded and verified", "→ Open http://localhost:8085" |
| 28 (drop) | Helpin corridor: Support, Projects, CRM, Meetings, Docs and AI agents open at once. "Every product feature. / Open source. AGPL-3.0." |
| 34–41 | "AI agents, in the free edition." Bring your own AI provider: OpenAI · Anthropic · OpenRouter · OpenAI-compatible. Live agent directory (/products/ai-agents), shots on Echo/Atlas, then Scribe/Forge |
| 41–50 | "The request becomes the task." → "The task becomes the PR." Live coding-agent preview (EXP-142, Maya's conversation attached → diff → Lens → pull request open for review). Small print: coding agents need a connected GitHub or GitLab repository |
| 50–57 | "Deals and meetings, on the same account." Live CRM account (Maya Chen): spotlight on the Annual renewal deal, then the "Rollout review" meeting |
| 57–64 | Self-hosted receipt, 8 agents: Chatwoot Premium 8 × $19 = $152 / mo, $1,824 / yr (Captain AI agent: Premium or higher) vs Helpin Community $0, AI agents included. "$0 for the AI agents." Footnote |
| 64–70 | "Open all the way. / From the conversation to the release." |
| 70–77 | Helpin lock-up · "Self-host free" · "or start a 14-day trial at helpin.ai" · OPEN SOURCE · AGPL-3.0 |

Preview timings (probed): the coding agent shows the diff at ≈0.6 s and Lens + the pull request by ≈3 s (played at
1.1× from beat 41.5, clamped at 3.6 s); the CRM account opens its Ask Agent panel at ≈2.5 s, so it's clamped at 2.2 s;
the agent directory is static, so the camera and spotlight carry it.

## Deviations from the doc

- Open doors are Inbox, Contacts and Channels (the doc said Inbox, Contacts, Help center, Reports): these are clearly
  part of Chatwoot's MIT core, while compare-data.ts doesn't record which tier the help center and reports sit in.
- Added "The core is open source." over the open doors, so the corridor credits Chatwoot's open core before the locks.
- CRM headline shortened to "Deals and meetings, on the same account." so it fits two lines beside the window.
- 36.7 s rather than ≈34 s, and the drop at 13.3 s rather than 11 s: both follow the chosen track's own grid.

## Claims check

- Chatwoot, from `helpin/website/src/app/(site)/compare/compare-data.ts` (checked 2026-09-26; sources listed there:
  Chatwoot pricing, self-hosted plans, license, enterprise edition, Captain on self-hosted installs, features):
  MIT core with a separate paid enterprise edition; the Captain AI agent needs a paid plan from $19 an agent, also
  self-hosted ("Captain needs a paid plan from $19 an agent"; calculator note "Captain AI needs Premium or higher");
  SSO and SLAs on Enterprise ("SLA policies and SSO: Enterprise plan"); issues through the Linear integration;
  multichannel inbox and contacts (open core).
- Hook terminal: Chatwoot's Docker Compose stack (postgres, redis, rails, sidekiq) in Docker Compose's own output format.
- Self-hosted receipt = the page calculator's self-hosted mode at its defaults: 8 agents, Premium at $19 → $152 a month,
  $1,824 a year; Helpin Community $0 with AI agents included; "both use your own AI provider and exclude your hosting
  costs" (calculator note). Footnote on screen, including "Helpin Community is a 0.2 beta".
- Helpin: every product feature open source under AGPL-3.0 (compare-data: "Every Helpin product feature is open source
  under AGPL-3.0; only Cloud billing code is separate"); Community edition includes every product, coding agents too
  (shared FAQ); self-hosted AI connects to OpenAI, Anthropic, OpenRouter or an OpenAI-compatible endpoint (Chatwoot FAQ);
  deals and pipelines plus meeting notes from Meet, Zoom, Teams and Webex (compare reasons); coding agents open pull
  requests from the task, on Cloud or self-hosted (compare reasons), and need a connected GitHub or GitLab repository.
- Install commands and localhost:8085: README "Install with the CLI" on origin/main; helpin.ai/install.sh is live.
  "Bundle downloaded and verified" paraphrases "The CLI downloads and verifies the bundle".
- End card: "Self-host free", "14-day trial" (compare page CTA line). No GitHub URL.
- Guardrails: Chatwoot is named in text with the compare page's monogram chip only; no Chatwoot logo, UI or colours.
