/**
 * @ldesign/barcode-core build configuration
 */

import { defineConfig } from '@ldesign/builder';

export default defineConfig({
  name: '@ldesign/barcode-core',
  entry: 'src/index.ts',

  output: {
    esm: {
      enabled: true,
      dir: 'es',
    },
    cjs: {
      enabled: true,
      dir: 'lib',
    },
    dts: {
      enabled: true,
      dir: 'es',
    },
  },

  external: [
    '@ldesign/shared',
    '@ericblade/quagga2',
  ],

  sourcemap: true,
});

