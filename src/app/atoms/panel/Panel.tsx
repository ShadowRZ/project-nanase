import { styled } from '~styled/jsx';

const Panel = styled('div', {
  base: {
    rounded: 'lg',
    bg: {
      base: 'white',
      _dark: 'black',
    },
    color: {
      base: 'black',
      _dark: 'white',
    },
  },
  variants: {
    decoration: {
      bordered: {
        borderWidth: '1',
        borderColor: 'mauve.7',
      },
      shadowed: {
        shadow: 'md',
        _dark: {
          shadowColor: 'mauve.9',
        },
      },
      all: {
        borderWidth: '1',
        borderColor: 'mauve.7',
        shadow: 'md',
        _dark: {
          shadowColor: 'mauve.9',
        },
      },
    },
  },
});

export default Panel;
