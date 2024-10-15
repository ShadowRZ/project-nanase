import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import solid from 'eslint-plugin-solid/configs/typescript';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import unicorn from 'eslint-plugin-unicorn';
import importX from 'eslint-plugin-import-x';
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
        ...globals.es2021,
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
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  unicorn.configs['flat/recommended'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  promise.configs['flat/recommended'],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  comments.recommended,
  // eslint-disable-next-line import-x/no-named-as-default-member
  ...tseslint.configs.recommendedTypeChecked,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
      // Tiptap extensions are imcompatiable
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
    // eslint-disable-next-line import-x/no-named-as-default-member
    extends: [tseslint.configs.disableTypeChecked],
  }
);
