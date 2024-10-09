export const keyframes = {
  // @pandacss/preset-panda
  spin: {
    to: {
      transform: 'rotate(360deg)',
    },
  },
  ping: {
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },
  pulse: {
    '50%': {
      opacity: '.5',
    },
  },
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
    },
    '50%': {
      transform: 'none',
      animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
    },
  },
  // @shadowrz/hanekokoro-ui
  'backdrop-open': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  'backdrop-close': {
    '0%': {
      opacity: 1,
    },
    '100%': {
      opacity: 0,
    },
  },
  'dialog-open': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.95)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  'dialog-close': {
    '0%': {
      opacity: 1,
      transform: 'scale(1)',
    },
    '100%': {
      opacity: 0,
      transform: 'scale(0.95)',
    },
  },
  'popup-open': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-0.25rem)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  'popup-close': {
    '0%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '100%': {
      opacity: 0,
      transform: 'translateY(-0.25rem)',
    },
  },
};
