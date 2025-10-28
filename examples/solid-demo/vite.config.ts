import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { resolve } from 'path';

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@ldesign/barcode-core': resolve(__dirname, '../../packages/core/src'),
      '@ldesign/barcode-solid': resolve(__dirname, '../../packages/solid/src'),
    },
  },
  server: { port: 3004, open: true },
});
