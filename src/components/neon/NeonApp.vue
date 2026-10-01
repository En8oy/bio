<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from "vue";
import resume from "../../data/resume.json";
import { t, tList, getStoredLang, onLangChange, UI_STRINGS, type Lang } from "../../lib/i18n";
import { gsap, prefersReducedMotion, revealOnScroll } from "../../lib/motion";

// Pre-optimized (astro:assets, WebP) from the .astro page; falls back to
// the raw file so the component still works standalone.
const props = withDefaults(defineProps<{ photoSrc?: string }>(), { photoSrc: "/profile.jpg" });

const lang = ref<Lang>("en");
let unsubscribe: (() => void) | undefined;

onMounted(async () => {
  lang.value = getStoredLang();
  unsubscribe = onLangChange((l) => (lang.value = l));

  // The shared <nav-switcher> is the only header — make it reflect this
  // world's accent instead of adding a second, duplicate nav bar.
  document.documentElement.style.setProperty("--color-accent", "#22d3ee");
  document.documentElement.style.setProperty("--color-accent-contrast", "#04121a");

  await nextTick();
  if (prefersReducedMotion()) return;
  // ui-ux-pro-max gsap "Standard" tier hero entrance, then a scroll reveal
  // per section — mirrors hypr.land's staggered hero + on-scroll sections.
  gsap.from(".hl-hero > *", { opacity: 0, y: 24, duration: 0.6, stagger: 0.12, ease: "power2.out" });
  revealOnScroll(".hl-section");
});
onUnmounted(() => unsubscribe?.());

function u(key: keyof typeof UI_STRINGS) {
  return t(UI_STRINGS[key], lang.value);
}

const cvHref = computed(() => `/resume/cv-${lang.value}.pdf`);

const skillGroups = computed(() =>
  Object.entries(resume.skills).map(([category, value]) => ({
    category,
    items: Array.isArray(value) ? value : Object.values(value).flat(),
  }))
);
</script>

<template>
  <main class="hl-page">
    <div class="hl-glow hl-glow--1" aria-hidden="true"></div>
    <div class="hl-glow hl-glow--2" aria-hidden="true"></div>

    <section class="hl-hero">
      <div class="hl-hero-id">
        <img class="hl-photo" :src="props.photoSrc" :alt="resume.basics.name" width="140" height="140" fetchpriority="high" />
        <h1 class="hl-gradient-text">{{ resume.basics.name }}</h1>
      </div>
      <div class="hl-hero-info">
        <p class="hl-subtitle">{{ t(resume.basics.title, lang) }} — {{ t(resume.basics.remote, lang) }}</p>
        <p class="hl-summary">{{ t(resume.basics.summary, lang) }}</p>
        <div class="hl-cta-row">
          <a class="hl-btn hl-btn--primary" :href="cvHref" download>{{ u("downloadCv") }}</a>
          <a class="hl-btn hl-btn--ghost" :href="`mailto:${resume.basics.email}`">{{ u("contact") }}</a>
        </div>
      </div>
    </section>

    <section id="hl-experience" class="hl-section">
      <h2 class="hl-section-title">{{ u("experience") }}</h2>
      <div class="hl-card-grid">
        <article
          v-for="(exp, i) in resume.experience"
          :key="exp.company"
          class="hl-card"
          :class="{ 'hl-card--wide': i === 0 }"
        >
          <div class="hl-card-head">
            <h3>{{ exp.company }}</h3>
            <span class="hl-dates">{{ exp.startDate }} — {{ exp.endDate ?? u("present") }}</span>
          </div>
          <p class="hl-role">{{ t(exp.role, lang) }}</p>
          <ul>
            <li v-for="(h, hi) in tList(exp.highlights, lang)" :key="hi">{{ h }}</li>
          </ul>
          <div class="hl-tags">
            <span v-for="s in exp.stack" :key="s" class="hl-tag">{{ s }}</span>
          </div>
        </article>
      </div>
    </section>

    <section id="hl-skills" class="hl-section">
      <h2 class="hl-section-title">{{ u("skills") }}</h2>
      <div class="hl-skill-groups">
        <div v-for="g in skillGroups" :key="g.category" class="hl-skill-group">
          <h4>{{ g.category }}</h4>
          <div class="hl-tags">
            <span v-for="s in g.items" :key="s" class="hl-tag hl-tag--ghost">{{ s }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="hl-projects" class="hl-section">
      <h2 class="hl-section-title">{{ u("projects") }}</h2>
      <div class="hl-card-grid">
        <article v-for="p in resume.projects" :key="p.name" class="hl-card">
          <div class="hl-card-head">
            <h3>{{ p.name }}</h3>
            <span class="hl-dates">{{ t(p.status, lang) }}</span>
          </div>
          <p>{{ t(p.description, lang) }}</p>
          <div class="hl-tags">
            <span v-for="s in p.stack" :key="s" class="hl-tag">{{ s }}</span>
          </div>
        </article>
      </div>
    </section>

    <footer class="hl-footer">
      <div class="hl-social-row">
        <a class="hl-btn hl-btn--ghost" :href="`mailto:${resume.basics.email}`">{{ resume.basics.email }}</a>
        <a class="hl-btn hl-btn--ghost" :href="resume.basics.github" target="_blank" rel="noreferrer">GitHub</a>
        <a class="hl-btn hl-btn--ghost" :href="resume.basics.linkedin" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  </main>
</template>

<style>
@import "./neon.css";
</style>
