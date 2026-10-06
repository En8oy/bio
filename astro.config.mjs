// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Actually hosted on Vercel at cv.vinery.dev — isitagentready.com /
  // GitHub Pages was an earlier, abandoned deployment target. `site` only
  // affects canonical URLs, OG tags, and the sitemap; Vercel needs no
  // `base` since it's served from the domain root either way.
  site: "https://cv.vinery.dev",
  integrations: [vue(), react(), sitemap()]
});