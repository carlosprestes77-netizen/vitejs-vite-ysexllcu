import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
// On `build` (GitHub Pages) the site is served from /<repo>/, while dev
// and StackBlitz previews stay at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/vitejs-vite-ysexllcu/' : '/',
  plugins: [react()],
}));
