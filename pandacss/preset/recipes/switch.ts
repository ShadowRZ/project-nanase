import { switchAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const switchRecipe = defineSlotRecipe({
  className: 'switch',
  jsx: ['Switch', /Switch\.+/],
  slots: switchAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      colorPalette: 'accent',
      position: 'relative',
      gap: '1',
    },
    control: {
      boxSizing: 'content-box',
      width: '8',
      flexShrink: '0',
      outlineColor: 'transparent',
      rounded: 'sm',
      border: '1px solid',
      outlineOffset: '2px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      p: '0.5',
      cursor: 'pointer',
      transitionDuration: 'normal',
      transitionProperty: 'background',
      transitionTimingFunction: 'default',
      background: 'bg.emphasized',
      borderColor: 'colorPalette.border',
      _peerFocusVisible: {
        outlineOffset: '2px',
        outline: '2px solid',
        outlineColor: 'border.outline',
      },
      _checked: {
        outlineColor: 'colorPalette.default',
        bg: 'colorPalette.default',
      },
    },
    thumb: {
      width: '4',
      height: '4',
      rounded: 'xs',
      shadow: 'xs',
      background: 'white',
      transitionDuration: 'normal',
      transitionProperty: 'transform, background',
      transitionTimingFunction: 'default',
      _checked: {
        transform: 'translateX(100%)',
        background: { _light: 'bg.default', _dark: 'colorPalette.fg' },
      },
    },
  },
});
