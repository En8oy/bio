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
          <a class="hl-btn hl-btn--primary" :href="`mailto:${resume.basics.email}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" /></svg>
            {{ resume.basics.email }}
          </a>
          <a class="hl-btn hl-btn--ghost" :href="resume.basics.github" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.51-1.11-1.51-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.64 1.03 2.76 0 3.94-2.34 4.8-4.57 5.06.36.33.68.96.68 1.94 0 1.4-.01 2.53-.01 2.88 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" /></svg>
            GitHub
          </a>
          <a class="hl-btn hl-btn--ghost" :href="resume.basics.linkedin" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 2H3.55A1.55 1.55 0 0 0 2 3.55v16.9A1.55 1.55 0 0 0 3.55 22h16.9A1.55 1.55 0 0 0 22 20.45V3.55A1.55 1.55 0 0 0 20.45 2ZM8.09 18.74h-3V9.5h3Zm-1.5-10.5a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Zm12.15 10.5h-3v-4.9c0-1.17-.42-1.97-1.46-1.97a1.58 1.58 0 0 0-1.48 1.06 2 2 0 0 0-.1.71v5.1h-3s.04-8.28 0-9.24h3v1.31a2.98 2.98 0 0 1 2.7-1.49c1.97 0 3.44 1.29 3.44 4.05Z" /></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>

    <section id="hl-experience" class="hl-section">
      <h2 class="hl-section-title">{{ u("experience") }}</h2>
      <div class="hl-card-grid">
        <article
          v-for="(exp, i) in resume.experience.slice(0, 2)"
          :key="exp.company"
          class="hl-card"
          :class="i === 0 ? 'hl-card--featured' : ''"
        >
          <div class="hl-card-head">
            <h3><a v-if="exp.url" :href="exp.url" target="_blank" rel="noreferrer">{{ exp.company }}</a><template v-else>{{ exp.company }}</template></h3>
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
        <!-- Tangente México + UT Parras are both short — one combined card
             instead of two mostly-empty ones. -->
        <article class="hl-card hl-card--combo">
          <div v-for="exp in resume.experience.slice(2)" :key="exp.company" class="hl-combo-item">
            <div class="hl-card-head">
              <h3><a v-if="exp.url" :href="exp.url" target="_blank" rel="noreferrer">{{ exp.company }}</a><template v-else>{{ exp.company }}</template></h3>
              <span class="hl-dates">{{ exp.startDate }} — {{ exp.endDate ?? u("present") }}</span>
            </div>
            <p class="hl-role">{{ t(exp.role, lang) }}</p>
            <ul>
              <li v-for="(h, hi) in tList(exp.highlights, lang)" :key="hi">{{ h }}</li>
            </ul>
            <div class="hl-tags">
              <span v-for="s in exp.stack" :key="s" class="hl-tag">{{ s }}</span>
            </div>
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
  </main>
</template>

<style>
@import "./neon.css";
</style>
