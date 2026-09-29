# Helpin vs Linear: "The customer attached"

34.6 s · 1920×1080 (4K master) · music and effects, no voice · for helpin.ai/compare/linear.
**Storyboard (source of truth):** Helpin Docs, GTM → Use-case videos → "Storyboard: Helpin vs Linear — "The customer attached""
(`b8bdc164-a440-4058-a1a9-e256515e22f0`), linked to HEL-175. This file only holds the claims check and build notes.

**Device:** keycaps pressed on the beat (C creates, J walks the selection, Enter opens EXP-142; one keycap per station),
and the customer card that snaps onto the task like a magnet on the drop, then rides into every station as a chip.

**Music-first:** three candidates were requested in `music.json`; two hit the account's concurrent-request limit and
one was retried (`out/cmp-linear-music/`). Bed 0 (dark minimal bass house, keyboard-click hats, 123.07 BPM) has the
best shape: a steady keyboard intro, near silence for four beats, the drop on its beat 31, full to the end. It plays
from 4.13 s, so the drop lands on video beat 23 (11.21 s). `timeline.js` names the beats; the page and `cues.mjs`
use the same names. The score is deliberately darker than One prompt's bright minimal tech house.

```sh
node videos/cmp-linear/cues.mjs
npm run render -- cmp-linear --workers 3
npm run audio -- videos/cmp-linear/audio.json --out out/cmp-linear/helpin-cmp-linear.mp4
```

| Beats | Picture |
|---|---|
| 0–5 | HELPIN VS [L] LINEAR. "Your issues / move fast." C C C adds three issues, J J J walks to EXP-142, ↵ opens it |
| 6–11 | "Who asked / for this?" Sam types it on the issue; Customer: "Linked from your support tool" |
| 12–18 | "The customer is in another tool. / So is the context." The issue beside "Your support tool" (Maya's conversation, earlier workaround, account); a coding agent picks up the issue with "Context: the issue title" |
| 19–22 | The music drops out. "Who tells them / it shipped?" Released ✓, a dashed arrow stops at a "?"; Maya's card lifts off |
| 23 (drop) | The card snaps onto the task, which becomes a Helpin task back at In progress; "Plan the work / with the customer attached."; Conversation ✓ Earlier workaround ✓ Account ✓. A "Maya Chen · Northstar · attached · In progress" chip rides into each station |
| 31 | [1] SUPPORT: "Support inbox and help center, built in." Live support inbox → Ask Agent links EXP-142 with Maya's conversation |
| 37 | [2] CODE: "Agents read the conversation. / You review the PR." Live coding agent, a shot per step to "Pull request open for review" |
| 44 | [3] FOLLOW UP: "Your customer / hears back / in the same thread." Live follow-through: Released (the chip flips to ✓ Released) → "The export fix is live" sent |
| 50 | Chart: Linear Business $16/user vs Helpin Growth $239, 1–40 people; "From 15 people, / Helpin costs less." "And support is included." |
| 58 | [4] MCP (BETA): "Not ready to move? / Keep Linear. / Connect it through MCP." |
| 63–71 | "Plan the work / with the customer attached." Helpin · Start free at helpin.ai · 14-day trial · no card · or self-host free |

## Claims check

- Linear: per user, Business $16 a month billed annually; customer requests are linked from support tools such as
  Intercom and Zendesk; no support inbox, live chat or help center; coding sessions use prepaid AI credits; hosted only.
  Source: `helpin/website/src/app/(site)/compare/compare-data.ts` (checked 2026-09-26; Linear pricing, customer
  requests, AI credits).
- Crossing point: $16 × 15 = $240 > $239 (Growth, billed annually); $16 × 14 = $224. Matches the page calculator's
  chart ("From 15, Helpin costs less"). Footnote on screen: list prices, billed annually, checked September 2026;
  Linear needs a separate support tool; its coding sessions use prepaid AI credits.
- Helpin: support inbox and help center built in; agents see the customer conversation, earlier workarounds and
  account context and open a pull request for review (compare page "reasons"); follow-up in the same conversation
  (committed roadmap); Helpin's agents can use Linear's tools through MCP (beta) (compare page switching steps);
  Growth $239 a month billed annually (pricing-data.ts); support, CRM and meetings included (compare page calculator
  note); 14-day trial, no card, self-host free (compare page CTA). Coding agents need a connected GitHub or GitLab
  repository (small print on station 2).
- The live previews are helpin.ai website previews (`/products/customer-support`, `/products/ai-agents`).
- Our own generic tracker design for the issue list and the "support tool"; Linear appears only as a name and the
  compare page's "L" monogram chip. No logos, no UI lookalike, no purple.
- Fictional demo data from the site: Maya Chen at Northstar, Sam Rivera, EXP-142, 10,000 of 18,400 contacts.
