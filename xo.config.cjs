module.exports = {
  space: true,
  semicolon: true,
  prettier: true,
  plugins: ['solid'],
  extends: ['plugin:solid/typescript'],
  rules: {
    'import/extensions': ['error', 'never', { svg: 'always', css: 'always' }],
    // Tiptap extensions are imcompatiable
    'import/no-named-as-default': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': 'off',
    // Element.innerText preserves line breaks while textContent doesn't.
    // And we want the former.
    'unicorn/prefer-dom-node-text-content': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
};
