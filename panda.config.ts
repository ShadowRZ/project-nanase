import { defineConfig, defineGlobalStyles } from '@pandacss/dev';

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
  include: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@hanekokoro-ui/solid/src/**/*.{js,jsx,ts,tsx}',
  ],
  exclude: [],
  presets: ['@hanekokoro-ui/panda-preset'],
  outdir: 'styled-system',
  jsxFramework: 'solid',
  importMap: '@hanekokoro-ui/styled-system',
  globalCss,
  theme: {
    extend: {
      slotRecipes: {
        avatar: {
          jsx: ['MxcAvatar'],
        },
      },
    },
  },
});
