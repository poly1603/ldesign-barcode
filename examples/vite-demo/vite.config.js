import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@ldesign/barcode': resolve(__dirname, '../../src/index.ts'),
      '@ldesign/barcode/vue': resolve(__dirname, '../../src/adapters/vue/index.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['@ldesign/barcode'],
  },
  server: {
    port: 3003,
    open: true,
    host: true
  },
});

