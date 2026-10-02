import { LitElement, html, css } from "lit";
import { getStoredLang, t, UI_STRINGS } from "../lib/i18n";

type Theme = "light" | "dark";
type Lang = "en" | "es";

const DESIGNS = [
  { slug: "candy-brand", label: "Candy Brand" },
  { slug: "terminal-dev", label: "Terminal Dev" },
  { slug: "neon", label: "Neon" },
  { slug: "dotfiles", label: "Dotfiles" },
];

const ICON_MENU = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>`;
const ICON_CLOSE = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>`;
// Authored icons instead of emoji glyphs (craft floor: no emoji standing in
// for an icon system) — replaces the ☀️/🌙 theme toggle added earlier.
const ICON_SUN = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>`;
const ICON_MOON = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" /></svg>`;
const ICON_DOWNLOAD = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>`;

/**
 * <nav-switcher> is a framework-agnostic Web Component (Lit) embedded
 * identically in every design (Vue, React, and Lit pages alike), so
 * switching design / theme / language works the same way everywhere.
 * Design switching is a real navigation (changes which page the iframe
 * shows); theme and language are read from / written to localStorage so
 * they persist across that navigation without query params. Each world
 * also sets --color-accent on <html> itself on mount, so this bar's
 * active-button color (and now its background tint) follows whichever
 * page is currently showing.
 */
export class NavSwitcher extends LitElement {
  static properties = {
    theme: { state: true },
    lang: { state: true },
    path: { state: true },
    menuOpen: { state: true },
    loading: { state: true },
  };

  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      display: flex;
      justify-content: center;
      padding: 8px 16px;
      font-family: var(--font-sans, system-ui, sans-serif);
      background: color-mix(in srgb, var(--color-surface, #fff) 82%, var(--color-accent, transparent) 10%);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid color-mix(in srgb, var(--color-accent, var(--color-border, #e2e2e2)) 30%, var(--color-border, #e2e2e2));
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      max-width: 1100px;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .designs {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
    button {
      font: inherit;
      font-size: 13px;
      border: 1px solid var(--color-border, #ccc);
      background: var(--color-surface-raised, #fff);
      color: var(--color-text, #111);
      padding: 6px 10px;
      min-height: 32px;
      border-radius: var(--radius-sm, 6px);
      cursor: pointer;
      line-height: 1;
      white-space: nowrap;
      transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }
    button:hover:not([aria-current="true"]) {
      border-color: var(--color-accent, #6d5efc);
      color: var(--color-accent, #6d5efc);
    }
    button[aria-current="true"] {
      background: var(--color-accent, #6d5efc);
      border-color: var(--color-accent, #6d5efc);
      color: var(--color-accent-contrast, #fff);
      font-weight: 600;
    }
    .controls {
      display: flex;
      gap: 6px;
      align-items: center;
      flex-shrink: 0;
    }
    .cv-link {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid var(--color-accent, #6d5efc);
      background: var(--color-accent, #6d5efc);
      color: var(--color-accent-contrast, #fff);
      padding: 6px 10px;
      min-height: 32px;
      border-radius: var(--radius-sm, 6px);
      text-decoration: none;
      white-space: nowrap;
      flex-shrink: 0;
      transition: opacity 0.15s ease;
    }
    .cv-link:hover {
      opacity: 0.85;
    }
    .cv-link svg {
      width: 15px;
      height: 15px;
      vertical-align: -2px;
    }
    @media (pointer: coarse) {
      .cv-link {
        padding: 10px 14px;
        min-height: 44px;
      }
    }
    .hamburger {
      display: none;
      padding: 6px;
      min-width: 36px;
    }
    .hamburger svg,
    button svg {
      width: 15px;
      height: 15px;
      vertical-align: -2px;
    }
    .mobile-panel {
      display: none;
    }
    /* Touch/coarse pointers (phones, tablets) get a bigger target than a
       mouse needs — impeccable adapt: detect input method, not screen size. */
    @media (pointer: coarse) {
      button {
        padding: 10px 14px;
        min-height: 44px;
      }
    }
    @media (max-width: 640px) {
      :host {
        justify-content: flex-end;
      }
      .nav-inner {
        display: none;
      }
      .hamburger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      :host([data-menu-open="true"]) .mobile-panel {
        display: flex;
      }
      .mobile-panel {
        position: fixed;
        top: 48px;
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 14px;
        padding: 16px;
        background: color-mix(in srgb, var(--color-surface, #fff) 96%, var(--color-accent, transparent) 10%);
        border-bottom: 1px solid var(--color-border, #e2e2e2);
      }
      .mobile-panel .designs,
      .mobile-panel .controls {
        flex-direction: column;
        align-items: stretch;
      }
    }
    .loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--color-bg, #fff) 85%, transparent);
      backdrop-filter: blur(2px);
    }
    .spinner {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid color-mix(in srgb, var(--color-accent, #6d5efc) 25%, transparent);
      border-top-color: var(--color-accent, #6d5efc);
      animation: spin 0.7s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner {
        animation-duration: 1.6s;
      }
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  declare theme: Theme;
  declare lang: Lang;
  declare path: string;
  declare menuOpen: boolean;
  declare loading: boolean;

  constructor() {
    super();
    this.theme = "light";
    this.lang = "en";
    this.path = "";
    this.menuOpen = false;
    this.loading = false;
  }

  connectedCallback() {
    super.connectedCallback();

    // ?mode= overrides and persists, same precedence as lang: URL param >
    // stored choice > system preference.
    const modeParam = new URLSearchParams(window.location.search).get("mode");
    if (modeParam === "light" || modeParam === "dark") {
      localStorage.setItem("theme", modeParam);
      this.theme = modeParam;
    } else {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      this.theme = storedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    document.documentElement.setAttribute("data-theme", this.theme);

    // getStoredLang() already resolves ?lang= > stored > navigator.language.
    this.lang = getStoredLang();
    this.path = window.location.pathname;
  }

  updated() {
    this.setAttribute("data-menu-open", String(this.menuOpen));
  }

  private goTo(slug: string) {
    if (this.path.includes(slug)) return;
    // Full page navigation (new document, new framework island) can take a
    // moment to show anything on a slow mobile connection — this overlay
    // gives instant feedback instead of a frozen blank page in between.
    this.loading = true;
    window.location.href = `/designs/${slug}`;
  }

  private toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", this.theme);
    document.documentElement.setAttribute("data-theme", this.theme);
  }

  private setLang(lang: Lang) {
    if (lang === this.lang) return;
    this.lang = lang;
    localStorage.setItem("lang", lang);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: { lang } }));
  }

  private renderDesigns() {
    return html`
      <div class="designs">
        ${DESIGNS.map(
          (d) => html`
            <button aria-current=${this.path.includes(d.slug) ? "true" : "false"} @click=${() => this.goTo(d.slug)}>
              ${d.label}
            </button>
          `
        )}
      </div>
    `;
  }

  private renderControls() {
    return html`
      <div class="controls">
        <a class="cv-link" href="/resume/cv-${this.lang}.pdf" download>${ICON_DOWNLOAD}${t(UI_STRINGS.downloadCv, this.lang)}</a>
        <button @click=${() => this.setLang("en")} aria-current=${this.lang === "en" ? "true" : "false"}>EN</button>
        <button @click=${() => this.setLang("es")} aria-current=${this.lang === "es" ? "true" : "false"}>ES</button>
        <button
          @click=${() => this.toggleTheme()}
          aria-label=${this.theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          ${this.theme === "dark" ? ICON_SUN : ICON_MOON}
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="nav-inner">${this.renderDesigns()} ${this.renderControls()}</div>
      <button
        class="hamburger"
        @click=${() => (this.menuOpen = !this.menuOpen)}
        aria-label=${this.menuOpen ? "Close menu" : "Open menu"}
        aria-expanded=${this.menuOpen ? "true" : "false"}
      >
        ${this.menuOpen ? ICON_CLOSE : ICON_MENU}
      </button>
      <div class="mobile-panel">${this.renderDesigns()} ${this.renderControls()}</div>
      ${this.loading
        ? html`<div class="loading-overlay" role="status" aria-live="polite">
            <span class="spinner"></span>
          </div>`
        : ""}
    `;
  }
}

customElements.define("nav-switcher", NavSwitcher);
