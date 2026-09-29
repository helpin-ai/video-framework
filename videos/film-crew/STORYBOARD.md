# The crew: meet Helpin's agents

~51 s · 1920×1080 · narrated (ElevenLabs "Chris – Charming, Down-to-Earth") · heist-jazz score · output `out/film-crew/helpin-film-crew.mp4`

A team-introduction film. Each agent owns the screen in its own colour: a circle of colour bursts out of its avatar,
its name lands big, the site's outcome line sits under it, and a small animation shows its job. Then the crew lines up
on one history with your team, asks before it acts, and there's an empty slot for the agent you build.
Voice-timed: `script.json` → `bin/vo.mjs` → `vo.json`; `cues.mjs` writes the SFX cues.

| Voice | Picture |
|---|---|
| "Every great team has specialists. Meet yours." | Coloured dots drift, gather into the line-up of eight agents |
| Echo · Atlas · Scribe · Forge · Lens · Quill · Beacon · Mira | Colour burst per agent (pink, orange, green, indigo, amber, blue, teal, orange); a vignette each: chat + sources + handoff to Sam; customer-need notes wired into a plan; implementation notes ticking; diff + tests + PR; magnifier + findings; article edit; account + follow-up draft; signals into launch messaging |
| "They share one history with your team, and they ask before they act." | The crew above one history line, your team below it; Forge asks to open a PR, you approve |
| "Need a different job done? Build your own." | A dashed slot at the end of the line fills in: "Your agent" |
| "Helpin. Meet your crew." | Lockup with the crew's colours orbiting; helpin.ai · Open source |

## Claims check (helpin.ai/products/ai-agents)
Each line paraphrases the agent's site description; the outcome subtitles are the site's outcome lines verbatim.
- Echo: "Answer customers in live chat from your help center and earlier conversations. Hand the conversation to a teammate when it needs a person."
- Atlas: "…a scope and task plan your team can review." · Scribe: "…before coding begins." · Forge: "…run the tests, and open a pull request for review."
- Lens: "Examine the changes for risks, missing tests…" · Quill: "Prepare help articles and document updates…" · Beacon: "…prepare the next follow-up." · Mira: "…positioning, campaign plans, and launch messaging."
- Shared history, approvals, "A different job? Build an agent for it." are on the same page.
