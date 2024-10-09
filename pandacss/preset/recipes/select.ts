import { selectAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const select = defineSlotRecipe({
  className: 'select',
  slots: selectAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'accent',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5',
      width: 'full',
    },
    control: {
      position: 'relative',
    },
    trigger: {
      appearance: 'none',
      background: 'none',
      border: '1px solid {colors.border.default}',
      rounded: 'md',
      color: 'fg.default',
      outline: 'none',
      position: 'relative',
      transitionDuration: 'normal',
      transitionProperty: 'box-shadow, border-color',
      transitionTimingFunction: 'default',
      display: 'inline-flex',
      justifyContent: 'space-between',
      width: 'full',
      padding: '2',
      cursor: 'pointer',
      _placeholderShown: {
        color: 'fg.subtle',
      },
      _disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
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
  variants: {
    variant: {
      outline: {
        trigger: {
          borderWidth: '1px',
          _focus: {
            borderColor: 'colorPalette.default',
            boxShadow: '0 0 0 1px token(colors.colorPalette.default)',
          },
        },
      },
      ghost: {
        trigger: {
          _hover: {
            background: 'gray.a3',
          },
          _focus: {
            background: 'gray.a3',
          },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
});
