import { LitElement, html } from "lit";
import resumeData from "../../data/resume.json";
import { t, tList, getStoredLang, UI_STRINGS } from "../../lib/i18n";
import type { Lang } from "../../lib/i18n";
import { prefersReducedMotion, staggerGridIn } from "../../lib/motion";

const resume = resumeData as any;

// Decorative neofetch-style ASCII art, purely visual (aria-hidden) — the
// real name/title text next to it carries the actual information.
const ASCII_ART = `==*==========.:++++*%++++++++++++++++*+.........-======+----
==+#+++==+=++:=++++%**+-:.....:::-=++++.........==========--
==+#++++=++++-+*++#*+=:............--++.........===========-
===+%+++=++++=++**%+.................-+........++======+====
++++#*++++++++*++%+...........-.......--.......++++====++===
++++#%*++++++++***-......:--=+*===..:::::.....-++++===++++==
++++++**#+++++*%%*--......:-:.:-:-#=.=--:.....=++=++=====++=
++++++%%*++=++******::....=--.-*###=+*+=:.....+++++++++==+=-
+++++##+++=+=##****+......***==**####++=.....=++=++===+*++++
#*++#+++*%++=+**#%#*-...--+*++*####**+*:....:++++===+**+*==+
###++++##++==++*+*#%+....=****#####*+++-.::-:++=++=++****=++
++*+++*#+++=+*++****+=..--*#######++++++....++++++++++***===
++*+++#+++**##%%#++++++..-**##***#*+++++::--+++++++++****++-
*+*++*#+++*++**#%%++++*=.-===++***+=++++==+++++++++++*****+-
#*#++*#++++*++++%%*+*++:.:---====:....:++==+++++++++++****++
++##++#++++#+++*%#=.........:............-+++*+++++++*****++
++##++**++++**+:...........................-+***********+***
++##+++%*+*++*:..............................:**************
####+++*%%#*+=................................:*************
####++++*#%%%:.................................:*#**********
####++++****+...............................::::-+**********
####++++*###:.................................::-=-***###***
####++++*%%%..............................:.:.::==*###*#*#**
**##+++++%%*-.......................:..:.......::-###*#==-=+
---===+++**##.....................:..........-=++*#####==---
######*****+::.................:........=**########%%##==---
#######%%%%#................:..::::.....-+****####%%%#*==---
######%#%%#:...................:.:......:-+****###%%##===---
*#######%#:..............................-=+***######+===---
**#######................................:=++**##*--=-====--`;

const WORKSPACES = [
  { num: 1, target: "win-profile" },
  { num: 2, target: "win-experience" },
  { num: 3, target: "win-skills" },
  { num: 4, target: "win-projects" },
];

// Authored, single-weight SVGs — no emoji/icon-font stand-ins (craft floor).
const ICON_MAIL = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>`;
const ICON_GITHUB = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.33.68.96.68 1.94 0 1.4-.01 2.53-.01 2.88 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>`;
const ICON_LINKEDIN = html`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8.09 18.74h-3V9.5h3Zm-1.5-10.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm12.15 10.5h-3v-4.9c0-1.17-.42-1.97-1.46-1.97a1.58 1.58 0 0 0-1.48 1.06 2 2 0 0 0-.1.71v5.1h-3s.04-8.28 0-9.24h3v1.31a2.98 2.98 0 0 1 2.7-1.49c1.97 0 3.44 1.29 3.44 4.05Z" /></svg>`;

export class TerminalApp extends LitElement {
  static properties = {
    lang: { state: true },
    clock: { state: true },
  };

  // Disable shadow DOM so the page can share global tokens.css / fonts easily.
  createRenderRoot() {
    return this;
  }

  declare lang: Lang;
  declare clock: string;

  private langHandler = (e: Event) => {
    this.lang = (e as CustomEvent).detail.lang;
  };
  private clockTimer?: ReturnType<typeof setInterval>;

  constructor() {
    super();
    this.lang = "en";
    this.clock = "";
  }

  connectedCallback() {
    super.connectedCallback();
    this.lang = getStoredLang();
    window.addEventListener("lang-change", this.langHandler);
    this.tickClock();
    this.clockTimer = setInterval(() => this.tickClock(), 30_000);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("lang-change", this.langHandler);
    clearInterval(this.clockTimer);
  }

  firstUpdated() {
    // ui-ux-pro-max gsap "Standard" tier: windows pop into place from the
    // center, like a tiling WM's window-open animation.
    if (prefersReducedMotion()) return;
    staggerGridIn(".hypr-window", this);
  }

  private tickClock() {
    const locale = this.lang === "es" ? "es-MX" : "en-US";
    this.clock = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(new Date());
  }

  render() {
    const lang = this.lang;
    const u = (key: keyof typeof UI_STRINGS) => t(UI_STRINGS[key], lang);
    return html`
      <main class="hypr-desktop">
        <div class="hypr-frame">
        <div class="hypr-bar">
          <nav class="hypr-workspaces" aria-label=${u("jumpToSection")}>
            ${WORKSPACES.map((w) => html`<a class="hypr-ws" href="#${w.target}">${w.num}</a>`)}
          </nav>
          <span class="hypr-clock">${this.clock}</span>
          <div class="hypr-win-controls" aria-hidden="true">
            <span class="hypr-win-btn hypr-win-btn--min">
              <svg viewBox="0 0 10 10"><path d="M2 5h6" /></svg>
            </span>
            <span class="hypr-win-btn hypr-win-btn--max">
              <svg viewBox="0 0 10 10"><rect x="2.5" y="2.5" width="5" height="5" /></svg>
            </span>
            <span class="hypr-win-btn hypr-win-btn--close">
              <svg viewBox="0 0 10 10"><path d="M2.5 2.5l5 5M7.5 2.5l-5 5" /></svg>
            </span>
          </div>
        </div>

        <div class="hypr-grid">
          <section id="win-profile" class="hypr-window hypr-window--profile">
            <div class="hypr-titlebar"><span class="t-prompt">$</span>whoami</div>
            <div class="hypr-body">
              <div class="hypr-profile-body">
                <pre class="hypr-ascii" aria-hidden="true">${ASCII_ART}</pre>
                <div>
                  <h1 class="t-name">${resume.basics.name}</h1>
                  <p class="t-role">${t(resume.basics.title, lang)} — ${t(resume.basics.remote, lang)}</p>
                  <div class="hypr-contact-row">
                    <a class="hypr-btn" href="mailto:${resume.basics.email}">${ICON_MAIL}${resume.basics.email}</a>
                    <a class="hypr-btn" href="${resume.basics.github}" target="_blank" rel="noreferrer">${ICON_GITHUB}GitHub</a>
                    <a class="hypr-btn" href="${resume.basics.linkedin}" target="_blank" rel="noreferrer">${ICON_LINKEDIN}LinkedIn</a>
                  </div>
                </div>
              </div>
              <p class="hypr-summary">${t(resume.basics.summary, lang)}</p>
            </div>
          </section>

          <section id="win-experience" class="hypr-window hypr-window--experience">
            <div class="hypr-titlebar">
              <h2 class="hypr-title"><span class="t-prompt">$</span>cat experience.log</h2>
            </div>
            <div class="hypr-body">
              ${resume.experience.map(
                (exp: any) => html`
                  <div class="t-block">
                    <h3 class="t-block-title">
                      ${exp.url ? html`<a href="${exp.url}" target="_blank" rel="noreferrer">${exp.company}</a>` : exp.company}
                      <span class="t-dim">(${exp.startDate} — ${exp.endDate ?? u("present")})</span>
                    </h3>
                    <p class="t-dim">${t(exp.role, lang)}</p>
                    <ul>
                      ${tList(exp.highlights, lang).map((h: string) => html`<li>${h}</li>`)}
                    </ul>
                    <p class="t-tags">${exp.stack.join(" · ")}</p>
                  </div>
                `
              )}
            </div>
          </section>

          <section id="win-skills" class="hypr-window hypr-window--skills">
            <div class="hypr-titlebar">
              <h2 class="hypr-title"><span class="t-prompt">$</span>cat skills.json</h2>
            </div>
            <div class="hypr-body hypr-skills">
              ${Object.entries(resume.skills).map(([category, value]) => {
                const flat = Array.isArray(value) ? value : Object.values(value as object).flat();
                return html`<p><span class="t-key">${category}</span>: ${(flat as string[]).join(", ")}</p>`;
              })}
            </div>
          </section>

          <section id="win-projects" class="hypr-window hypr-window--projects">
            <div class="hypr-titlebar">
              <h2 class="hypr-title"><span class="t-prompt">$</span>cat projects.md</h2>
            </div>
            <div class="hypr-body">
              ${resume.projects.map(
                (p: any) => html`
                  <div class="t-block">
                    <h3 class="t-block-title">${p.name} <span class="t-dim">· ${t(p.status, lang)}</span></h3>
                    <p>${t(p.description, lang)}</p>
                    <p class="t-tags">${p.stack.join(" · ")}</p>
                  </div>
                `
              )}
            </div>
          </section>
        </div>
        <p class="hypr-cursor-line"><span class="t-prompt">$</span><span class="t-blink">_</span></p>
        </div>
      </main>
    `;
  }
}

customElements.define("terminal-app", TerminalApp);
