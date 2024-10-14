import { defineConfig, defineGlobalStyles } from '@pandacss/dev';
import { createPreset } from './pandacss/preset';
import { removeUnusedCssVars } from 'pandacss/hooks/remove-unused-css-vars';

const globalCss = defineGlobalStyles({
  'html, body': {
    '--global-font-body': '"Inter Variable", Inter, sans-serif',
    overflow: 'hidden',
    bg: 'bg.default',
    color: 'fg.default',
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
  hooks: {
    'cssgen:done': ({ artifact, content }) => {
      if (artifact === 'styles.css') {
        return removeUnusedCssVars(content);
      }
    },
  },
});
