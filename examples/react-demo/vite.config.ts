import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ldesign/barcode-core': resolve(__dirname, '../../packages/core/src'),
      '@ldesign/barcode-react': resolve(__dirname, '../../packages/react/src'),
    },
  },
  server: {
    port: 3002,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
