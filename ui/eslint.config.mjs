import eslintJs from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [
    eslintJs.configs.recommended,
    tseslint.configs.recommended,
    eslintReact.configs['recommended-typescript'],
    eslintPluginPrettier,
  ],
  files: ['**/*.ts', '**/*.tsx'],
  ignores: ['vite.config.ts'],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
