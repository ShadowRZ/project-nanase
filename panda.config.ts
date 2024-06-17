import { defineConfig } from '@pandacss/dev';
import radixColorsPreset from 'pandacss-preset-radix-colors';

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
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
  presets: [
    radixColorsPreset({
      darkMode: true,
    }),
    '@pandacss/preset-panda',
  ],
  outdir: 'styled-system',
  jsxFramework: 'solid',
});
