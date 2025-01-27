/* eslint-disable import-x/no-named-as-default-member */
import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid/configs/typescript';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import-x';
import promise from 'eslint-plugin-promise';

export default tseslint.config(
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
  },
  {
    ignores: ['styled-system/', 'dist/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  eslint.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  unicorn.configs['flat/recommended'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  promise.configs['flat/recommended'],
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
  },
  // Project Rules
  {
    rules: {
      'import-x/no-unresolved': 'off',
      'import-x/extensions': [
        'error',
        'never',
        { svg: 'always', css: 'always' },
      ],
      'import-x/no-named-as-default': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/empty-brace-spaces': 'off',
      'unicorn/consistent-function-scoping': 'off',
      // Element.innerText preserves line breaks while textContent doesn't.
      // And we want the former.
      'unicorn/prefer-dom-node-text-content': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  // Disable Typed lintings for Storybook configs
  {
    files: ['.storybook/*.{ts,tsx}'],
    extends: [tseslint.configs.disableTypeChecked],
  }
);
