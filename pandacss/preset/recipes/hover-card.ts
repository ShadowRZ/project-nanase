import { hoverCardAnatomy } from '@ark-ui/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const hoverCard = defineSlotRecipe({
  className: 'hoverCard',
  slots: hoverCardAnatomy.keys(),
  base: {
    content: {
      '--hover-card-background': 'colors.bg.default',
      background: 'var(--hover-card-background)',
      rounded: 'md',
      boxShadow: 'sm',
      border: '1px solid token(colors.border.default)',
      maxW: '80',
      p: '3',
      position: 'relative',
      _open: {
        animation: 'popup-open',
      },
      _closed: {
        animation: 'popup-close',
      },
    },
    arrow: {
      '--arrow-size': '12px',
      '--arrow-background': 'var(--hover-card-background)',
    },
    arrowTip: {
      borderTopWidth: '1px',
      borderLeftWidth: '1px',
      borderColor: 'border.default',
    },
  },
});
