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
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    font: {
      default: {},
      bold: { fontWeight: 'bold' },
      italic: { fontStyle: 'italic' },
    },
    size: {
      default: {
        fontSize: '1rem',
        lineHeight: '1.5rem',
      },
      large: {
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
      },
      medium: {
        fontSize: '1.125rem',
        lineHeight: '1.75rem',
      },
      small: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
      },
      smaller: {
        fontSize: '0.75rem',
        lineHeight: '1rem',
      },
    },
    color: {
      default: {},
      warning: { color: 'yellow.11' },
      error: { color: 'red.11' },
    },
  },
});

export default Text;
