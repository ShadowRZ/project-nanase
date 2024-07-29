import { defineConfig, defineGlobalStyles } from '@pandacss/dev';
import radixColorsPreset from 'pandacss-preset-radix-colors';
import { removeUnusedCssVars } from './pandacss/hooks/remove-unused-css-vars';
import { removeUnusedKeyframes } from './pandacss/hooks/remove-unused-keyframes';
import keyframes from './pandacss/keyframes';

const globalCss = defineGlobalStyles({
  'html, body': {
    fontFamily: 'sans',
    overflow: 'hidden',
    bg: {
      base: 'white',
      _dark: 'black',
    },
    color: {
      base: 'black',
      _dark: 'white',
    },
  },
  '#root': {
    height: 'dvh',
    maxHeight: 'dvh',
  },
});

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  presets: [
    radixColorsPreset({
      darkMode: true,
    }),
    '@pandacss/preset-panda',
  ],
  outdir: 'styled-system',
  jsxFramework: 'solid',
  importMap: '~styled',
  globalCss,
  theme: {
    extend: {
      keyframes,
    },
  },
  hooks: {
    'cssgen:done'({ artifact, content }) {
      if (artifact === 'styles.css') {
        return removeUnusedCssVars(removeUnusedKeyframes(content));
      }
    },
  },
});
