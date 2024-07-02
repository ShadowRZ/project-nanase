import { defineConfig, defineGlobalStyles } from '@pandacss/dev';
import radixColorsPreset from 'pandacss-preset-radix-colors';
import { removeUnusedCssVars } from 'utils/remove-unused-css-vars';
import { removeUnusedKeyframes } from 'utils/remove-unused-keyframes';

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
      keyframes: {
        popupOpen: {
          '0%': {
            opacity: 0,
            transform: 'translateY(0.25rem)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0px)',
          },
        },
        popupClose: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0px)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(0.25rem)',
          },
        },
        hovercardOpen: {
          '0%': {
            opacity: 0,
            transform: 'translateY(-0.25rem)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0px)',
          },
        },
        hovercardClose: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0px)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(-0.25rem)',
          },
        },
        overlayOpen: {
          '0%': {
            opacity: 0,
          },
          '100%': {
            opacity: 1,
          },
        },
        overlayClose: {
          '0%': {
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
        dialogOpen: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.95)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        dialogClose: {
          '0%': {
            opacity: 1,
            transform: 'scale(1)',
          },
          '100%': {
            opacity: 0,
            transform: 'scale(0.95)',
          },
        },
      },
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
