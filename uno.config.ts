import {
  defineConfig,
  presetTypography,
  presetUno,
  presetWebFonts,
} from 'unocss';
import { presetKobalte } from 'unocss-preset-primitives';

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      provider: 'none',
    }),
    presetTypography({
      selectorName: 'mx-prose',
      cssExtend: {
        a: {
          'word-break': 'break-word',
        },
        blockquote: {
          'border-left': '.15em solid currentColor',
          'padding-left': '.5em',
          margin: '.1em 0',
          'font-style': 'normal',
        },
        'pre,code': {
          'word-break': 'break-word',
          'white-space': 'pre-wrap',
        },
        h1: {
          margin: '0.5em 0',
        },
        h2: {
          margin: '0.5em 0',
        },
        h3: {
          margin: '0.5em 0',
        },
        h4: {
          margin: '0.5em 0',
        },
        h5: {
          margin: '0.5em 0',
        },
        h6: {
          margin: '0.5em 0',
        },
        p: {
          margin: '0.5em 0',
        },
        'p:first-child': {
          'margin-top': 0,
        },
        'p:last-child': {
          'margin-bottom': 0,
        },
        pre: {
          margin: '0',
          padding: '0.25rem',
        },
      },
    }),
    // @ts-expect-error Seems to work.
    presetKobalte(),
  ],
  // https://github.com/reslear/unocss-preset-scrollbar-hide
  rules: [
    [
      /^scrollbar-none$/,
      ([_]) => {
        return `
          .scrollbar-none {
            scrollbar-width:none
          }

          .scrollbar-none::-webkit-scrollbar {
            display:none
          }
        `;
      },
    ],
    [
      /^scrollbar-auto$/,
      ([_]) => {
        return `
          .scrollbar-auto {
            scrollbar-width:auto
          }

          .scrollbar-auto::-webkit-scrollbar {
            display:block
          }
        `;
      },
    ],
    ['animate-popup-open', { animation: 'popup-open 200ms ease-out' }],
    ['animate-popup-close', { animation: 'popup-close 150ms ease-in' }],
    ['animate-overlay-open', { animation: 'overlay-open 200ms ease-out' }],
    ['animate-overlay-close', { animation: 'overlay-close 150ms ease-in' }],
    ['animate-dialog-open', { animation: 'dialog-open 200ms ease-out' }],
    ['animate-dialog-close', { animation: 'dialog-close 150ms ease-in' }],
    ['animate-hovercard-open', { animation: 'hovercard-open 200ms ease-out' }],
    ['animate-hovercard-close', { animation: 'hovercard-close 150ms ease-in' }],
  ],
});
