# Helpin vs Help Scout: "Past Send"

38.8 s · 1920×1080 (4K master) · no voice, music and effects · for helpin.ai/compare/help-scout.
Tracked in Helpin as HEL-173 (Use-case videos epic). **The storyboard is the Helpin doc**
"Storyboard: Helpin vs Help Scout — Past Send" (GTM → Use-case videos, id `cf06fe55-f60d-4cdf-a997-d7d8709a1957`).
This file only keeps the build notes and the claims check.

**Device:** a calm inbox on paper. You hit Send, the camera pulls back past the inbox's edges onto a dark desk, and the
work walks off the page (bug → Jira, renewal → a CRM, call notes → a notes app). On the drop the frame widens: the same
inbox docks into a Helpin workspace and the loose ends dock into Projects, CRM and Meetings.

**Music-first.** Three candidates in `music-candidates.json`; candidate 1 (prompt bed, 123.06 BPM) was picked for its
calm, sparse intro and a full groove from its beat 16 to 39 s. Its first two bars play twice so the drop lands on the
video's beat 24 (12.0 s); see `timeline.js` and `cues.mjs`.

```sh
node videos/cmp-help-scout/cues.mjs
npm run render -- cmp-help-scout --workers 3
npm run audio -- videos/cmp-help-scout/audio.json --out out/cmp-help-scout/helpin-cmp-help-scout.mp4
npm run render -- cmp-help-scout --scale 2 --crf 14 --workers 3 --out out/cmp-help-scout/cmp-help-scout-4k.mp4
npm run audio -- videos/cmp-help-scout/audio.json --video out/cmp-help-scout/cmp-help-scout-4k.mp4 --out out/cmp-help-scout/helpin-cmp-help-scout-4k-master.mp4
node bin/deliver.mjs out/cmp-help-scout/helpin-cmp-help-scout-4k-master.mp4
```

`cmp-help-scout-probe/` renders the four live previews over time (their key moments are mapped in `STATIONS`).

## Deviations from the storyboard doc

- Meetings station: the headline is "Every call, on the same history." and the lede carries "Notes from Meet, Zoom, Teams
  and Webex, linked to the customer and the work." (the doc's one-line headline was five lines at 76 px).
- Projects station lede: "Create the task from the conversation. The request stays attached." (matches the preview:
  "Task created with its context").
- The video runs 38.8 s (doc: about 35 s) so the receipt's number holds for 1.7 s.

## Claims check

- Help Scout (compare-data.ts, checked 2026-09-26, sources: Help Scout pricing and AI agent pages): priced per user,
  Plus $45 a month billed annually; AI Answers at $0.75 per resolution; project work through the Jira integration on Plus
  ("Bug → Jira" is text only); hosted by Help Scout. Named in text with the compare page's monogram chip; no logo, no UI
  lookalike (the calm inbox is our own generic design).
- Receipt = the /compare/help-scout calculator defaults: 8 teammates, Plus, 300 AI resolutions, billed annually, Helpin
  Growth: 8 × $45 = $360, 300 × $0.75 = $225, $585 a month; Helpin $239 with 8 teammates included and a $239 AI usage
  allowance (pricing-data.ts, aiPricing growth annual); (585 − 239) × 12 = $4,152 a year. Footnote as the calculator's
  own note: "For one or two users, Help Scout's free and Standard plans can cost less."
- Helpin: projects, CRM and meetings (Meet, Zoom, Teams, Webex) on one customer history; AI usage allowance included in
  every Cloud plan; unlimited teammates (compare page, pricing). Help Scout Docs import into Helpin Knowledge is
  available now (compare page switching steps). CTA "Start free at helpin.ai · 14-day trial · no card · or self-host free"
  (compare page CTA line).
- Product UI is the live website: /products/projects `#project-context` (task created with its context),
  /products/crm `#crm-record` (Maya Chen's record), /products/meetings `.mw-preview` (SSO rollout review),
  /products/customer-support `#support-workflow` answer scene. The workspace pane contents use the site's demo data
  (EXP-142 Fix incomplete CSV exports, Northstar Labs annual renewal $42,000, Rollout review · 32 minutes).
