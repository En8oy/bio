import { LitElement, html } from "lit";
import resumeData from "../../data/resume.json";
import { t, tList, getStoredLang, UI_STRINGS } from "../../lib/i18n";
import type { Lang } from "../../lib/i18n";
import { gsap, prefersReducedMotion, revealOnScroll } from "../../lib/motion";
import { applyWorldAccent } from "../../lib/accent";

const resume = resumeData as any;

// Kept in sync with --om-accent in dotfiles.css — only used here to push
// the same brand color into the shared <nav-switcher> via --color-accent.
const ACCENT = "#00aa8a";

const ICON_MAIL = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>`;
const ICON_GITHUB = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.33.68.96.68 1.94 0 1.4-.01 2.53-.01 2.88 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>`;
const ICON_LINKEDIN = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8.09 18.74h-3V9.5h3Zm-1.5-10.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm12.15 10.5h-3v-4.9c0-1.17-.42-1.97-1.46-1.97a1.58 1.58 0 0 0-1.48 1.06 2 2 0 0 0-.1.71v5.1h-3s.04-8.28 0-9.24h3v1.31a2.98 2.98 0 0 1 2.7-1.49c1.97 0 3.44 1.29 3.44 4.05Z" /></svg>`;

export class DotfilesApp extends LitElement {
  static properties = {
    lang: { state: true },
    // Maps the photo-src HTML attribute set in dotfiles.astro (the
    // astro:assets-optimized WebP URL) to this reactive property.
    photoSrc: { attribute: "photo-src" },
  };

  createRenderRoot() {
    return this;
  }

  declare lang: Lang;
  declare photoSrc: string;

  private langHandler = (e: Event) => {
    this.lang = (e as CustomEvent).detail.lang;
  };

  constructor() {
    super();
    this.lang = "en";
    this.photoSrc = "/profile.jpg";
  }

  connectedCallback() {
    super.connectedCallback();
    this.lang = getStoredLang();
    window.addEventListener("lang-change", this.langHandler);
    // The shared <nav-switcher> is the only header — make it follow this
    // world's accent instead of adding a second nav bar. (--om-accent
    // itself is owned by dotfiles.css directly, not set from here — a
    // same-element CSS declaration always wins over an inherited inline
    // style, so setting it on `this` had no effect.) Goes through
    // applyWorldAccent rather than setting the property directly, so a
    // visitor's header color-picker choice survives navigating in here
    // instead of being silently overwritten back to this world's default.
    applyWorldAccent(ACCENT, "#1a1308");
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("lang-change", this.langHandler);
  }

  firstUpdated() {
    if (prefersReducedMotion()) return;
    gsap.from(".om-hero > *", { opacity: 0, y: 24, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    revealOnScroll(".om-section");
  }

  render() {
    const lang = this.lang;
    const u = (key: keyof typeof UI_STRINGS) => t(UI_STRINGS[key], lang);

    return html`
      <main class="om-page">
        <div class="om-dots" aria-hidden="true"></div>

        <section class="om-hero">
          <div class="om-hero-info">
            <p class="om-subtitle">${t(resume.basics.title, lang)} — ${t(resume.basics.remote, lang)}</p>
            <p class="om-summary">${t(resume.basics.summary, lang)}</p>
            <div class="om-cta-row">
              <a class="om-btn om-btn--primary" href="mailto:${resume.basics.email}">${ICON_MAIL}${resume.basics.email}</a>
              <a class="om-btn om-btn--ghost" href="${resume.basics.github}" target="_blank" rel="noreferrer">${ICON_GITHUB}GitHub</a>
              <a class="om-btn om-btn--ghost" href="${resume.basics.linkedin}" target="_blank" rel="noreferrer">${ICON_LINKEDIN}LinkedIn</a>
            </div>
          </div>
          <div class="om-hero-id">
            <img class="om-photo" src=${this.photoSrc} alt=${resume.basics.name} width="120" height="120" fetchpriority="high" />
            <h1>${resume.basics.name}<span class="om-cursor">_</span></h1>
          </div>
        </section>

        <section id="om-experience" class="om-section">
          <h2 class="om-section-title">${u("experience")}</h2>
          <div class="om-card-grid">
            ${resume.experience.slice(0, 2).map(
              (exp: any, i: number) => html`
                <article class="om-card ${i === 0 ? "om-card--featured" : ""}">
                  <div class="om-card-head">
                    <h3>${exp.url ? html`<a href="${exp.url}" target="_blank" rel="noreferrer">${exp.company}</a>` : exp.company}</h3>
                    <span class="om-dates">${exp.startDate} — ${exp.endDate ?? u("present")}</span>
                  </div>
                  <p class="om-role">${t(exp.role, lang)}</p>
                  <ul>
                    ${tList(exp.highlights, lang).map((h: string) => html`<li>${h}</li>`)}
                  </ul>
                  <div class="om-tags">${exp.stack.map((s: string) => html`<span class="om-tag">${s}</span>`)}</div>
                </article>
              `
            )}
            <!-- Tangente México + UT Parras are both short — one combined
                 card instead of two mostly-empty ones. -->
            <article class="om-card om-card--combo">
              ${resume.experience.slice(2).map(
                (exp: any) => html`
                  <div class="om-combo-item">
                    <div class="om-card-head">
                      <h3>${exp.url ? html`<a href="${exp.url}" target="_blank" rel="noreferrer">${exp.company}</a>` : exp.company}</h3>
                      <span class="om-dates">${exp.startDate} — ${exp.endDate ?? u("present")}</span>
                    </div>
                    <p class="om-role">${t(exp.role, lang)}</p>
                    <ul>
                      ${tList(exp.highlights, lang).map((h: string) => html`<li>${h}</li>`)}
                    </ul>
                    <div class="om-tags">${exp.stack.map((s: string) => html`<span class="om-tag">${s}</span>`)}</div>
                  </div>
                `
              )}
            </article>
          </div>
        </section>

        <section id="om-skills" class="om-section">
          <h2 class="om-section-title">${u("skills")}</h2>
          <div class="om-skill-groups">
            ${Object.entries(resume.skills).map(([category, value]) => {
              const flat = Array.isArray(value) ? value : Object.values(value as object).flat();
              return html`
                <div class="om-skill-group">
                  <h4>${category}</h4>
                  <div class="om-tags">${(flat as string[]).map((s) => html`<span class="om-tag om-tag--ghost">${s}</span>`)}</div>
                </div>
              `;
            })}
          </div>
        </section>

        <section id="om-projects" class="om-section">
          <h2 class="om-section-title">${u("projects")}</h2>
          <div class="om-card-grid">
            ${resume.projects.map(
              (p: any) => html`
                <article class="om-card">
                  <div class="om-card-head">
                    <h3>${p.name}</h3>
                    <span class="om-dates">${t(p.status, lang)}</span>
                  </div>
                  <p>${t(p.description, lang)}</p>
                  <div class="om-tags">${p.stack.map((s: string) => html`<span class="om-tag">${s}</span>`)}</div>
                </article>
              `
            )}
          </div>
        </section>
      </main>
    `;
  }
}

customElements.define("dotfiles-app", DotfilesApp);
