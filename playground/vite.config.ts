import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  // Relative URLs so the build works under any GitHub Pages path
  base: './',
  resolve: {
    alias: {
      '@yoanmarchal/vue-schema-form': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
  },
  build: {
    outDir: '../dist-playground',
    emptyOutDir: true,
  },
})
