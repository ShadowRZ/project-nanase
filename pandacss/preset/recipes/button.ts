import { defineRecipe } from '@pandacss/dev';

export const button = defineRecipe({
  className: 'button',
  jsx: ['Button', 'Button.AsChild', 'IconButton', 'IconButton.AsChild'],
  base: {
    appearance: 'none',
    position: 'relative',
    transitionDuration: 'normal',
    transitionProperty: 'background, border-color, color, filter',
    transitionTimingFunction: 'default',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    rounded: 'lg',
    outline: 'none',
    outlineOffset: '0.5',
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    flexShrink: '0',
    _hover: {
      cursor: 'pointer',
    },
    _disabled: {
      opacity: '0.5',
      filter: 'unset',
      _hover: {
        cursor: 'not-allowed',
      },
    },
    _focusVisible: {
      outline: '2px solid token(colors.colorPalette.default)',
    },
  },
  variants: {
    variant: {
      solid: {
        colorPalette: 'accent',
        backgroundColor: 'colorPalette.default',
        color: 'colorPalette.fg',
        _hover: {
          backgroundColor: 'colorPalette.emphasized',
        },
      },
      soft: {
        colorPalette: 'gray',
        backgroundColor: 'colorPalette.dimmed',
        color: 'colorPalette.text',
        _hover: {
          backgroundColor: 'colorPalette.light',
        },
      },
      ghost: {
        colorPalette: 'gray',
        backgroundColor: 'transparent',
        color: 'colorPalette.text',
        _hover: {
          backgroundColor: 'colorPalette.dimmed',
        },
      },
      outline: {
        colorPalette: 'gray',
        borderWidth: '1px',
        borderColor: 'colorPalette.border',
        backgroundColor: 'transparent',
        color: 'colorPalette.text',
        _hover: {
          backgroundColor: 'colorPalette.dimmed',
        },
      },
      link: {
        verticalAlign: 'baseline',
        _disabled: {
          color: 'border.disabled',
          cursor: 'not-allowed',
          _hover: {
            color: 'border.disabled',
          },
        },
        height: 'auto!',
        px: '0!',
        minW: '0!',
      },
    },
    size: {
      small: {
        h: '8',
        minW: '8',
        textStyle: 'sm',
        px: '3',
        gap: '2',
        '& svg': {
          width: '4',
          height: '4',
        },
      },
      normal: {
        px: '3',
        height: '9',
        minWidth: '9',
        gap: '2',
        '& svg': {
          width: '5',
          height: '5',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'normal',
  },
});
