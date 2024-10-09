import { defineConfig, defineGlobalStyles } from '@pandacss/dev';
import { createPreset } from './pandacss/preset';
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
    createPreset({
      semanticColors: {
        success: 'grass',
        warning: 'amber',
        error: 'red',
      },
    }),
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
