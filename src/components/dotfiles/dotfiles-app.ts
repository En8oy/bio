import { LitElement, html } from "lit";
import resumeData from "../../data/resume.json";
import { t, tList, getStoredLang, UI_STRINGS } from "../../lib/i18n";
import type { Lang } from "../../lib/i18n";
import { gsap, prefersReducedMotion, revealOnScroll } from "../../lib/motion";

const resume = resumeData as any;

// Kept in sync with --om-accent in dotfiles.css — only used here to push
// the same brand color into the shared <nav-switcher> via --color-accent.
const ACCENT = "#00aa8a";

const ICON_DOWNLOAD = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>`;
const ICON_PLAY = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7Z" /></svg>`;
const ICON_MAIL = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>`;

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
    // style, so setting it on `this` had no effect.)
    document.documentElement.style.setProperty("--color-accent", ACCENT);
    document.documentElement.style.setProperty("--color-accent-contrast", "#1a1308");
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
              <a class="om-btn om-btn--primary" href="/resume/cv-${lang}.pdf" download>${ICON_DOWNLOAD}${u("downloadCv")}</a>
              <a class="om-btn om-btn--ghost" href="mailto:${resume.basics.email}">${ICON_PLAY}${u("contact")}</a>
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

        <footer class="om-footer">
          <a class="om-btn om-btn--ghost" href="mailto:${resume.basics.email}">${ICON_MAIL}${resume.basics.email}</a>
          <a class="om-btn om-btn--ghost" href=${resume.basics.github} target="_blank" rel="noreferrer">GitHub</a>
          <a class="om-btn om-btn--ghost" href=${resume.basics.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </footer>
      </main>
    `;
  }
}

customElements.define("dotfiles-app", DotfilesApp);
