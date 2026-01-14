import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  redirects: {
    '/formlario-contacto': '/contacto',
    '/formulario-contacto': '/contacto',
  },
});
