import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@ldesign/barcode-core': resolve(__dirname, '../../packages/core/src'),
      '@ldesign/barcode-svelte': resolve(__dirname, '../../packages/svelte/src'),
    },
  },
  server: {
    port: 3003,
    open: true,
  },
});
