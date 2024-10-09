import { defineSlotRecipe } from '@pandacss/dev';

export const card = defineSlotRecipe({
  className: 'card',
  slots: ['root', 'header', 'body', 'footer', 'title', 'description'],
  base: {
    root: {
      bg: 'bg.default',
      rounded: 'md',
      shadow: 'sm',
      border: '1px solid token(colors.border.default)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
      p: '3',
    },
    body: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      pb: '3',
      px: '3',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      pb: '3',
      pt: '1',
      px: '3',
    },
    title: {
      color: 'fg.default',
      textStyle: 'lg',
      lineHeight: 'inherit',
      fontWeight: 'bold',
    },
    description: {
      color: 'fg.muted',
      textStyle: 'sm',
      lineHeight: 'inherit',
    },
  },
});
