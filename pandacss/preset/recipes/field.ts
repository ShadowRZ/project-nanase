import { fieldAnatomy } from '@ark-ui/anatomy'
import { defineSlotRecipe } from '@pandacss/dev'

export const field = defineSlotRecipe({
  className: 'field',
  slots: fieldAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
    },
    label: {
      color: 'fg.default',
      fontWeight: 'bold',
      _disabled: {
        color: 'fg.disabled',
      },
    },
    helperText: {
      color: 'fg.muted',
      _disabled: {
        color: 'fg.disabled',
      },
    },
    errorText: {
      color: 'fg.error',
      fontWeight: 'bold',
      _disabled: {
        color: 'fg.disabled',
      },
    },
  },
})
