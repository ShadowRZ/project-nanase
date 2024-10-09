import { defineRecipe } from '@pandacss/dev';

export const text = defineRecipe({
  className: 'text',
  jsx: ['Heading', 'Text'],
  variants: {
    variant: {
      heading: {
        fontWeight: 'bold',
      },
    },
    size: {
      xs: { textStyle: 'xs', lineHeight: '1.125rem' },
      sm: { textStyle: 'sm', lineHeight: '1.25rem' },
      md: { textStyle: 'md', lineHeight: '1.5rem' },
      lg: { textStyle: 'lg', lineHeight: '1.75rem' },
      xl: { textStyle: 'xl', lineHeight: '1.875rem' },
      h1: { fontSize: '2.75rem' },
      h2: { fontSize: '2.5rem' },
      h3: { fontSize: '2rem' },
      h4: { fontSize: '1.75rem' },
      h5: { fontSize: '1.5rem' },
      h6: { fontSize: '1.25rem' },
    },
  },
});
