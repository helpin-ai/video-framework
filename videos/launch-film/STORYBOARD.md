# The story: Helpin launch film

66 s · 1920×1080 · 30 fps · narrated (ElevenLabs "Eric – Smooth, Trustworthy") · output `out/launch-film/helpin-launch-film.mp4`

The picture follows the voice: `script.json` → `bin/vo.mjs` → `vo.json` (every word's time). The scene reads `vo.json`,
and `cues.mjs` writes the sound-effect cues from the same anchors, so re-voicing a line re-times the film.

```sh
node --env-file=.env bin/vo.mjs videos/launch-film/script.json   # voice + word timings
node videos/launch-film/cues.mjs                                  # SFX cues from the voice
node --env-file=.env bin/genvideo.mjs videos/launch-film/plates.json   # footage (cached; --dry for the cost)
npm run render -- launch-film
npm run audio -- videos/launch-film/audio.json --out out/launch-film/helpin-launch-film.mp4
```

| Act | Voice | Picture |
|---|---|---|
| The relay | "A customer asks… Engineering ships." | Footage of Maya at her desk at night; her message rises beside her. Cut on each word to the support specialist, the PM, then Sam, full frame under the tool windows (Intercom, Linear, GitHub) as they draw in; the card flies between them and words fall off it until it's "fix: export limit" · Merged |
| Lost | "…between five tools, the story gets lost." | The footage recedes as the camera pulls back to five tools (+ HubSpot, Notion); the handoff lines snap; "Any update on the export?" |
| Reveal | "Helpin keeps the whole story in one place." | The fragments spiral into the Helpin mark as it assembles; a line draws out |
| One history | "Support, projects, CRM, meetings and docs. One history, shared with your AI agents." | Module tiles pop onto the line on their word; a comet lights it; Echo, Atlas, Forge, Lens, Quill and Beacon plug in with data flowing |
| The flow | "A customer writes in… Echo tells the customer, in the same conversation." | Maya, live beside her conversation, reads Echo's answer. One camera move through one world: chat → sources → reply → Bug → findings fly to Sam (a live card of him at his desk) → task on the board, linked back → Forge's diff → Lens's scan → you approve → released → Quill's doc edit → pull back to one unbroken thread → back in the same conversation: "The fix is live" / "That was fast. Thank you!" while Maya smiles The story strip collects every beat. |
| CRM | "Before a call, Ask Agent catches you up, with sources." | The strip becomes the account's timeline; Ask Agent's briefing with source chips |
| Approvals | "You decide what each agent can do, and what needs your approval." | Echo's tools: Auto / Ask first / Off switches glide into place; a shield draws |
| Open source | "Helpin is open source. Self-host it for free, or run it on Helpin Cloud." | `< >` draw around the mark, AGPL-3.0; your server or Helpin Cloud |
| End | "Every handoff keeps the story. Helpin." | The team (support, PM, Sam) together at a table, dimmed into the forest green under the tagline and the story line; the lockup, helpin.ai, Open source |

Music: piano-led electronic at 100 BPM (its own): a sparse, tense intro to the reveal, then a building bed that reaches full
energy as the flow starts and rides out gently under the logo (no end hit). Ducked under the voice with a sidechain.

## Claims check

- One workspace, one history for support, projects, CRM, meetings and docs; agents work from it: README "What you can do".
- Echo answers from the help center and earlier conversations; hands off with what it found: /products/ai-agents, support hero.
- Task linked to the conversation: support page "Create or link a task with the customer's request attached".
- Forge prepares the fix as a PR; Lens reviews it: /products/ai-agents (Forge = coding agent, Lens = code reviewer), support page.
- Quill drafts the docs update: /products/knowledge.
- Echo tells the customer in the same conversation after release: committed claim ("customer follow-up after release, with approvals").
- Ask Agent catches you up with sources: /products/crm.
- Per-action approvals: /products/ai-agents + committed claim.
- Open source (AGPL-3.0), self-host free, Helpin Cloud: README, /self-hosting.
- Tool logos (Intercom, Linear, GitHub, HubSpot, Notion) are from simple-icons, used only to name the tools. No GitHub URL shown.
- Checked: the final mix transcribed with ElevenLabs speech-to-text matches the script (the voice is intelligible over the music).

## Generated footage

Six Seedance 2.0 plates via Higgsfield (`plates.json`), 720p upscaled to 1080p with light grain, played frame-exact:
`maya-night` (8 s) and `maya-smile` (4 s) use `assets/helpin/avatars/maya.webp` as the reference and `sam` (8 s) uses
`sam.webp`, so the footage matches the avatars in the UI. `support` (4 s), `product` (4 s) and `team` (5 s) are text-only,
cast to match each other. Framing per shot (zoom/offset) keeps faces clear of the tool windows.

Brand-mark check (device areas cropped at full size): `maya-smile` shows an Apple logo on the laptop lid, outside the
portrait crop (30% object-position), so it never appears. `sam` shows an ASUS badge at the left edge until frame ~85:
Act 1 zooms 1.2× (crops 190 px per side) and the flow card starts at frame 108. The support monitor shows blurred chat
bubbles with no readable text. The product sticky notes are blank. The team laptop lid is plain.

