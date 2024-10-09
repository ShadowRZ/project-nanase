import { comboboxAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const combobox = defineSlotRecipe({
  className: 'combobox',
  slots: comboboxAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5',
      width: 'full',
    },
    control: {
      position: 'relative',
    },
    trigger: {
      bottom: '0',
      color: 'fg.muted',
      position: 'absolute',
      right: '2',
      top: '0',
    },
    label: {
      pb: '0.5',
    },
    content: {
      border: '1px solid token(colors.border.default)',
      rounded: 'md',
      boxShadow: 'sm',

      bg: 'bg.default',
      color: 'inherit',
      overflow: 'hidden',
      padding: '1',

      outline: 'none',
      transformOrigin: 'var(--transform-origin)',
      _open: {
        animation: 'popup-open',
      },
      _closed: {
        animation: 'popup-close',
      },
      _focusVisible: {
        outlineOffset: '0.5',
        outline: '2px solid token(colors.border.outline)',
      },
    },
    item: {
      colorPalette: 'neutral',
      userSelect: 'none',
      outline: 'none',
      rounded: 'sm',
      padding: '2',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '2 ',
      _hover: {
        cursor: 'pointer',
        backgroundColor: 'colorPalette.dimmed',
      },
      _disabled: {
        opacity: '0.5',
        _hover: {
          cursor: 'not-allowed',
          background: 'transparent',
        },
      },
      color: 'colorPalette.text',
      _highlighted: {
        backgroundColor: 'colorPalette.dimmed',
      },
    },
    itemGroupLabel: {
      fontWeight: 'bold',
      textStyle: 'sm',
      px: '2',
      py: '1',
    },
    itemIndicator: {
      ms: 'auto',
    },
  },
});
