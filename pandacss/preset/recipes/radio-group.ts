import { radioGroupAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const radioGroup = defineSlotRecipe({
  className: 'radio-group',
  slots: radioGroupAnatomy.keys(),
  base: {
    root: {
      colorPalette: 'accent',
      display: 'flex',
      gap: '2',
      flexDirection: {
        _vertical: 'column',
        _horizontal: 'row',
      },
    },
    itemControl: {
      width: '5',
      height: '5',
      flexShrink: '0',
      outlineColor: 'transparent',
      rounded: 'full',
      border: '2px solid token(colors.colorPalette.border)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      _peerFocusVisible: {
        outlineOffset: '0.5',
        outline: '2px solid token(colors.colorPalette.default)',
      },
      _checked: {
        bg: 'colorPalette.default',
        borderColor: 'colorPalette.default',
        _before: {
          content: '[""]',
          display: 'inline-block',
          position: 'relative',
          width: '2.5',
          height: '2.5',
          rounded: 'full',
          bg: 'white',
        },
      },
      _disabled: {
        opacity: '0.5',
        _hover: {
          cursor: 'not-allowed',
        },
      },
      cursor: 'pointer',
    },
    item: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      gap: '2',
      _disabled: {
        cursor: 'not-allowed',
      },
    },
    itemText: {
      _disabled: {
        opacity: '0.5',
      },
    },
  },
});
