import { defineConfig, defineGlobalStyles } from '@pandacss/dev';
import { createPreset } from './pandacss/preset';

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
    colorPalette: 'accent',
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
});
