# Competitors and other companies' logos

Two kinds of video show other companies, and they follow different rules. Decide which one you're making before you
draw anything.

| | Comparison video (Helpin vs X) | Tool-sprawl moment |
|---|---|---|
| Examples | `videos/cmp-zendesk`, `cmp-intercom`, `cmp-help-scout`, `cmp-chatwoot`, `cmp-linear`, `cmp-jira`, `cmp-plane` | the `ph-story` ending, the problem half of `one-prompt`, the `ph-story-thumb` B option |
| The other company | one named competitor | many tools at once, as the landscape a team juggles |
| How it appears | its name in text, with the compare page's monogram chip | its real logo on a neutral tile |
| Logo, brand colours, UI | never | logo only; never its colours as a theme or its UI |
| Claims about it | yes, each from `compare-data.ts` with the checked date | none; the problem framing is about the split, not about any product |

## Comparison videos (Helpin vs X)

These play on the website's compare pages (`/compare/<slug>`) and on social, so they carry the same facts as the page.

- **Name it, don't show it.** The competitor appears as text with the compare page's monogram chip: its first letter
  in a small rounded square (`.cmp-monogram` in `website/src/app/(site)/compare/HeroMatchup.tsx` and `compare.css`).
  No logo, no brand colours (no Atlassian blue, no Linear purple), no lookalike UI, no product names on our mock-ups
  (a neutral chat says "AI agent", not Fin).
- **Their world is our own neutral design.** Draw the competitor's side as generic HTML in Helpin's style: a
  "Help desk" ticket card, a neutral backlog or tracker, a plain chat widget, our demo data (Maya Chen at Northstar,
  EXP-142, OrbitDesk). Helpin's side is the live helpin.ai previews.
- **Every competitor fact comes from `compare-data.ts`.** It lives in the website's compare work
  (`website/src/app/(site)/compare/compare-data.ts`, on the compare branches and worktrees). Each competitor has
  `sources` and a `checked` date. Helpin's prices come from `website/src/app/pricing/pricing-data.ts`, and any
  arithmetic uses the page calculator's defaults. Record every fact with its source and date in the video's
  `STORYBOARD.md` claims check.
- **Use their exact terms.** Intercom bills per Fin *outcome*, not per answer. Higher Intercom plans include Lite seats,
  so "Plus $85 for every seat", not "a seat for every teammate". "Per agent", "per creator": copy the unit the
  competitor uses.
- **Never put words in their mouth.** A line like "It's in the backlog." is our generic line, not a quote, and the
  claims check says so.
- **Prices carry their basis and date on screen.** For example: "List prices, billed annually, checked September 2026",
  plus what's left out ("Zendesk AI resolutions and Copilot not included"). Show the honest break-even ("From 5 agents,
  Helpin costs less"), and skip the price comparison entirely where the competitor is cheaper for small teams (Jira).
- **Time-bound facts get their date.** Examples: "Zendesk Sell retires August 31, 2027" and "Data Center: closed to new
  customers March 30, 2026 · read-only March 28, 2029", with the announcement named in the small print.
- **The Helpin side keeps its footnotes.** "Coding agents need a connected GitHub or GitLab repository" goes on screen,
  and the follow-up after release is flagged as a committed roadmap claim in the claims check.
- **Compare-page heroes loop.** The page autoplays the video on a loop, so frame 0 is the composed hook, and the last
  ~0.8 s dissolves back to it (`cmp-jira`).

## Tool-sprawl moments (real logos)

When the story is "your customer's story is split across your tools", the user wants the real logos: "we should use the
tools logos at the end… we can find and download and add those icons" (Sep 26, `ph-story`).

- **Show many tools together**, as the landscape a team juggles (support, projects, CRM, meetings, docs). Never single
  one out, never pair a logo with a claim about that product, and never show its UI or pricing. In a comparison video,
  the rules above win: no logos there.
- **Keep logos as they are:** the brand colour on a neutral tile, switched to white or ink only where the brand colour
  doesn't read on the background (the luminance rule below). No other recolouring, no distortion, no cropping into a
  mark.
- **Where they come from.** Use the `simple-icons` npm package (CC0 path data; the brands stay their owners'
  trademarks). Each video has a small `prep-logos.mjs` that writes `logos.json` (`slug, title, hex, fill, d`) and picks
  a fill that reads on its background:
  - on the dark stage: white when the brand colour's luminance is under 0.15 (`ph-story`);
  - on paper: ink when it's over 0.6 (`one-prompt`).
- **Not in simple-icons:** Salesforce, Pipedrive, OpenAI/ChatGPT and Microsoft products (VS Code). For AI clients, use
  `@lobehub/icons-static-svg` on jsDelivr (`codex-color`, `claude-color`, `cursor`) and devicon for VS Code
  (`vscode-original`). Save them in the video's `logos/` folder. If a tool has no clean logo, pick another tool in the
  same category (Zoho stood in for Pipedrive).
- **Optical sizes.** Wordmark-shaped logos (Zoom, Zoho) read small in a square tile; give them about 1.6× the size
  (`WIDE` in `one-prompt`).
- **AI clients** (Claude, Codex, Cursor, VS Code) are named because `helpin/docs/public-mcp-server.md` names them as
  MCP clients. Show only clients the docs name, and label MCP "(beta)" as the site does.

## Our own products

"Built by the team behind" ContentStudio, Usermaven, Replug and Contentpen: `assets/logos/products/`. On a dark
background, put them on light chips in their own colours. A white-silhouette filter (`brightness(0) invert(1)`) turns
the filled ContentStudio and Contentpen marks into blank shapes. Balance them optically (ContentStudio and Contentpen
larger, Usermaven smaller; `videos/linkedin-banner`).

## Brand marks in generated footage

Generated plates add real logos on their own (an Apple logo on a laptop lid, an HP badge). Check and remove them; see
"Check every plate for brand marks" in the skill.
