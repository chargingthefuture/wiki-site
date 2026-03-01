import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: ['**/dist/**', '**/.next/**', '**/.expo/**', '**/node_modules/**'],
  },
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      complexity: ['warn', 10],
      'max-lines-per-function': [
        'warn',
        {
          max: 200,
          skipBlankLines: true,
          skipComments: true,
          IIFEs: true,
        },
      ],
    },
  },
  {
    files: [
      'src/**/*.test.{ts,tsx,js,jsx}',
      'src/**/*.spec.{ts,tsx,js,jsx}',
      'src/**/*.stories.{ts,tsx,js,jsx}',
    ],
    rules: {
      complexity: 'off',
      'max-lines-per-function': 'off',
    },
  },
];
