# Helpin vs Zendesk: "Solved. Still broken."

39 s · 1920×1080 (4K master) · music and effects, no voice · for helpin.ai/compare/zendesk and social.
Tracked in Helpin as HEL-172 (Use-case videos epic).

**Storyboard (source of truth for copy and timing):** Helpin Docs, GTM → Use-case videos →
"Storyboard: Helpin vs Zendesk — "Solved. Still broken."" (`a17a280e-7816-4f09-bb32-e1377d9e2120`).
This file only keeps the build notes and the claims check.

**Concept.** A seam splits the frame: THE TICKET on light paper (Solved ✓) and YOUR CUSTOMER on forest (export
stopped at 10,000 of 18,400). The seam slides to make room for three tools, comes back for "Solved. | Still broken."
split across it, pulls apart, then slams shut on the drop and becomes the mint spine of one history that the camera
travels down: Task → Pull request → Told → CRM. Then the crossing chart, "Don't close the ticket. Close the loop."
(a loop draws closed) and the end card.

**Music-first.** Three big beat / breakbeat candidates (`music-candidates.json`); `bin/beats.mjs` picked bed 1
(129.19 BPM, filtered break to beat 16, the filter opens with +9 dB, full to beat 72). `timeline.js` names the beats
and the two on-beat splices that fit the take to the story (an extra filtered bar before the drop, two lift bars
repeated as the camera lands on "Told"). The page and `cues.mjs` use the same numbers.

**Sound notes.** The bed is also cut at the drop (a continuous file position) so the filtered intro can sit 7 dB
under the groove; loudnorm's dynamic mode still lifts it back to within ~2–3 dB broadband, and the drop reads through
the filter opening (+15 dB above 2 kHz). audio.mjs names cache files by bed index, so the chosen take
(`music-1-e3d68e0174b7ac56.mp3`) is copied as `music-0/2/3-e3d68e0174b7ac56.mp3` (same request hash, no API call).
The ticket world gets paper sounds (pencil, marker, card), the product clean digital ticks and chimes.
Card image: `--card 7.5` (Solved. | Still broken.). `cmp-zendesk-probe/` is the preview-timing probe.

```sh
node videos/cmp-zendesk/cues.mjs                       # writes audio.json
npm run render -- cmp-zendesk --workers 3
npm run audio -- videos/cmp-zendesk/audio.json --out out/cmp-zendesk/helpin-cmp-zendesk.mp4
npm run render -- cmp-zendesk --scale 2 --crf 14 --workers 3 --out out/cmp-zendesk/cmp-zendesk-4k.mp4
npm run audio -- videos/cmp-zendesk/audio.json --video out/cmp-zendesk/cmp-zendesk-4k.mp4 --out out/cmp-zendesk/helpin-cmp-zendesk-4k-master.mp4
node bin/deliver.mjs out/cmp-zendesk/helpin-cmp-zendesk-4k-master.mp4 --card 7.5
```

**Live previews.** The site starts each preview when it scrolls into view (IntersectionObserver), so a window's
preview clock stays at 0 until the window is fully on screen, then steps to 0, waits four real frames and catches up
(`drive()` in index.html). Measured preview times: Ask Agent panel ≈2.1 s, "Used the existing task EXP-142" ≈4.4 s;
coding agent diff 0.6 / test 2.0 / Lens 2.5 / PR 3.0 s; follow-through Released ≈1.1 s, Sent ≈3.4 s (played at 1.6×);
CRM held at 2.2 s, before its Ask Agent panel opens.

## Claims check

- **The ticket and the export are generic HTML**, not Zendesk's UI: a "Help desk" ticket card in Helpin's own style,
  and the demo story's export (Maya Chen at Northstar, 10,000 of 18,400; helpin.ai previews). No Zendesk logo,
  colours or UI; Zendesk is named in text with the compare page's monogram chip.
- **"The fix: Jira or another tool"**: compare-data.ts, Zendesk reason "The fix happens in another tool"
  (lane "Ticket → Jira or another tool").
- **"Zendesk Sell · retiring Aug 2027" / "Zendesk Sell retires August 31, 2027."**: compare-data.ts glance row and
  FAQ ("Zendesk Sell will be retired on August 31, 2027"), source: Zendesk's Sell retirement announcement.
- **"The bill: per agent"**, **"Zendesk Suite Team · $55 per agent"**: compare-data.ts table (per agent: Suite Team $55,
  Professional $115 a month billed annually).
- **"From 5 agents, Helpin costs less."**: list-price arithmetic matching the page calculator's chart:
  $55 × 4 = $220 < $239, $55 × 5 = $275 > $239 (Helpin Growth, billed annually, pricing-data.ts). Chart end labels:
  20 × $55 = $1,100; Helpin $239 per workspace. Footnote on screen: "List prices, billed annually, checked September 2026.
  Zendesk AI resolutions and Copilot not included." (calculator notes).
- **"Unlimited teammates. AI usage included."**: pricing (Users: unlimited), compare-data HELPIN.ai ("AI usage allowance
  included in every Cloud plan").
- **Task / pull request / told / CRM stations** are live helpin.ai previews (customer-support, ai-agents, crm pages).
  "A coding agent prepares the change and a regression test, then opens a pull request" matches the ai-agents preview;
  on-screen note "Coding agents need a connected GitHub or GitLab repository" (site footnote). The follow-up after release
  ("Approved by Sam · Sent after release") is a committed roadmap claim. CRM: contacts, companies and deals built in
  (compare-data HELPIN.crm).
- **"One history, from ticket to release."**: the compare page H1 ("Helpin vs Zendesk: one history from ticket to release").
- **End card**: "Start free at helpin.ai", "14-day trial · no card · or self-host free" (compare page CTA line).

**Copy changes from the storyboard doc:** station headlines are shortened to fit the left column at 72 px
("TASK. The ticket becomes the work." → "The ticket becomes the work."; "PULL REQUEST. Your team reviews every fix." →
"Your team reviews every fix."; "TOLD. Your customer hears back in the same thread." → "Your customer hears back." with
"In the same thread…" as the lede; "CRM. Contacts, companies and deals, built in." kept), and the station words are mono
eyebrows (01 · Task …) rather than slammed titles, per the neat-and-subtle taste notes. The hook's order is unchanged;
the drop lands at 9.3 s as the doc planned.
