import { useEffect, useRef, useState } from "react";
import resume from "../../data/resume.json";
import { t, tList, getStoredLang, onLangChange, UI_STRINGS, type Lang } from "../../lib/i18n";
import { gsap, prefersReducedMotion, staggerGridIn, revealOnScroll } from "../../lib/motion";
import "./candy-brand.css";

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
        <p className="candy-title">{t(resume.basics.title, lang)}</p>
        <p className="candy-summary">{t(resume.basics.summary, lang)}</p>
        <div className="candy-cta-row">
          <a className="candy-pill candy-pill--solid" href={`mailto:${resume.basics.email}`}>
            {resume.basics.email}
          </a>
          <a className="candy-pill" href={resume.basics.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="candy-pill" href={resume.basics.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </section>

      <section className="candy-section">
        <h2 className="candy-heading">{u("experience")}</h2>
        <div className="candy-stack">
          {resume.experience.map((exp, i) => {
            const sizeClass =
              i === 0 ? "candy-card--featured" : i === resume.experience.length - 1 ? "candy-card--wide" : "";
            return (
            <article className={`candy-card ${sizeClass}`} key={exp.company}>
              <div className="candy-card-head">
                <h3>{exp.company}</h3>
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
            );
          })}
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
