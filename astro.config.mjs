// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';
import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Custom domain on GitHub Pages — served from the root, so no `base` is
  // needed (same as a user site). public/CNAME tells GitHub Pages which
  // domain to serve this repo on.
  site: "https://isitagentready.com",
  integrations: [vue(), react(), sitemap()]
});