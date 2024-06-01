import { defineConfig } from '@pandacss/dev';
import radixColorsPreset from 'pandacss-preset-radix-colors';

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  theme: {
    extend: {},
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
