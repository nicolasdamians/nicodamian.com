import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const latin = (pkg: string, file: string) => `./node_modules/@fontsource-variable/${pkg}/files/${file}`;

export default defineConfig({
  site: 'https://nicodamian.com',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  build: { inlineStylesheets: 'never' },
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "img-src 'self'",
        "font-src 'self'",
        "connect-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
      ],
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [{ src: [latin('inter', 'inter-latin-wght-normal.woff2')], weight: '100 900', style: 'normal' }],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      fallbacks: ['ui-monospace', 'monospace'],
      options: {
        variants: [
          { src: [latin('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')], weight: '100 800', style: 'normal' },
        ],
      },
    },
  ],
});
