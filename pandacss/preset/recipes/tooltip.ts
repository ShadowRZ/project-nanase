import { tooltipAnatomy } from '@ark-ui/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'

export const tooltip = defineSlotRecipe({
  className: 'tooltip',
  slots: tooltipAnatomy.keys(),
  base: {
    content: {
      background: 'gray.a12',
      rounded: 'lg',
      boxShadow: 'sm',
      color: 'bg.default',
      p: '2',
      _open: {
        animation: 'popup-open',
      },
      _closed: {
        animation: 'popup-close',
      },
    },
  },
})
