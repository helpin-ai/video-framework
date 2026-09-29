# Helpin vs Intercom: "The meter"

39.0 s · 1920×1080 (4K master) · music and effects, no voice · for helpin.ai/compare/intercom and social.
Tracked in Helpin as HEL-171 (Use-case videos epic). **The storyboard is the Helpin doc** "Storyboard: Helpin vs
Intercom — The meter" (GTM → Use-case videos, id `059e7913-278e-407d-bbf0-5eafaa239a8f`); this file is a pointer plus
the claims check.

**Concept.** Intercom bills per seat and per AI outcome, so a meter runs on every answer. One hero object, a mono
odometer, carries the film: it ticks on every resolved chat, runs through a year ($1,670 → $20,040), rolls back on the
drop and locks at $239 in mint, then holds perfectly still while teammates and AI answers pile in. The answer then
becomes the fix (live helpin.ai previews: task → pull request → follow-up), a receipt settles the maths, and the
tagline flips the product's own word: From "resolved" to "released."

**Music-first.** Three candidates in `music.json`; candidate 0 (Latin-tinged tech house, 123.07 BPM, ticking
sixteenth hats in the intro, the drop on track beat 31) was picked with `bin/beats.mjs`. `timeline.js` names the beats;
`index.html` and `cues.mjs` both import it. The bed starts at track beat 3, so the drop lands on video beat 28
(13.65 s); a second copy of the same take from track beat 37 takes over at video beat 58 (the receipt), so the groove
rides out under the end card.

```sh
node videos/cmp-intercom/cues.mjs                     # writes audio.json
npm run render -- cmp-intercom --workers 3
npm run audio -- videos/cmp-intercom/audio.json --out out/cmp-intercom/helpin-cmp-intercom.mp4
npm run render -- cmp-intercom --scale 2 --crf 14 --workers 3 --out out/cmp-intercom/cmp-intercom-4k.mp4
npm run audio -- videos/cmp-intercom/audio.json --video out/cmp-intercom/cmp-intercom-4k.mp4 --out out/cmp-intercom/helpin-cmp-intercom-4k-master.mp4
node bin/deliver.mjs out/cmp-intercom/helpin-cmp-intercom-4k-master.mp4
cp out/cmp-intercom/deliver/helpin-cmp-intercom-1080p.mp4 out/cmp-intercom/helpin-cmp-intercom.mp4   # 1080p from the 4K master
```

Note: `bin/audio.mjs` names cached clips `music-<bed index>-<hash>`, so a second bed with the same prompt is *not* a
cache hit; it generated a different take. The stray take is kept at `out/cmp-intercom-music/unused-second-take.mp3`
and `out/audio-cache/music-1-007d14029e8a2fbb.mp3` is a byte copy of take 0, so both copies play the same music.

| Beats (s) | Picture | Copy |
|---|---|---|
| 0–12 (0–5.9) | A neutral chat card: a question types, the AI answer lands, "✓ Resolved $0.99" pops and a spark drops it into the meter. The chat becomes a feed of resolved chats scrolling ever faster, each sending +$0.99 into the meter ($990). Eight seat faces drop in, +$85 each ($1,670). Tag: Helpin VS [I] Intercom | Every AI outcome: **$0.99.** / 1,000 outcomes a month. / Plus **$85** for every seat. |
| 12–20 (5.9–9.8) | The meter shrinks to a corner pill. Maya's chat: "Our export stops at 10,000 contacts…", "Thanks, Maya. I've passed this to the team.", Resolved $0.99. The bug card peels off into a dashed box, "JIRA OR ANOTHER TOOL", which slides off frame | The chat is resolved. / *The fix is somewhere else.* |
| 20–28 (9.8–13.7) | The meter centre stage: THIS MONTH → THIS YEAR, × 12, twelve month cells light up amber as it rolls to $20,040 | The meter's running. |
| 28 drop (13.65) | The digits spin back and lock at $239, amber turns mint, Intercom → Helpin, /mo | Stop *the meter.* |
| 32–37.5 | 8 → 20 → 40 teammate faces under the still meter (Teammates 8 → 40, Included) | UNLIMITED TEAMMATES · Every teammate. *One workspace price.* |
| 37.5–43 | Live preview: Helpin AI answers Maya, "Answered with product knowledge"; the meter a still pill above | AI INCLUDED · AI answers, *included in the plan.* · Every Cloud plan includes an AI usage allowance. |
| 43–58 | Live coding-agent card (EXP-142 task → diff and regression test → Lens review, "Pull request open for review"), then the follow-through card (Released, "Helpin AI → Maya · Sent") | THE ANSWER BECOMES THE FIX · TASK. / *PULL REQUEST.* / FOLLOW-UP. + small print |
| 58–66 | Receipts side by side, rows ticking in; the verdict counts up | LIST PRICES · 8 TEAMMATES · 1,000 AI OUTCOMES A MONTH · BILLED ANNUALLY · **$17,172 less a year.** · footnote |
| 66–72 | Tagline | From "resolved" / *to "released."* |
| 72–80 | End card, fade in the last 0.7 s | Helpin · Start free at helpin.ai · 14-day trial · no card · or self-host free |

## Claims check

Competitor facts: `helpin/website/src/app/(site)/compare/compare-data.ts` (checked 2026-09-26; sources: Intercom plans
explained, seats, Fin AI agent outcomes, pricing FAQ).

- **"Every AI outcome: $0.99" / "1,000 outcomes a month"**: "Fin at $0.99 per outcome", Intercom's own word (Fin AI
  agent outcomes article); the receipt says "1,000 Fin outcomes × $0.99". (Storyboard said "Every AI answer"; an answer
  that doesn't lead to an outcome isn't billed.) The chat chips say "Resolved" as the chat's state.
- **"Plus $85 for every seat"**: Advanced is $85 a seat a month billed annually. (Storyboard said "a seat for every
  teammate"; changed because Intercom's higher plans include Lite seats, so not every teammate needs a paid seat.)
- **The meter** is the page calculator's default scenario: 8 seats on Advanced ($680) + 1,000 Fin outcomes ($990) =
  $1,670 a month; × 12 = $20,040 a year. Labelled "Example · Advanced plan · billed annually".
- **"The fix is somewhere else" / "JIRA OR ANOTHER TOOL"**: "Intercom focuses on resolving the conversation and hands
  product work to tools like Jira" (compare reasons); project management "through integrations such as Jira" (table).
- **Helpin $239 /mo**: Growth, billed annually (`website/src/app/pricing/pricing-data.ts`). "Unlimited teammates on
  every plan", "AI usage allowance included in every Cloud plan", Growth annual allowance $239 (`aiPricing`).
- **Receipt and "$17,172 less a year"**: the /compare/intercom calculator at its defaults (8 teammates, Advanced,
  1,000 Fin outcomes, annual, Helpin Growth): (1,670 − 239) × 12 = 17,172. Helpin per year 239 × 12 = 2,868.
  Footnote = the calculator's notes: list prices, billed annually, checked September 2026; Intercom add-ons and channel
  usage not included; heavy AI use can go past Helpin's allowance, overage is metered.
- **Task → pull request → follow-up**: compare page ("a support conversation can become a task on the roadmap"),
  the AI agents page's coding card (live preview) and the support page's follow-through card (live preview).
  Follow-up after release is a committed roadmap claim. Small print: coding agents need a connected GitHub or GitLab
  repository.
- **AI answer preview**: the support page's "answer" card (live preview).
- **CTA**: "Start free", 14-day trial, no card, self-host free (compare page hero and CTA).
- **Guardrails**: Intercom is named in text only, with the compare page's monogram chip; the chat widget is our own
  neutral design ("AI agent", no Fin branding or Intercom colours); no logos.
