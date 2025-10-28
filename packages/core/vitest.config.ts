import { defineConfig } from 'vitest/config'

export default defineConfig({
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
        '**/types/**',
      ],
      include: ['src/**/*.ts'],
      all: true,
      lines: 90,
      functions: 90,
      branches: 85,
      statements: 90,
    },
    include: ['src/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'dist', 'es', 'lib'],
    benchmark: {
      include: ['test/**/*.bench.ts'],
      exclude: ['node_modules', 'dist'],
    },
  },
})
