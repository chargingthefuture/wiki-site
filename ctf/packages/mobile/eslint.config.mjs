import tsParser from '@typescript-eslint/parser';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

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
    plugins: {
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
