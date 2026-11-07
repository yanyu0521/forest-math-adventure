import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves this project from /<repository>/.
  // Keep the root path for local development.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/forest-math-adventure/' : '/',
});
