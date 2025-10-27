import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@ldesign/barcode-core': resolve(__dirname, '../../packages/core/src/index.ts'),
    },
  },
  server: {
    port: 3000,
  },
});

