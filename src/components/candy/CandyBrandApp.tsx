import { useEffect, useRef, useState } from "react";
import resume from "../../data/resume.json";
import { t, tList, getStoredLang, onLangChange, UI_STRINGS, type Lang } from "../../lib/i18n";
import { gsap, prefersReducedMotion, staggerGridIn, revealOnScroll } from "../../lib/motion";
import { applyWorldAccent } from "../../lib/accent";
import "./candy-brand.css";

const ICON_MAIL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);
const ICON_GITHUB = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.33.68.96.68 1.94 0 1.4-.01 2.53-.01 2.88 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
  </svg>
);
const ICON_LINKEDIN = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8.09 18.74h-3V9.5h3Zm-1.5-10.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm12.15 10.5h-3v-4.9c0-1.17-.42-1.97-1.46-1.97a1.58 1.58 0 0 0-1.48 1.06 2 2 0 0 0-.1.71v5.1h-3s.04-8.28 0-9.24h3v1.31a2.98 2.98 0 0 1 2.7-1.49c1.97 0 3.44 1.29 3.44 4.05Z" />
  </svg>
);

// Kept in sync with --candy-lime / --candy-ink in candy-brand.css — only
// used here to push this world's accent into the shared <nav-switcher> and
// the site-wide themed scrollbar (both read --color-accent off <html>),
// matching the pattern every other world already follows.
const ACCENT = "#d6fa3a";
const ACCENT_CONTRAST = "#0a0a08";

interface Props {
  /** Pre-optimized (astro:assets, WebP) photo URL from the .astro page;
   * falls back to the raw file so the component still works standalone. */
  photoSrc?: string;
}

export default function CandyBrandApp({ photoSrc = "/profile.jpg" }: Props) {
  const [lang, setLang] = useState<Lang>("en");
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setLang(getStoredLang());
    return onLangChange(setLang);
  }, []);

  useEffect(() => {
    // applyWorldAccent instead of setting the property directly, so a
    // visitor's header color-picker choice survives navigating in here
    // instead of being silently overwritten back to this world's default.
    applyWorldAccent(ACCENT, ACCENT_CONTRAST);
  }, []);

  // Hero: bouncy entrance (ui-ux-pro-max gsap "Standard" tier, back.out easing).
  useEffect(() => {
    if (prefersReducedMotion() || !heroRef.current) return;
    const items = heroRef.current.querySelectorAll(
      ".candy-photo, .candy-badge, h1, .candy-title, .candy-summary, .candy-pill"
    );
    gsap.from(items, { opacity: 0, y: 24, scale: 0.95, duration: 0.5, stagger: 0.08, ease: "back.out(1.6)" });
  }, []);

  // Cards: bouncy grid stagger on load, section headings fade on scroll.
  useEffect(() => {
    staggerGridIn(".candy-card");
    revealOnScroll(".candy-heading");
  }, []);

  const u = (key: keyof typeof UI_STRINGS) => t(UI_STRINGS[key], lang);

  return (
    <main className="candy">
      <section className="candy-hero" ref={heroRef}>
        <img
          className="candy-photo"
          src={photoSrc}
          alt={resume.basics.name}
          width="120"
          height="120"
          fetchPriority="high"
        />
        <span className="candy-badge">{t(resume.basics.remote, lang)}</span>
        <h1>{resume.basics.name}</h1>
        <p className="candy-title">
          <mark className="candy-highlight">{t(resume.basics.title, lang)}</mark>
        </p>
        <p className="candy-summary">{t(resume.basics.summary, lang)}</p>
        <div className="candy-cta-row">
          <a className="candy-pill candy-pill--solid" href={`mailto:${resume.basics.email}`}>
            {ICON_MAIL}
            {resume.basics.email}
          </a>
          <a className="candy-pill" href={resume.basics.github} target="_blank" rel="noreferrer">
            {ICON_GITHUB}
            GitHub
          </a>
          <a className="candy-pill" href={resume.basics.linkedin} target="_blank" rel="noreferrer">
            {ICON_LINKEDIN}
            LinkedIn
          </a>
        </div>
      </section>

      <section className="candy-section">
        <h2 className="candy-heading">{u("experience")}</h2>
        <div className="candy-stack">
          {resume.experience.slice(0, 2).map((exp, i) => (
            <article className={`candy-card ${i === 0 ? "candy-card--featured" : "candy-card--tall"}`} key={exp.company}>
              <div className="candy-card-head">
                <h3>
                  {exp.url ? (
                    <a href={exp.url} target="_blank" rel="noreferrer">
                      {exp.company}
                    </a>
                  ) : (
                    exp.company
                  )}
                </h3>
                <span className="candy-dates">
                  {exp.startDate} — {exp.endDate ?? u("present")}
                </span>
              </div>
              <p className="candy-role">{t(exp.role, lang)}</p>
              {exp.description && <p className="candy-desc">{t(exp.description, lang)}</p>}
              <ul>
                {tList(exp.highlights, lang).map((h, hi) => (
                  <li key={hi}>{h}</li>
                ))}
              </ul>
              <div className="candy-tags">
                {exp.stack.map((s) => (
                  <span className="candy-tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
          {/* Tangente México + UT Parras are both short entries — one
              combined card instead of two nearly-empty ones. */}
          <article className="candy-card candy-card--combo">
            {resume.experience.slice(2).map((exp) => (
              <div className="candy-combo-item" key={exp.company}>
                <div className="candy-card-head">
                  <h3>
                    {exp.url ? (
                      <a href={exp.url} target="_blank" rel="noreferrer">
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <span className="candy-dates">
                    {exp.startDate} — {exp.endDate ?? u("present")}
                  </span>
                </div>
                <p className="candy-role">{t(exp.role, lang)}</p>
                <ul>
                  {tList(exp.highlights, lang).map((h, hi) => (
                    <li key={hi}>{h}</li>
                  ))}
                </ul>
                <div className="candy-tags">
                  {exp.stack.map((s) => (
                    <span className="candy-tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </article>
        </div>
      </section>

      <section className="candy-section">
        <h2 className="candy-heading">{u("projects")}</h2>
        <div className="candy-grid">
          {resume.projects.map((p) => (
            <article className="candy-card" key={p.name}>
              <div className="candy-card-head">
                <h3>{p.name}</h3>
                <span className="candy-status">{t(p.status, lang)}</span>
              </div>
              <p className="candy-desc">{t(p.description, lang)}</p>
              <div className="candy-tags">
                {p.stack.map((s) => (
                  <span className="candy-tag" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="candy-section">
        <h2 className="candy-heading">{u("education")}</h2>
        <div className="candy-edu">
          {resume.education.map((e) => (
            <div className="candy-edu-item" key={t(e.degree, lang)}>
              <strong>{t(e.degree, lang)}</strong>
              <span>{e.institution}</span>
              <span className="candy-dates">
                {e.startDate} — {e.endDate}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="candy-section">
        <h2 className="candy-heading">{u("skills")}</h2>
        <div className="candy-skills">
          {Object.entries(resume.skills).map(([category, value]) => {
            const flat = Array.isArray(value) ? value : Object.values(value).flat();
            return (
              <div className="candy-skill-group" key={category}>
                <h4>{category}</h4>
                <div className="candy-tags">
                  {(flat as string[]).map((s) => (
                    <span className="candy-tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
