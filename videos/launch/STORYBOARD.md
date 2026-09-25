# Helpin — open-source launch reel (final)

42 s · 1920×1080 · 30 fps · 120 BPM grid. Output: `out/launch/helpin-launch-final.mp4`.

Picture = original reel (`reference/helpin-launch-friend.mp4`) frames 0–936, then the new
ending rendered from `videos/launch-ending` from frame 937 (31.233 s, the first clean frame
after the module montage). Sound = `videos/launch/audio.json` (ElevenLabs music beds + SFX).

| # | Time | Scene | On screen |
|---|------|-------|-----------|
| 1 | 0.0–5.0 | The handoff | "A customer asks a question." → … → **"Someone still has to tell the customer."** |
| 2 | 5.0–9.0 | Scattered tools | Tool tiles, "Every handoff loses the story.", links break, collapse |
| 3 | 9.0–14.0 | Logo reveal | Symbol + wordmark, "AI agents that do more than answer." |
| 4 | 14.0–19.0 | One record | "One customer. One record." inbox + three highlights |
| 5 | 19.0–26.0 | Ask Agent | EXP-142 created, coding agent prepares a fix, "Ready for review · Not merged" |
| 6 | 26.0–31.2 | One workspace | Module montage |
| 7 | 31.2–34.6 | **Close the loop** (new) | "And the customer hears back." Maya's thread: EXP-142 merged by Sam Rivera → support agent drafts the reply → Send → Resolved |
| 8 | 34.6–37.0 | **Open source** (new, tightened) | "Helpin is going open source." Badges + terminal: install.sh → `helpin install` → localhost:8085 |
| 9 | 37.0–42.0 | **End card** (new) | Symbol + Helpin, "Open source. Coming soon.", **helpin.ai** (GitHub link removed), fade to black |

Scene 7 pays off scene 1's "Someone still has to tell the customer." A human merges and
sends; the agent only drafts, consistent with "Ready for review · Not merged" in scene 5.

## Claims check
- Agents draft replies: website `/new` AI agents page ("a draft reply"), AgentControlArt ("Draft replies").
- Install commands and localhost:8085: helpin README "Install with the CLI".
- AGPL-3.0, self-host with Docker, bring your own models, SDKs + MCP: README / `/new` site (kept from the original cut).
- GitHub URL removed until the repo is public; eyebrow says "Open source · AGPL-3.0" rather than a Community version number.
