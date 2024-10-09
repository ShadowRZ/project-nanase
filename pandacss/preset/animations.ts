import { defineTokens } from '@pandacss/dev';

export const animations = defineTokens.animations({
  // @pandacss/preset-panda
  spin: { value: 'spin 1s linear infinite' },
  ping: { value: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' },
  pulse: { value: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' },
  bounce: { value: 'bounce 1s infinite' },
  // @shadowrz/hanekokoro-ui
  'backdrop-open': {
    value: 'backdrop-open 200ms ease-out',
  },
  'backdrop-close': {
    value: 'backdrop-close 150ms ease-in',
  },
  'dialog-open': {
    value: 'dialog-open 200ms ease-out',
  },
  'dialog-close': {
    value: 'dialog-close 150ms ease-in',
  },
  'popup-open': {
    value: 'popup-open 200ms ease-out',
  },
  'popup-close': {
    value: 'popup-close 150ms ease-in',
  },
});
