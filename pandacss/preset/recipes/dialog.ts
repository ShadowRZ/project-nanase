import { dialogAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const dialog = defineSlotRecipe({
  className: 'dialog',
  slots: dialogAnatomy.keys(),
  base: {
    backdrop: {
      bg: 'black.a6',
      position: 'fixed',
      inset: 0,
      _open: {
        animation: 'backdrop-open',
      },
      _closed: {
        animation: 'backdrop-close',
      },
      isolation: 'isolate',
    },
    positioner: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '4',
      isolation: 'isolate',
    },
    content: {
      bg: 'bg.default',
      display: 'flex',
      flexDirection: 'column',
      padding: '4',
      minWidth: 'sm',
      maxHeight: 'full',
      overflow: 'hidden',
      rounded: 'md',
      _open: {
        animation: 'dialog-open',
      },
      _closed: {
        animation: 'dialog-close',
      },
    },
    title: {
      textStyle: 'lg',
      fontWeight: 'bold',
      margin: 0,
    },
    description: {
      color: 'fg.muted',
      textStyle: 'md',
    },
  },
});
