import { menuAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

const itemStyle = {
  colorPalette: 'neutral',
  userSelect: 'none',
  outline: 'none',
  rounded: 'sm',
  padding: '2',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '2',
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
};

export const menu = defineSlotRecipe({
  className: 'menu',
  slots: menuAnatomy.keys(),
  base: {
    itemGroupLabel: {
      fontWeight: 'bold',
      textStyle: 'sm',
      margin: '1',
      marginBottom: '0',
      padding: '1',
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
    },
    itemGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    separator: {
      borderTop: '1px solid token(colors.border.default)',
      height: '1px',

      mx: '2',
      my: '1',
    },
    itemIndicator: {
      ms: 'auto',
    },
    item: itemStyle,
    triggerItem: itemStyle,
  },
});
