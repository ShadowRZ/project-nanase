import { avatarAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const avatar = defineSlotRecipe({
  className: 'avatar',
  jsx: ['Avatar', 'MxcAvatar', 'Avatar.WithComponent'],
  slots: avatarAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'accent',
      display: 'inline-block',
      rounded: 'full',
      overflow: 'hidden',
    },
    image: {
      userSelect: 'none',
      flexShrink: '0',
      maxW: 'full',
      width: 'full',
      height: 'full',
      display: 'block',
      _hidden: {
        display: 'none',
      },
    },
    fallback: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      color: 'colorPalette.fg',
      bg: 'colorPalette.default',
      width: 'full',
      height: 'full',
      fontWeight: 'medium',
      _hidden: {
        display: 'none',
      },
    },
  },
  variants: {
    size: {
      large: {
        root: {
          width: '12',
          height: '12',
          '& svg': {
            width: '8',
            height: '8',
          },
        },
      },
      small: {
        root: {
          width: '6',
          height: '6',
          '& svg': {
            width: '4',
            height: '4',
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'large',
  },
});
