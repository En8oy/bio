---
name: Irbing Moreno — Interactive CV
description: One resume, three live framework worlds — React, Lit, and Vue — proving range through working code, not a portfolio screenshot.
colors:
  electric-violet: "#6d5efc"
  hot-magenta: "#ff5fa2"
  candy-green: "#2ecc71"
  amber-pop: "#ffb020"
  alert-red: "#ff4d4d"
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
    fontWeight: 400
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
    backgroundColor: "{colors.neutral-0}"
    textColor: "{colors.neutral-900}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  candy-card:
    backgroundColor: "{colors.neutral-0}"
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

This is not one visual system with variants; it is one shared primitive layer (`src/styles/tokens.css`) feeding three deliberately distinct, simultaneously-shipped visual worlds, each rendered by the framework it claims to prove: **Candy Brand** (React, neubrutalist sticker-and-outline aesthetic), **Terminal Dev** (Lit/Web Components, dark CLI/cyberpunk), and **Bento Grid** (Vue, neutral Apple-keynote modular grid). A hiring manager switches between them via an iframe on the index page without losing theme or language state. The multiplicity is the product claim (see PRODUCT.md Positioning) — do not collapse it into a single invented house style, and do not promote any one world's devices onto the others.

What is genuinely shared and durable: the token layer (color roles, neutral ramp, radius scale, the two soft shadow tokens, light/dark semantic swap via `[data-theme]`), and the `<nav-switcher>` Web Component, which renders identically — same button shapes, same active-state treatment — regardless of which world's page it sits on top of.

What is deliberately not shared: display typography, elevation language (soft vs. hard-offset), and card geometry. Each world's Components entry below is normative only within that world.

**Key Characteristics:**
- One token source of truth; three independent expressions on top of it.
- Soft, layered elevation is the shared default (`--shadow-sm` / `--shadow-md`); Candy Brand's hard-offset shadows are a world-local override, not a system default.
- Light/dark is a single `[data-theme]` attribute swap on `:root`, consistent across all three worlds.
- Declared webfont families (Inter, JetBrains Mono, Poppins) are tokens, but only Baloo 2 + Nunito are actually fetched (`@import` in `candy-brand.css`) — the others render via system fallback in the shipped build; see Typography.

## Colors

The palette is one small brand set (violet primary, magenta secondary, three status colors) plus a 10-step neutral ramp, defined once in `tokens.css` and consumed via CSS custom properties by all three worlds. Candy Brand and Terminal Dev each also use a handful of hardcoded, world-local colors not in the shared token set (documented under their own Components entries); those are not part of the portable primitive layer and should not be promoted to it without a product decision.

### Primary
- **Electric Violet** (`#6d5efc`): `--brand-primary` / `--color-accent`. Primary action color system-wide — Candy Brand's solid pill CTA, Bento's hero gradient start and link color, nav-switcher's active-button fill.

### Secondary
- **Hot Magenta** (`#ff5fa2`): `--brand-secondary` / `--color-accent-2`. Candy Brand's tag fill and headline color; Bento's hero gradient end.

### Neutral
- **Paper White** (`#ffffff`) / **Near-Black** (`#16161a`–`#0a0a0c`): `--neutral-0`…`--neutral-950`. Backbone of `--color-bg`, `--color-surface`, `--color-text`, `--color-border` in both themes; `[data-theme="dark"]` remaps these to the darker end of the same ramp rather than introducing a second palette.

### Named Rules
**The One Ramp Rule.** Light and dark mode are the same neutral ramp read from opposite ends, swapped by a single `[data-theme]` attribute on `:root`. No world defines a second, independent dark palette.

## Typography

**Body Font:** Inter, with system-ui/-apple-system/Segoe UI fallback (`--font-sans`)
**Label/Mono Font:** JetBrains Mono, with Fira Code/ui-monospace fallback (`--font-mono`)
**Display Font:** Poppins, falling back to `--font-sans` (`--font-display`)

**Character:** The token layer names a standard geometric-sans/mono/display trio, but only Candy Brand's own faces (Baloo 2 + Nunito) are actually loaded via webfont `@import`; nothing else in the project links Inter, JetBrains Mono, or Poppins. In the shipped build, Terminal Dev's "monospace" and Bento's "sans" are system font-stack fallbacks, not the named webfonts. Treat `--font-sans`/`--font-mono`/`--font-display` as the intended identifiers, but know the rendered glyphs are system defaults outside Candy Brand.

### Hierarchy
- **Display** (800 weight, `clamp(2.2rem, 6vw, 4rem)`): Candy Brand's `h1` only — Baloo 2, with a 2px outline stroke and hard offset text-shadow.
- **Headline** (700–800, 1.8–2.6rem): per-world page heading — Bento's hero `h1` (gradient hero tile), Candy's pill-shaped `.candy-heading`.
- **Title** (600–700, 1–1.3rem): card/tile titles across all three worlds (`.candy-card h3`, `.bento-tile h3`, `.t-name`).
- **Body** (400, 0.88–1rem, line-height 1.5–1.6): summaries and descriptions (`.candy-summary`, `.bento-summary`, `.terminal-body`).
- **Label** (600–800, 0.72–0.8rem, uppercase + letter-spacing on Bento only): tags, dates, status lines.

## Layout

A single fixed `<nav-switcher>` bar (full-width, `position: fixed`, `z-index: 9999`, blurred translucent surface) sits identically above all three worlds; every page compensates with ~92–96px of top padding. Below that, each world runs its own spatial model:
- **Candy Brand:** single centered column, `max-width: 960px`, generous vertical rhythm (56px between sections), auto-fit card grid at `minmax(260px, 1fr)`.
- **Terminal Dev:** single centered "window" column, `max-width: 880px`, no grid — content reads top-to-bottom as a scrollback log.
- **Bento Grid:** 4-column CSS grid, `max-width: 1100px`, tiles span 2/4 columns and 1–2 rows (`--wide`, `--tall`, `--hero` modifiers); collapses to a 2-column grid under 720px.

## Elevation & Depth

Hybrid by design, split along world boundaries. The shared token layer defines two soft, blurred shadows (`--shadow-sm`, `--shadow-md`) used as the system default — Bento Grid and Terminal Dev's window chrome both use these untouched. Candy Brand overrides this locally with hard, un-blurred offset shadows (`Npx Npx 0 <outline-color>`, no blur radius) paired with a 2–3px solid outline border on every card, pill, and heading chip — a neubrutalist device native to that world's own reference (feastables.com) and not present anywhere else in the build.

### Shadow Vocabulary
- **Ambient** (`var(--shadow-sm)`: `0 1px 2px rgba(0,0,0,0.08)`): resting elevation for Bento tiles and the terminal window border context.
- **Raised** (`var(--shadow-md)`: `0 8px 24px rgba(0,0,0,0.12)`): hover state on Bento tiles; resting shadow on the terminal window.
- **Candy hard-offset** (`3px 3px 0`–`9px 9px 0 var(--candy-outline)`, no blur): Candy Brand only — resting pills/headings at 3–4px, cards at 6px, growing to 9px on card hover alongside a `translate(-3px,-3px)` shift.

### Named Rules
**The World-Scoped Shadow Rule.** Hard-offset, zero-blur shadows are Candy Brand's device, confirmed by its own neubrutalist reference material. Do not apply them to Terminal Dev or Bento Grid, and do not fold them into the shared `--shadow-sm`/`--shadow-md` tokens as a system-wide default.

## Shapes

Corner radius is a shared three-step scale (`--radius-sm: 6px`, `--radius-md: 12px`, `--radius-lg: 20px`), plus an unscaled `999px` pill used for tags and buttons in every world. Candy Brand adds a 2–3px solid outline border to nearly every surface (cards, pills, heading chips) as its core silhouette device; Bento and Terminal use thin 1px neutral borders instead, consistent with their flatter, quieter elevation model. Candy Brand's section headings also carry a confirmed `rotate(-1deg)` tilt — a one-off sticker gesture local to that world, not a repeatable system rule.

## Components

### Navigation (shared across all three worlds)
- **Style:** fixed top bar, translucent blurred surface (`color-mix` over `--color-surface` at 85%), 1px bottom border in `--color-border`.
- **Buttons:** pill-free rectangular buttons, `--radius-sm` (6px), 1px border, `--color-surface-raised` background.
- **Active state:** filled `--color-accent` background, white text, `font-weight: 600` — the one visual language every world agrees to inherit unmodified.
- **Theme toggle:** uses raw emoji glyphs (☀️/🌙) with no text label or `aria-label` confirmed in the source — carried as-is; see Do's and Don'ts.

### Candy Brand world (React)
- **Buttons/Pills:** fully rounded (999px), 3px solid outline, hard 3px offset shadow, lifts on hover (`translate(-2px,-2px)`); solid variant fills with `--brand-primary`.
- **Cards:** `--radius-lg`, 3px outline, 6px hard offset shadow growing to 9px + lift on hover.
- **Badges/tags:** solid-fill pill chips (success-green status badge, magenta skill tags), always outlined.
- **Headline:** Baloo 2, 800 weight, `-webkit-text-stroke` outline plus hard offset text-shadow — the world's signature move.

### Terminal Dev world (Lit)
- **Window chrome:** macOS-style traffic-light dots (`#ff5f56`/`#ffbd2e`/`#27c93f`), 1px border, soft shadow, `--radius-md`.
- **Palette:** world-local, not token-driven — mint-green body text (`#d4f8d4`), cyan for roles/links (`#9fe6ff`), amber for keys (`#ffd866`), magenta for tags (`#ff6ac1`), all against near-black.
- **Signature behavior:** typed-command reveal metaphor (`.t-prompt`, `.t-cmd`, `.t-cursor` with a blinking caret) — content reads as CLI output, not prose blocks.

### Bento Grid world (Vue)
- **Tiles:** `--radius-lg`, 1px `--color-border`, `--shadow-sm` at rest, `--shadow-md` + `scale(1.02)` on hover.
- **Hero tile:** diagonal gradient fill (`--brand-primary` → `--brand-secondary`), white text, spans full width.
- **Labels:** uppercase, letter-spaced section labels (`.bento-tile h2`) and tags — the modular-card, label-driven density this world's Apple-keynote reference uses.

## Do's and Don'ts

### Do:
- **Do** read all color, radius, and soft-shadow values from `tokens.css` custom properties in any new surface — never hardcode a hex that already has a token.
- **Do** keep `<nav-switcher>` visually identical across every world; it is the one cross-world constant.
- **Do** scope a world's signature device (Candy's hard-offset shadows and outlines, Terminal's CLI-reveal and local CRT palette, Bento's label-driven modular tiles) to that world only.

### Don't:
- **Don't** apply Candy Brand's hard-offset, zero-blur shadows or 2–3px outline borders to Terminal Dev or Bento Grid; they read as a different, un-reconciled material system there.
- **Don't** treat Inter/JetBrains Mono/Poppins as confirmed rendered faces when adding new UI — only Baloo 2 + Nunito are actually loaded; verify a webfont link exists before relying on it.
- **Don't** introduce new icon-only controls using raw emoji glyphs without a text label or `aria-label`; the nav-switcher's sun/moon toggle is a carried defect, not a pattern to repeat (see summary).
