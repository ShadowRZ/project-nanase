import { defineRecipe } from '@pandacss/dev'

export const formLabel = defineRecipe({
  className: 'formLabel',
  base: {
    color: 'fg.default',
    fontWeight: 'bold',
  },
})
