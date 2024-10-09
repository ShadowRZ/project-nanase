import { defineRecipe } from '@pandacss/dev';

export const badge = defineRecipe({
  className: 'badge',
  jsx: ['Badge', 'Badge.AsChild'],
  base: {
    px: '1.5',
    py: '0.5',
    rounded: 'sm',
    textStyle: 'xs',
    fontWeight: 'medium',
  },
  variants: {
    variant: {
      solid: {
        backgroundColor: 'colorPalette.default',
        borderColor: 'colorPalette.border',
        color: 'colorPalette.fg',
      },
      soft: {
        backgroundColor: 'colorPalette.dimmed',
        borderColor: 'colorPalette.border',
        color: 'colorPalette.text',
      },
      outline: {
        backgroundColor: 'colorPalette.dimmed',
        borderColor: 'colorPalette.border',
        color: 'colorPalette.text',
        borderWidth: '1px',
      },
    },
  },
  defaultVariants: {
    variant: 'soft',
  },
});
