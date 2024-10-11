import { defineRecipe } from '@pandacss/dev';

export const input = defineRecipe({
  className: 'input',
  jsx: ['Input', 'Field.Input', 'UIField.Input'],
  base: {
    appearance: 'none',
    background: 'none',
    border: '1px solid {colors.border.default}',
    rounded: 'md',
    colorPalette: 'accent',
    color: 'fg.default',
    outline: 'none',
    position: 'relative',
    transitionDuration: 'normal',
    transitionProperty: 'box-shadow, border-color',
    transitionTimingFunction: 'default',
    width: 'full',
    padding: '2',
    _disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
    _focus: {
      borderColor: 'colorPalette.default',
      boxShadow: '0 0 0 1px token(colors.colorPalette.default)',
    },
    _invalid: {
      borderColor: 'fg.error',
      _focus: {
        borderColor: 'fg.error',
        boxShadow: '0 0 0 1px token(colors.border.error)',
      },
    },
  },
});
