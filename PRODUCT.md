# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers conducting a deep technical review — they have already passed Irbing past an initial recruiter screen and are now evaluating his technical background in depth, not skimming for 30 seconds.

## Product Purpose

An interactive cover-letter/resume site for Irbing Alejandro Moreno García's job search. It gives a hiring manager a deep-review experience of his background, with the primary success outcome being that they download his PDF CV to carry into their own hiring process (ATS, internal sharing, etc.).

## Positioning

Unlike a static PDF resume, the site itself demonstrates the frontend versatility it claims: the same resume data renders through three structurally distinct designs, each built on a different framework the candidate claims fluency in (React, Lit/Web Components, Vue). A competing candidate's PDF or generic portfolio template cannot make this same claim live.

## Operating Context

- Viewed during a hiring manager's deep technical review, after an initial recruiter screen has already passed.
- Bilingual audience (EN/ES) — Irbing is Mexico-based with a mix of US-remote and Mexican work history.
- Primarily a desktop "deep review" session, but must remain usable on mobile.
- Three design surfaces live inside an iframe on one page, switchable without losing theme/language state (stored in localStorage): `candy-brand` (React), `terminal-dev` (Lit/Web Components), `bento-grid` (Vue).
- Single source of truth for all content: `src/data/resume.json`, bilingual per field (`{ en, es }`).
- Shared `<nav-switcher>` Web Component (Lit) provides design / theme / language controls identically across all three surfaces.
- Centralized color tokens in `src/styles/tokens.css` so the palette can be swapped once the user settles on a direction.

## Capabilities and Constraints

- Astro static site; each design is its own route under `/designs/*`, loaded into an iframe from `/`.
- Primary CTA across all designs: download CV as PDF. Source PDFs already exist at `~/seafile/Seafile/Mi Biblioteca/Multimedia/Curriculum/cv_en.pdf` and `cv_es.pdf` — not yet wired into the Astro project as a download action.
- GSAP animations (entrance/stagger/scroll-reveal) already applied per design, gated behind `prefers-reduced-motion`.
- Undecided: whether a 4th/5th design will be added later; whether the PDF download should trigger the matching-language file automatically.

## Brand Commitments

- Name: Irbing Alejandro Moreno García. Title: Senior Full Stack Engineer / Senior Full Stack Developer (en/es).
- GitHub: github.com/En8oy · LinkedIn: linkedin.com/in/en8oy — must stay accurate, never altered or fabricated.

## Evidence on Hand

- `src/data/resume.json` — real work history (THIIO, WebforceHQ, Tangente México, Universidad Tecnológica de Parras de la Fuente) and real personal projects (Stonks, DashPhone), bilingual, sourced directly from `cv_en.md`/`cv_es.md`.
- Existing PDF CVs at `~/seafile/Seafile/Mi Biblioteca/Multimedia/Curriculum/cv_en.pdf` and `cv_es.pdf`.
- No testimonials, case studies, press, or third-party endorsements exist — future work must not fabricate any.

## Product Principles

1. Resume content is non-negotiable ground truth (`src/data/resume.json`) — never embellish or invent experience, dates, or claims.
2. Each design must prove technical range by actually running on the framework it claims, not just visually referencing it.
3. Bilingual parity: every surface works equally in EN and ES — translation is not an afterthought bolted on later.
4. The PDF download is the primary conversion — every design must surface it clearly, never bury it behind secondary navigation.
5. This is a deep-review context, not a 30-second skim: scanability still matters, but depth and detail are welcome where a recruiter-facing surface would need to cut them.

## Accessibility & Inclusion

WCAG AA baseline: contrast 4.5:1, full keyboard navigation, visible focus states, and `prefers-reduced-motion` support (already implemented for the GSAP entrance/scroll animations).
