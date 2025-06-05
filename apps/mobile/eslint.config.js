import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default compat.config({
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    es2021: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
  },
});
