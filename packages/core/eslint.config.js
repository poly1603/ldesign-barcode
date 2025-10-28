import antfu from '@antfu/eslint-config'

export default antfu(
  {
    typescript: true,
    vue: false,
    react: false,
    formatters: {
      css: true,
      html: false,
      markdown: true,
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/es/**',
      '**/lib/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/__tests__/**',
    ],
  },
  {
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'quote-props': ['error', 'as-needed'],
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-useless-concat': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-debugger': 'warn',
    },
  },
)
