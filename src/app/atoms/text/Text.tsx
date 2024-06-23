import { styled } from '~styled/jsx';

const Text = styled('p', {
  base: {
    margin: '0',
    padding: '0',
  },
  variants: {
    content: {
      default: {},
      truncate: {
        minWidth: '0',
        truncate: true,
      },
    },
    font: {
      default: {},
      bold: { fontWeight: 'bold' },
      italic: { fontStyle: 'italic' },
    },
    size: {
      default: {
        textStyle: 'md',
      },
      large: {
        textStyle: 'lg',
      },
      medium: {
        textStyle: 'xl',
      },
      small: {
        textStyle: 'sm',
      },
      smaller: {
        textStyle: 'xs',
      },
    },
    color: {
      default: {},
      dimmed: { color: 'mauve.11' },
      warning: { color: 'yellow.11' },
      error: { color: 'red.11' },
    },
  },
});

export default Text;
