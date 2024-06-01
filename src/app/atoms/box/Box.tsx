import { styled } from '~styled/jsx';

const Box = styled('div', {
  base: {
    borderRadius: '0.5rem',
    padding: '0.5rem',
  },
  variants: {
    color: {
      default: {
        backgroundColor: 'mauve.3',
        color: 'mauve.12',
      },
      primary: {
        backgroundColor: 'ruby.9',
        color: 'white',
      },
      secondary: {
        backgroundColor: 'ruby.3',
        color: 'ruby.12',
      },
    },
  },
});

export default Box;
