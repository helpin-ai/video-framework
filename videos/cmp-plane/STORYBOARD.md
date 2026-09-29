# Helpin vs Plane: "Every request lands"

The storyboard is the Helpin doc **Storyboard: Helpin vs Plane — "Every request lands"**
(GTM space → Use-case videos, id `1abf6668-4b01-429a-84b8-963b591ea931`), linked to task HEL-179.
It is the source of truth for copy and timing; this file keeps the build notes and the claims check.

38.0 s · 1920×1080 (4K master) · music and effects, no voice · plays in the hero of helpin.ai/compare/plane on a loop.

```sh
node videos/cmp-plane/cues.mjs
npm run render -- cmp-plane --workers 4
npm run audio -- videos/cmp-plane/audio.json --out out/cmp-plane/helpin-cmp-plane.mp4
```

**Device:** forest-green paper planes over a light paper sky. Requests fly toward a neat tracker board: one lands
and unfolds into a work item with a blank customer field, the rest crash, overshoot or veer off to another tool.
On the drop the sky settles into the forest workspace and every plane lands in one Helpin inbox. The follow-up folds
into a mint plane and flies back to the customer. The tagline and end card return to the sky, and the last beat
dissolves into frame 0, so the hero loop is seamless.

**Music:** `music.json` bed 0 (composition plan, balearic disco, measured 120.2 BPM). It plays from its beat 12, so its
drop (beat 36) lands on video beat 24; a second copy of the same take picks up the groove from its beat 36 at video
beat 56 (the cut to the checklist). `timeline.js` names every beat; the page and `cues.mjs` use the same names.

## Changes from the storyboard doc

- Plane labels are "email", "chat", "feedback" and "a bug report" (the doc had "a call"): Helpin's inbox takes chat and
  email, so a call landing in it would imply a phone channel Helpin doesn't have.
- The open-source contrast is two cards (Plane Community Edition, Helpin Community) instead of two doors, which the
  Chatwoot video already uses.
- The follow-up station keeps a lede ("In the same conversation, once the fix is live. Your team approves it.") and
  shows the customer, Maya, waiting until the reply plane reaches her ("✓ Heard back").
- 38 s instead of about 35 s, following the track's grid.

## Claims check

Plane facts come from the `plane` entry in `helpin/website/src/app/(site)/compare/compare-data.ts` (official Plane
sources checked 2026-09-28):

- "Intake forms and email: Business plan": Plane pricing, Intake Forms and Intake Email on Business.
- "Help desk: listed as coming soon": plane.so home, "Desk — Coming soon".
- "Plane Community Edition · Open source · AGPL-3.0", "Projects ✓", "AI agents → Commercial Edition": Plane's
  LICENSE (AGPL-3.0); the Community Edition matches the Free plan; Plane AI and agents need the closed-source
  Commercial Edition (developers.plane.so self-hosting editions, Plane pricing).

Helpin facts:

- One inbox for chat and email; task with the customer conversation attached (Ask Agent links EXP-142); coding agents
  open a pull request for review (small print: needs a connected GitHub or GitLab repository); CRM with deals and
  meeting notes from Meet, Zoom, Teams and Webex: compare page, product pages and their live previews.
- Follow-up in the original conversation once the fix is live, approved by the team: committed roadmap.
- Helpin Community: every product feature under AGPL-3.0, support, projects, CRM, meetings, AI agents and coding
  agents included, free on your own servers with your own AI provider; "Helpin Community is a 0.2 beta" on screen.
- No Cloud price comparison: Plane costs less for small teams, and the page says so.
- Plane is named in text only with the compare page's monogram chip; the tracker board is our own neutral design.
