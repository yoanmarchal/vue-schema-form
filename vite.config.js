import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const r = path => fileURLToPath(new URL(path, import.meta.url))

// Library build. The demo app has its own config in playground/.
export default defineConfig({
  plugins: [vue()],
  publicDir: false,
  build: {
    lib: {
      entry: r('src/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rolldownOptions: {
      external: ['vue'],
    },
    sourcemap: true,
  },
  test: {
    environment: 'happy-dom',
    alias: {
      'vite-form': r('src/index.ts'),
    },
    include: ['{src,playground}/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/index.ts', 'src/types.ts', 'src/**/*.test.ts'],
      reporter: ['text', 'html', 'lcov', 'json', 'json-summary'],
      reportOnFailure: true,
      thresholds: {
        statements: 100,
        branches: 95,
        functions: 100,
        lines: 100,
      },
    },
  },
})
