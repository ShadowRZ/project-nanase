import { defineKeyframes } from '@pandacss/dev';

export default defineKeyframes({
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
});
