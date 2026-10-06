---
name: Irbing Moreno — Interactive CV
description: One resume, three live framework worlds — React, Lit, and Vue — proving range through working code, not a portfolio screenshot.
colors:
  electric-violet: "#6d5efc"
  hot-magenta: "#ff5fa2"
  candy-green: "#2ecc71"
  amber-pop: "#ffb020"
  alert-red: "#ff4d4d"
  candy-lime: "#d6fa3a"
  candy-ink: "#0a0a08"
  candy-bg-dark: "#0a0a08"
  candy-surface-dark: "#141411"
  candy-bg-light: "#f1efe0"
  candy-text-dark: "#f4f4ef"
  candy-text-light: "#15150f"
  neutral-0: "#ffffff"
  neutral-50: "#f7f7f8"
  neutral-100: "#ececef"
  neutral-200: "#d8d8de"
  neutral-300: "#bdbdc6"
  neutral-400: "#9a9aa5"
  neutral-600: "#5c5c66"
  neutral-800: "#27272e"
  neutral-900: "#16161a"
  neutral-950: "#0a0a0c"
typography:
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontWeight: 700
    lineHeight: 1.6
  display:
    fontFamily: "Poppins, Inter, system-ui, sans-serif"
    fontWeight: 700
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  pill: "999px"
spacing:
  tile-gap: "16px"
  card-gap: "20px"
  page-top: "92px"
components:
  nav-switcher-button:
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  nav-switcher-button-active:
    backgroundColor: "{colors.electric-violet}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  candy-pill:
    backgroundColor: "{colors.candy-surface-dark}"
    textColor: "{colors.candy-text-dark}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  candy-pill-solid:
    backgroundColor: "{colors.candy-lime}"
    textColor: "{colors.candy-ink}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  candy-chip:
    backgroundColor: "{colors.candy-lime}"
    textColor: "{colors.candy-ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  candy-card:
    backgroundColor: "{colors.candy-surface-dark}"
    textColor: "{colors.candy-text-dark}"
    rounded: "{rounded.lg}"
    padding: "20px 22px"
  bento-tile:
    backgroundColor: "{colors.neutral-50}"
    rounded: "{rounded.lg}"
    padding: "22px 24px"
  terminal-window:
    backgroundColor: "{colors.neutral-950}"
    textColor: "#d4f8d4"
    rounded: "{rounded.md}"
    padding: "20px 22px 40px"
---

# Design System: Irbing Moreno — Interactive CV

## Overview

**Creative North Star: "The Same Resume, Three Live Proofs"**

This is not one visual system with variants; it is one shared primitive layer (`src/styles/tokens.css`) feeding deliberately distinct, simultaneously-shipped visual worlds, each rendered by the framework it claims to prove: **Candy Brand** (React, neubrutalist "dev-tool landing page" — black canvas, one lime signal color, hard-offset card chrome), **Terminal Dev** (Lit/Web Components, dark CLI/cyberpunk), and two further worlds rendered under the names **Neon** and **Dotfiles** in the shipped nav-switcher (`src/components/custom-cursor.ts`'s `DESIGN_SLUGS` lists `candy-brand`, `terminal-dev`, `neon`, `dotfiles`). A hiring manager switches between them via the nav-switcher without losing theme or language state. The multiplicity is the product claim (see PRODUCT.md Positioning) — do not collapse it into a single invented house style, and do not promote any one world's devices onto the others.

What is genuinely shared and durable: the token layer (color roles, neutral ramp, radius scale, the two soft shadow tokens, light/dark semantic swap via `[data-theme]`), the `<nav-switcher>` Web Component (same button shapes, same active-state treatment regardless of which world's page it sits on top of), and the per-world convention — now followed by Candy Brand, Neon, and Dotfiles alike — of setting `--color-accent` / `--color-accent-contrast` on `<html>` on mount so the shared nav-switcher active-button fill and the site-wide scrollbar pick up that world's accent while its page is showing.

What is deliberately not shared: display typography, elevation language (soft vs. hard-offset), and card geometry. Each world's Components entry below is normative only within that world.

**Key Characteristics:**
- One token source of truth; three-plus independent expressions on top of it.
- Soft, layered elevation is the shared default (`--shadow-sm` / `--shadow-md`); Candy Brand's hard-offset shadows are a world-local override, not a system default.
- Light/dark is a single `[data-theme]` attribute swap on `:root`, consistent across all worlds.
- Declared webfont families: Baloo 2, Nunito, and (as of this build) JetBrains Mono are actually fetched by Candy Brand (`candy-brand.astro`'s `fontHref` link); Inter and Poppins remain named-but-unloaded tokens, rendering via system fallback everywhere in the shipped build.

## Colors

The palette is one small shared brand set (violet primary, magenta secondary, three status colors) plus a 10-step neutral ramp, defined once in `tokens.css`. Candy Brand no longer draws its CTA/tag colors from that shared set — it now runs its own single-accent world-local palette (lime-on-near-black / lime-on-cream), documented under its own Components entry below, the same way Terminal Dev's CRT palette already was. Electric Violet and Hot Magenta remain live for the other worlds and for the shared nav-switcher default.

### Primary
- **Electric Violet** (`#6d5efc`): `--brand-primary` / `--color-accent` default. Nav-switcher's active-button fill and site-wide scrollbar accent when no world has overridden `--color-accent` on `<html>`; still the hero gradient start / link color elsewhere in the build.

### Secondary
- **Hot Magenta** (`#ff5fa2`): `--brand-secondary` / `--color-accent-2`. No longer used by Candy Brand (it previously filled Candy's tags and headline); retained for other worlds' use.

### Neutral
- **Paper White** (`#ffffff`) / **Near-Black** (`#16161a`–`#0a0a0c`): `--neutral-0`…`--neutral-950`. Backbone of `--color-bg`, `--color-surface`, `--color-text`, `--color-border` in both themes; `[data-theme="dark"]` remaps these to the darker end of the same ramp rather than introducing a second palette.

### Named Rules
**The One Ramp Rule.** Light and dark mode are the same neutral ramp read from opposite ends, swapped by a single `[data-theme]` attribute on `:root`. No world defines a second, independent dark palette.

## Typography

**Body Font:** Inter, with system-ui/-apple-system/Segoe UI fallback (`--font-sans`)
**Label/Mono Font:** JetBrains Mono, with Fira Code/ui-monospace fallback (`--font-mono`)
**Display Font:** Poppins, falling back to `--font-sans` (`--font-display`)

**Character:** The token layer names a standard geometric-sans/mono/display trio. Candy Brand's own faces (Baloo 2 + Nunito) are loaded via a Google Fonts `<link>`, and as of this build Candy Brand also actually loads JetBrains Mono (500/700) for the first time in the project — previously a declared-but-unfetched token. Terminal Dev's "monospace" and the rest of the build's "sans" remain system font-stack fallbacks, not the named webfonts Inter or Poppins. Treat `--font-sans`/`--font-mono`/`--font-display` as the intended identifiers, but verify a webfont link exists before relying on one rendering outside Candy Brand.

### Hierarchy
- **Display** (800 weight, `clamp(1.8rem, 5vw, 3.2rem)`): Candy Brand's `h1` only — Baloo 2, uppercase, boxed in the same device as `.candy-card`/`.candy-hero` (surface fill + theme-flipped border + hard-offset shadow), text in `var(--candy-headline)` (off-white on the dark surface, near-ink on the light surface). Matches the reference's "COMPATIBLE CON OPENAI" badge — a bordered box with bright text on a dark fill — not a solid-lime chip with ink text, and not flat unboxed text either (both tried and reverted during this build).
- **Headline** (700–800, 1.5rem): per-world page heading — Candy's `.candy-heading`, the same boxed device as h1 (smaller), keeping the confirmed `rotate(-1deg)` sticker tilt.
- **Title** (600–700, 1–1.3rem): card/tile titles across worlds (`.candy-card h3`, `.bento-tile h3`, `.t-name`).
- **Body** (400, 0.88–1rem, line-height 1.5–1.6): summaries and descriptions (`.candy-summary`, `.bento-summary`, `.terminal-body`).
- **Label** (700–800, 0.72–0.85rem, uppercase + letter-spacing on badge/tags): tags, dates, status lines. In Candy Brand specifically, dates/status/stack-tags (`.candy-dates`, `.candy-status`, `.candy-tag`) render in JetBrains Mono as a "code chip" register — a world-local typographic choice pulled from this build's reference image, not a system-wide label rule.

## Layout

A single fixed `<nav-switcher>` bar (full-width, `position: fixed`, `z-index: 9999`, blurred translucent surface) sits identically above all worlds; every page compensates with ~92–96px of top padding. Below that, each world runs its own spatial model:
- **Candy Brand:** single centered column, `max-width: 960px` content column (the page shell itself is full-width to carry the edge-to-edge dot-grid background), generous vertical rhythm (56px between sections), a dense asymmetric 3-column grid for experience cards (featured/tall/combo spans) collapsing to one column under 760px.
- **Terminal Dev:** single centered "window" column, `max-width: 880px`, no grid — content reads top-to-bottom as a scrollback log.

## Elevation & Depth

Hybrid by design, split along world boundaries. The shared token layer defines two soft, blurred shadows (`--shadow-sm`, `--shadow-md`) used as the system default elsewhere in the build. Candy Brand overrides this locally with hard, un-blurred offset shadows paired with a 3–4px solid outline border on every card, pill, badge, and headline (h1, `.candy-heading` now share the card device — see Shapes/Components) — a neubrutalist device native to that world's own reference, now a GitHub-repo "Top 5" social card graphic rather than the earlier feastables.com reference. Border and shadow color are theme-paired, not fixed: in **dark mode**, outline-bordered panels (hero, cards, h1/heading, ghost pills) get a lime border and a lime hard-offset shadow (`var(--candy-shadow)` resolves to `var(--candy-lime)`) — black would vanish against the near-black canvas. In **light mode**, the same panels get a pure-black border (`#000000`, wider at `--candy-border-w: 4px` instead of `3px`, "more marked" per explicit user direction) and a matching **black** hard-offset shadow (`var(--candy-shadow)` resolves to `var(--candy-outline)`) — a classic solid-black sticker shadow next to a solid-black border, not a two-tone lime/black split. This was an explicit correction mid-build: an earlier version kept the shadow lime in both themes, which the user asked to change for light mode specifically. Lime-filled chips (badge, solid CTA pill, tags) are a separate device: always a near-black ink outline + ink shadow, regardless of theme, since a bright lime fill reads against either canvas on its own and was never part of this light/dark pairing.

### Shadow Vocabulary
- **Ambient** (`var(--shadow-sm)`: `0 1px 2px rgba(0,0,0,0.08)`): shared resting elevation used elsewhere in the build.
- **Raised** (`var(--shadow-md)`: `0 8px 24px rgba(0,0,0,0.12)`): shared hover/raised elevation used elsewhere in the build.
- **Candy hard-offset, theme-paired** (`3px 3px 0`–`9px 9px 0 var(--candy-shadow)`): Candy Brand's outline-bordered surfaces (hero, photo, cards, h1, heading, ghost pills, edu items) — resting pills/edu at 3–5px, cards at 6px growing to 9px on hover alongside a `translate(-3px,-3px)` shift. Lime in dark mode, black in light mode — see Elevation & Depth intro.
- **Candy hard-offset, ink** (`3px 3px 0`–`6px 6px 0 var(--candy-chip-outline)`): the lime-filled chips themselves (badge, solid pill, tags) — shadow and outline both render in near-black ink so the chip doesn't visually merge into the dark canvas, in both themes.

### Named Rules
**The World-Scoped Shadow Rule.** Hard-offset, zero-blur shadows are Candy Brand's device, confirmed by its own neubrutalist reference material. Do not apply them to other worlds, and do not fold them into the shared `--shadow-sm`/`--shadow-md` tokens as a system-wide default.
**The Theme-Paired Border Rule.** In Candy Brand, outline-bordered panels' border and shadow move together as a pair per theme — both lime in dark mode, both black in light mode — rather than each being independently theme-locked. This superseded an earlier "shadow always lime, border flips" rule mid-build; don't revert to that split without a fresh user direction. Lime-filled chips (badge/pill/tag) are unaffected — they stay ink-outlined in both themes, a separate device.

## Shapes

Corner radius is a shared three-step scale (`--radius-sm: 6px`, `--radius-md: 12px`, `--radius-lg: 20px`), plus an unscaled `999px` pill used for tags and buttons in every world. Candy Brand adds a solid outline border (`--candy-border-w`: 3px dark mode / 4px light mode) to nearly every surface — cards, pills, badges, and now h1/`.candy-heading` too — as its core silhouette device; other worlds use thinner 1px neutral borders instead, consistent with their flatter, quieter elevation model. H1 and `.candy-heading` share the card device rather than being exempt from it (an earlier un-boxed, flat-text version of both was tried and reverted mid-build — see Elevation & Depth); `.candy-heading` keeps the confirmed `rotate(-1deg)` sticker tilt. The `.candy-highlight` inline mark (solid lime block behind text, `box-decoration-break: clone`) is a separate, third device — reserved for emphasizing one word or phrase inline, not for headlines or tags.

## Components

### Navigation (shared across worlds)
- **Style:** fixed top bar, translucent blurred surface (`color-mix` over `--color-surface` at 85%), 1px bottom border in `--color-border`.
- **Buttons:** pill-free rectangular buttons, `--radius-sm` (6px), 1px border, `--color-surface-raised` background.
- **Active state:** filled `--color-accent` background, white or ink text depending on which world has set `--color-accent` on `<html>` — the one visual language every world agrees to inherit unmodified; only the color value, not the pattern, varies per world.
- **Theme toggle:** uses raw emoji glyphs (☀️/🌙) with no text label or `aria-label` confirmed in the source — carried as-is; see Do's and Don'ts.

### Candy Brand world (React)
- **Palette:** world-local, not token-driven — a single lime accent (`#d6fa3a`) against a near-black canvas (`#0a0a08` bg / `#141411` card surface) by default, swapping to a cream canvas (`#f1efe0` bg / `#ffffff` card surface) in light mode; same accent, same shapes, only canvas/surface invert, following the light/dark pairing convention the other worlds already use via `[data-theme]`.
- **Background texture:** a repeating lime half-tone dot tile (22px grid, radial-gradient, low opacity) with a left/right linear fade in the page's own ground color layered on top, keyed to the ~960px content column's own width — dots read fully only in the side margins outside the column and fade out behind it, rather than a viewport-relative radial vignette (an earlier version using unsized `ellipse at center` defaulted to farthest-corner sizing and was never actually visible).
- **Buttons/Pills:** fully rounded (999px), theme-paired outline + hard-offset shadow (both lime in dark mode, both black in light mode), lifts on hover (`translate(-2px,-2px)`); solid "mailto" variant fills lime with ink text and an ink outline/shadow instead (unaffected by theme).
- **Cards:** `--radius-lg`, theme-paired outline + hard-offset shadow, 6px resting growing to 9px + lift on hover; laid out in an asymmetric dense grid (one 2×2 featured card, one tall card, one full-width two-column combo card) rather than a uniform auto-fit grid.
- **Badges/chips:** solid-lime pill chips (name badge, stack-tags) always ink-outlined with an ink hard-offset shadow, regardless of theme — headlines are a different device (see below).
- **Headline:** Baloo 2, 800 weight, uppercase, boxed in the same device as cards — surface fill, theme-paired outline + hard-offset shadow, `var(--candy-headline)` text color (off-white dark / near-ink light). H1 at `clamp(1.8rem, 5vw, 3.2rem)`; `.candy-heading` (section titles) at 1.5rem, keeping the `rotate(-1deg)` sticker tilt. This replaced two earlier treatments tried during this build — a solid-lime chip with ink text, then flat un-boxed text — before landing here at explicit user direction, matching the reference's "COMPATIBLE CON OPENAI" badge.
- **Highlighter mark:** `.candy-highlight` — solid lime block behind inline text (ink text, `box-decoration-break: clone`), used on the hero job-title line; a world-local device, distinct from both the headline box and the bordered chips.
- **Monospace labels:** JetBrains Mono (newly loaded by this world) sets dates, status lines, and stack-tags — a "code chip" register borrowed from this build's reference graphic.

### Terminal Dev world (Lit)
- **Window chrome:** macOS-style traffic-light dots (`#ff5f56`/`#ffbd2e`/`#27c93f`), 1px border, soft shadow, `--radius-md`.
- **Palette:** world-local, not token-driven — mint-green body text (`#d4f8d4`), cyan for roles/links (`#9fe6ff`), amber for keys (`#ffd866`), magenta for tags (`#ff6ac1`), all against near-black.
- **Signature behavior:** typed-command reveal metaphor (`.t-prompt`, `.t-cmd`, `.t-cursor` with a blinking caret) — content reads as CLI output, not prose blocks.

## Do's and Don'ts

### Do:
- **Do** read all color, radius, and soft-shadow values from `tokens.css` custom properties in any new surface — never hardcode a hex that already has a token.
- **Do** keep `<nav-switcher>` visually identical across every world; it is the one cross-world constant.
- **Do** scope a world's signature device (Candy's lime-on-black hard-offset chrome, highlighter mark, and mono code-chip labels; Terminal's CLI-reveal and local CRT palette) to that world only.
- **Do**, in Candy Brand specifically, keep outline-bordered panels' border and shadow paired per theme — both lime in dark mode, both pure black in light mode (`--candy-border-w: 4px` in light mode too, wider than dark mode's 3px) — this is the confirmed, shipped pairing after an explicit user correction mid-build, not an arbitrary choice to re-derive. Lime-filled chips (badge/pill/tag) stay ink-outlined in both themes regardless — a separate, unaffected device.

### Don't:
- **Don't** apply Candy Brand's hard-offset, zero-blur shadows or 3px outline borders to other worlds; they read as a different, un-reconciled material system there.
- **Don't** treat Inter/Poppins as confirmed rendered faces when adding new UI — only Baloo 2, Nunito, and (in Candy Brand only) JetBrains Mono are actually loaded; verify a webfont link exists before relying on it.
- **Don't** introduce new icon-only controls using raw emoji glyphs without a text label or `aria-label`; the nav-switcher's sun/moon toggle is a carried defect, not a pattern to repeat (see summary).
- **Don't** reuse Candy Brand's old violet/magenta accent assignment when extending this world; the shared Electric Violet/Hot Magenta tokens are no longer part of its palette, even though they remain valid for other worlds.
