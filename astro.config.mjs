import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

const SITE = 'https://life-tech.es';

export default defineConfig({
  site: SITE,

  // La web original (WordPress) serveix totes les URLs amb barra final.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  integrations: [
    mdx(),
    icon(),
    sitemap({
      // `/gracias/` és una pàgina de confirmació i `/blog/` encara és un
      // placeholder `noindex`; totes dues queden fora del sitemap.
      filter: (page) =>
        !page.includes('/gracias/') &&
        !page.includes('/politica-de-cookies-ue/') &&
        !page.includes('/blog/'),
      serialize(item) {
        if (item.url === `${SITE}/`) {
          item.changefreq = 'weekly';
          item.priority = 1.0;
        } else {
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        return item;
      },
    }),
  ],

  // Tailwind CSS 4 s'integra via plugin de Vite.
  vite: {
    plugins: [tailwindcss()],
  },

  // Fonts self-hosted (Fontsource) amb preload i només els subsets necessaris.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Open Sans',
      cssVariable: '--font-open-sans',
      weights: ['300 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
  ],
});
