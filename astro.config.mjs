import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  integrations: [tailwind()],
  output: 'hybrid',
  adapter: vercel(),
  redirects: {
    '/formlario-contacto': '/contacto',
    '/formulario-contacto': '/contacto',
  },
});
