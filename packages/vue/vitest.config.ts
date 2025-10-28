import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'es/',
        'lib/',
        '**/__tests__/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
      include: ['src/**/*.{ts,vue}'],
      all: true,
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', 'es', 'lib'],
  },
})
