# Product Hunt launch

35.5 s · 1920×1080 (4K master) · no voice, the music leads · output `out/ph-launch/helpin-ph-launch.mp4`,
delivery set in `out/ph-launch/deliver/`.

Benchmark: a 30 s motion showreel (Sep 25, `reference/showreel`): one hero object whose every landing is a drum hit,
single words on full-colour cards cut on downbeats, hand-drawn notes, a dot grid that ripples, a 2D → 3D lift.
Our hero is the emerald dot from "Everywhere" (the story): it lands each word as its full stop, carries the story
through every handoff, and ends as the dot on the i.

**Music-first.** Three candidate tracks were generated with the same arc; `bin/beats.mjs --json` measured each, and
the one with the most usable shape was kept: 120.2 BPM, bars 1–4 hit / rest / hit / hit, the drop on beat 16
(8.05 s), a two-beat gap in bar 8, the fullest part in bars 9–16, the last hit on beat 64 (32.01 s). `timeline.js`
names the beats; the page animates on them and `cues.mjs` puts every effect on them.

```sh
node videos/ph-launch/cues.mjs
npm run render -- ph-launch
npm run audio -- videos/ph-launch/audio.json --out out/ph-launch/helpin-ph-launch.mp4
```

| Beats | Picture |
|---|---|
| 0–15 | The dot bounces along a line; each word lands on a hit with the dot as its full stop: Support. Projects. CRM. Meetings. Docs. Pull back: five separate tools, the links snap ("5 tools…", "the story gets lost"); the dot winds up |
| 16 (drop) | The dot slams down, the dot grid ripples, the Helpin mark assembles; "One workspace. One history."; the five modules pop |
| 20–31 | The relay: the dot hops card to card on each beat (Maya → Echo → EXP-142 → Forge → Lens → Quill → "That was fast. Thank you!"), its arcs drawn as the thread; "nothing lost ✓"; it launches and hangs over the music's gap: "Meet the agents" |
| 32–47 | Eight agents, two beats each, hard cuts on their colours: Echo, Forge, Lens, Quill, Beacon, Scribe, Atlas, Mira, with their roles |
| 48–51 | "You choose when they ask first.": the refund tool switches to Ask first; the dot is the click on Approve |
| 52–55 | "Open source" in extruded 3D on a grid floor; the real install command types out; "self-host free" |
| 56–59 | "Built by the team behind": ContentStudio, Usermaven, Replug and Contentpen land on beats 1–4, the dot bouncing across them |
| 60–63 | "Every handoff keeps the story." word by word; the thread draws under it |
| 64 (last hit) | "Helpin": the dot falls and lands as the dot on the i; the mark, "free & open source", helpin.ai · Self-host free · Helpin Cloud |

## Claims check

- Support, projects, CRM, meetings and docs; one customer history: helpin.ai.
- Agents and roles: the workspace's system agents (Helpin MCP `list_agents`): Echo (support), Forge (code builder),
  Lens (QA & code reviewer), Quill (documentation), Beacon (CRM operator), Scribe (task planner), Atlas (epic planner),
  Mira (marketer). Echo/Forge/Lens/Quill actions as in the launch film's claims check.
- "Choose when it asks first": helpin.ai. Open source, self-host free, Helpin Cloud: README, helpin.ai.
- `curl -fsSL https://helpin.ai/install.sh | bash`: README.
- Built by the team behind ContentStudio, Usermaven, Replug and Contentpen: the founder. Logos: `assets/logos/products`.
