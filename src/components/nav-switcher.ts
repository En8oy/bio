import { LitElement, html, css } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { getStoredLang, t, UI_STRINGS } from "../lib/i18n";
import { restoreAccentOverride, setAccentOverride, clearAccentOverride } from "../lib/accent";

type Theme = "light" | "dark";
type Lang = "en" | "es";

const DESIGNS = [
  { slug: "candy-brand", label: "Candy Brand" },
  { slug: "terminal-dev", label: "Terminal Dev" },
  { slug: "neon", label: "Neon" },
  { slug: "dotfiles", label: "Dotfiles" },
];

// Visitor-facing accent picker: each swatch reuses a color already live
// somewhere in the build (the 3 brand tokens from tokens.css, plus each of
// the 4 worlds' own signature hue) instead of an arbitrary palette, so
// every option is already proven to read well as a filled-button color.
// Contrast pairs match what each hue already uses where it's the default
// (Neon/Dotfiles's own mount code, Candy's ACCENT_CONTRAST) or were chosen
// the same way: ink text for a bright/light hue, white for a dark one.
const ACCENTS = [
  { hex: "#6d5efc", contrast: "#ffffff", name: "Violet" },
  { hex: "#ff5fa2", contrast: "#1a0a12", name: "Magenta" },
  { hex: "#ffb020", contrast: "#1a0a12", name: "Amber" },
  { hex: "#d6fa3a", contrast: "#0a0a08", name: "Lime" },
  { hex: "#22d3ee", contrast: "#04121a", name: "Cyan" },
  { hex: "#00aa8a", contrast: "#1a1308", name: "Teal" },
];

const ICON_RESET = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>`;
const ICON_CHEVRON = html`<svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>`;

const ICON_MENU = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></svg>`;
const ICON_CLOSE = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>`;
// Authored icons instead of emoji glyphs (craft floor: no emoji standing in
// for an icon system) — replaces the ☀️/🌙 theme toggle added earlier.
const ICON_SUN = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>`;
const ICON_MOON = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" /></svg>`;
const ICON_DOWNLOAD = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>`;

// The loading overlay is portaled straight onto <body> instead of rendered
// in <nav-switcher>'s own shadow template: :host has backdrop-filter (for
// the translucent bar), and backdrop-filter establishes a containing block
// for position:fixed descendants — so a fixed overlay nested inside :host
// would be confined to the (header-sized) host box instead of the viewport,
// which is exactly the bug this works around.
const LOADING_OVERLAY_ID = "nav-switcher-loading-overlay";
const LOADING_STYLE_ID = "nav-switcher-loading-style";

function ensureLoadingOverlayStyle() {
  if (document.getElementById(LOADING_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = LOADING_STYLE_ID;
  style.textContent = `
    #${LOADING_OVERLAY_ID} {
      position: fixed;
      inset: 0;
      z-index: 10000;
      display: none;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--color-bg, #fff) 85%, transparent);
      backdrop-filter: blur(2px);
    }
    #${LOADING_OVERLAY_ID}[data-visible="true"] {
      display: flex;
    }
    #${LOADING_OVERLAY_ID} .ns-spinner {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid color-mix(in srgb, var(--color-accent, #6d5efc) 25%, transparent);
      border-top-color: var(--color-accent, #6d5efc);
      animation: ns-spin 0.7s linear infinite;
    }
    @media (prefers-reduced-motion: reduce) {
      #${LOADING_OVERLAY_ID} .ns-spinner {
        animation-duration: 1.6s;
      }
    }
    @keyframes ns-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
}

function createLoadingOverlay(): HTMLDivElement {
  document.getElementById(LOADING_OVERLAY_ID)?.remove();
  const el = document.createElement("div");
  el.id = LOADING_OVERLAY_ID;
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  const spinner = document.createElement("span");
  spinner.className = "ns-spinner";
  el.appendChild(spinner);
  document.body.appendChild(el);
  return el;
}

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
    accentHex: { state: true },
    openMenu: { state: true },
    menuPos: { state: true },
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
    .dropdown-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 6px 8px;
    }
    /* Wraps the theme + accent triggers so mobile can lay them out as one
       row (see the max-width:640px override below) without affecting the
       desktop bar — display:contents here means .controls' flex layout
       treats the two triggers as if this wrapper weren't there at all. */
    .trigger-row {
      display: contents;
    }
    .trigger-swatch {
      width: 13px;
      height: 13px;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--color-text, #111) 25%, transparent);
      flex-shrink: 0;
    }
    .chevron {
      width: 10px;
      height: 10px;
      opacity: 0.6;
    }
    .dropdown-trigger[aria-expanded="true"] .chevron {
      transform: rotate(180deg);
    }
    .dropdown-panel {
      position: fixed;
      z-index: 10010;
      min-width: 168px;
      padding: 10px;
      background: var(--color-surface-raised, #fff);
      border: 1px solid var(--color-border, #e2e2e2);
      border-radius: var(--radius-md, 12px);
      box-shadow: var(--shadow-md, 0 8px 24px rgba(0, 0, 0, 0.18));
      font-family: var(--font-sans, system-ui, sans-serif);
    }
    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .menu-list button {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      border: none;
      background: transparent;
      justify-content: flex-start;
      min-height: 36px;
    }
    .menu-list button[aria-checked="true"] {
      background: color-mix(in srgb, var(--color-accent, #6d5efc) 14%, transparent);
      color: var(--color-accent, #6d5efc);
      font-weight: 600;
    }
    .menu-list button:hover {
      background: color-mix(in srgb, var(--color-accent, #6d5efc) 8%, transparent);
    }
    .swatch-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      padding: 2px;
    }
    .swatch {
      width: 26px;
      height: 26px;
      padding: 0;
      min-height: 0;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--color-text, #111) 20%, transparent);
      cursor: pointer;
      transition: transform 0.12s ease, border-color 0.12s ease;
    }
    .swatch:hover {
      transform: scale(1.1);
    }
    .swatch[aria-pressed="true"] {
      border: 2px solid var(--color-text, #111);
      box-shadow: 0 0 0 2px var(--color-surface-raised, #fff);
    }
    .reset-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      margin-top: 8px;
      border: none;
      background: transparent;
      font-size: 12px;
      color: var(--color-text-muted, #666);
      min-height: 32px;
    }
    .reset-row:hover:not([disabled]) {
      color: var(--color-text, #111);
      background: color-mix(in srgb, var(--color-text, #111) 6%, transparent);
    }
    .reset-row[disabled] {
      opacity: 0.4;
      cursor: default;
    }
    .reset-row svg {
      width: 13px;
      height: 13px;
    }
    .cv-link {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
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
      .dropdown-trigger {
        padding: 10px 12px;
        min-height: 44px;
      }
      .menu-list button {
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
      /* Theme + accent sit side by side as one row here instead of each
         stacking as its own full-width row — display:contents on the
         wrapper (set above, desktop-default) is overridden back to a real
         flex container only at this breakpoint. */
      .mobile-panel .trigger-row {
        display: flex;
        gap: 8px;
      }
      .mobile-panel .trigger-row .dropdown-trigger {
        flex: 1;
      }
    }
  `;

  declare theme: Theme;
  declare lang: Lang;
  declare path: string;
  declare menuOpen: boolean;
  declare loading: boolean;
  /** The visitor's picked accent hex, or null when no override is stored
   * (each world is showing its own default). Only drives which swatch
   * renders as selected — the actual color is applied via accent.ts. */
  declare accentHex: string | null;
  /** Which popover is open — only one at a time, rendered as a single
   * shared panel (see renderDropdownPanel) rather than two separate ones. */
  declare openMenu: "theme" | "accent" | null;
  /** Viewport-relative fixed-position coordinates for the open panel,
   * computed from the trigger button's own rect at open time. */
  declare menuPos: { top: number; right: number } | null;

  private loadingOverlayEl?: HTMLDivElement;
  private activeTriggerEl: HTMLElement | null = null;
  private panelRef = createRef<HTMLElement>();

  constructor() {
    super();
    this.theme = "light";
    this.lang = "en";
    this.path = "";
    this.menuOpen = false;
    this.loading = false;
    this.accentHex = null;
    this.openMenu = null;
    this.menuPos = null;
  }

  /** Closes the popover on a click outside both the trigger and the panel
   * itself — checked via composedPath() so it still matches clicks that
   * land inside this component's own shadow DOM. */
  private handleDocumentClick = (e: MouseEvent) => {
    if (!this.openMenu) return;
    const path = e.composedPath();
    if (this.activeTriggerEl && path.includes(this.activeTriggerEl)) return;
    if (this.panelRef.value && path.includes(this.panelRef.value)) return;
    this.closeMenu();
  };

  private handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.openMenu) this.closeMenu();
  };

  /** Scrolling or resizing would leave the panel's computed position stale
   * (it isn't re-measured on scroll) — closing is simpler and more honest
   * than quietly showing a popover anchored to the wrong spot. */
  private handleViewportChange = () => {
    if (this.openMenu) this.closeMenu();
  };

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

    // Re-apply a stored accent override immediately: the only mechanism
    // that restores one for a world that never sets its own (Terminal
    // Dev), and a harmless no-op for worlds that do, since they each check
    // for this same override on their own mount via applyWorldAccent.
    this.accentHex = restoreAccentOverride()?.accent ?? null;

    ensureLoadingOverlayStyle();
    this.loadingOverlayEl = createLoadingOverlay();

    document.addEventListener("click", this.handleDocumentClick, true);
    document.addEventListener("keydown", this.handleKeydown);
    window.addEventListener("scroll", this.handleViewportChange, true);
    window.addEventListener("resize", this.handleViewportChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.loadingOverlayEl?.remove();
    document.removeEventListener("click", this.handleDocumentClick, true);
    document.removeEventListener("keydown", this.handleKeydown);
    window.removeEventListener("scroll", this.handleViewportChange, true);
    window.removeEventListener("resize", this.handleViewportChange);
  }

  updated() {
    this.setAttribute("data-menu-open", String(this.menuOpen));
    this.loadingOverlayEl?.setAttribute("data-visible", String(this.loading));
  }

  private goTo(slug: string) {
    if (this.path.includes(slug)) return;
    // Full page navigation (new document, new framework island) can take a
    // moment to show anything on a slow mobile connection — this overlay
    // gives instant feedback instead of a frozen blank page in between.
    this.loading = true;
    window.location.href = `/designs/${slug}`;
  }

  private closeMenu() {
    this.openMenu = null;
    this.menuPos = null;
    this.activeTriggerEl = null;
  }

  /** Opens (or, on a repeat click of the same trigger, closes) one of the
   * two popovers. The panel itself is a single shared element rendered at
   * the top level of this component's template (see renderDropdownPanel),
   * not nested inside .nav-inner — .nav-inner scrolls horizontally
   * (overflow-x), and nesting a position:fixed panel inside a scrolling
   * container risks it being clipped by that container's own overflow even
   * though :host's backdrop-filter (not .nav-inner) is its actual
   * containing block. Positioning by the trigger's own getBoundingClientRect
   * works out to the same coordinates either way, since :host is itself
   * pinned at the viewport's top-left corner (top:0; left:0). */
  private toggleMenu(kind: "theme" | "accent", e: MouseEvent) {
    const trigger = e.currentTarget as HTMLElement;
    if (this.openMenu === kind) {
      this.closeMenu();
      return;
    }
    const rect = trigger.getBoundingClientRect();
    this.activeTriggerEl = trigger;
    this.menuPos = { top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) };
    this.openMenu = kind;
  }

  private chooseTheme(theme: Theme) {
    this.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    this.closeMenu();
  }

  private setLang(lang: Lang) {
    if (lang === this.lang) return;
    this.lang = lang;
    localStorage.setItem("lang", lang);
    window.dispatchEvent(new CustomEvent("lang-change", { detail: { lang } }));
  }

  private pickAccent(hex: string, contrast: string) {
    if (hex !== this.accentHex) {
      setAccentOverride(hex, contrast);
      this.accentHex = hex;
    }
    this.closeMenu();
  }

  /** Clears the override and reloads so the current world's own mount code
   * re-applies its own default accent — simpler and more reliable than
   * each world also exposing a "my own default" getter back to the header. */
  private resetAccent() {
    this.closeMenu();
    if (!this.accentHex) return;
    clearAccentOverride();
    window.location.reload();
  }

  private renderThemeTrigger() {
    return html`
      <button
        class="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded=${this.openMenu === "theme" ? "true" : "false"}
        aria-label="Theme"
        @click=${(e: MouseEvent) => this.toggleMenu("theme", e)}
      >
        ${this.theme === "dark" ? ICON_MOON : ICON_SUN} ${ICON_CHEVRON}
      </button>
    `;
  }

  private renderAccentTrigger() {
    const current = ACCENTS.find((a) => a.hex === this.accentHex);
    return html`
      <button
        class="dropdown-trigger"
        aria-haspopup="true"
        aria-expanded=${this.openMenu === "accent" ? "true" : "false"}
        aria-label="Accent color${current ? `: ${current.name}` : ""}"
        @click=${(e: MouseEvent) => this.toggleMenu("accent", e)}
      >
        <span class="trigger-swatch" style="background:${this.accentHex ?? "var(--color-accent, #6d5efc)"}"></span>
        ${ICON_CHEVRON}
      </button>
    `;
  }

  private renderDropdownPanel() {
    if (!this.openMenu || !this.menuPos) return "";
    return html`
      <div
        class="dropdown-panel"
        style="top:${this.menuPos.top}px; right:${this.menuPos.right}px"
        ${ref(this.panelRef)}
      >
        ${this.openMenu === "theme"
          ? html`
              <div role="menu" aria-label="Theme" class="menu-list">
                <button role="menuitemradio" aria-checked=${this.theme === "light" ? "true" : "false"} @click=${() => this.chooseTheme("light")}>
                  ${ICON_SUN} Light
                </button>
                <button role="menuitemradio" aria-checked=${this.theme === "dark" ? "true" : "false"} @click=${() => this.chooseTheme("dark")}>
                  ${ICON_MOON} Dark
                </button>
              </div>
            `
          : html`
              <div class="swatch-grid" role="group" aria-label="Accent color">
                ${ACCENTS.map(
                  (a) => html`
                    <button
                      class="swatch"
                      style="background:${a.hex}"
                      aria-label=${a.name}
                      aria-pressed=${this.accentHex === a.hex ? "true" : "false"}
                      @click=${() => this.pickAccent(a.hex, a.contrast)}
                    ></button>
                  `
                )}
              </div>
              <button class="reset-row" ?disabled=${!this.accentHex} @click=${() => this.resetAccent()}>
                ${ICON_RESET} Reset to default
              </button>
            `}
      </div>
    `;
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
        <div class="trigger-row">${this.renderThemeTrigger()} ${this.renderAccentTrigger()}</div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="nav-inner">${this.renderDesigns()} ${this.renderControls()}</div>
      <button
        class="hamburger"
        @click=${() => {
          this.menuOpen = !this.menuOpen;
          this.closeMenu();
        }}
        aria-label=${this.menuOpen ? "Close menu" : "Open menu"}
        aria-expanded=${this.menuOpen ? "true" : "false"}
      >
        ${this.menuOpen ? ICON_CLOSE : ICON_MENU}
      </button>
      <div class="mobile-panel">${this.renderDesigns()} ${this.renderControls()}</div>
      ${this.renderDropdownPanel()}
    `;
  }
}

customElements.define("nav-switcher", NavSwitcher);
