import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@ldesign/barcode-core': resolve(__dirname, '../../packages/core/src'),
      '@ldesign/barcode-preact': resolve(__dirname, '../../packages/preact/src'),
    },
  },
  server: { port: 3005, open: true },
});
