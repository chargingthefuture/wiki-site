import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['**/node_modules/**', '**/.expo/**', '**/dist/**'],
  },
  {
    files: ['App.tsx', 'src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
