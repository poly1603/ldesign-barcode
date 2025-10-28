import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: true,
    formatters: {
      css: true,
      html: true,
      markdown: true,
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/es/**',
      '**/lib/**',
      '**/.turbo/**',
      '**/coverage/**',
    ],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-prop-types': 'error',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)
