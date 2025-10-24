import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'es/**',
        'lib/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/tests/**',
        '**/examples/**',
        '**/__tests__/**',
      ],
      include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 80,
        statements: 85,
      },
    },
    include: ['src/**/*.{test,spec}.{js,ts,tsx}', 'tests/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'es', 'lib', 'examples'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});


