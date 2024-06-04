import { Button as KButton } from '@kobalte/core/button';
import { styled } from '~styled/jsx';

const Button = styled(KButton, {
  base: {
    display: 'inline-flex',
    justifyContent: 'center',
    transitionProperty: 'background-color, filter',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  variants: {
    color: {
      danger: {
        backgroundColor: 'red.9',
        color: 'white',
        _disabled: {
          backgroundColor: 'red.a.9',
        },
        _hover: {
          backgroundColor: 'red.8',
        },
        _active: {
          filter: 'brightness(0.90) saturate(1.1)',
        },
      },
      primary: {
        backgroundColor: 'ruby.9',
        color: 'white',
        _disabled: {
          backgroundColor: 'ruby.a.9',
        },
        _hover: {
          backgroundColor: 'ruby.10',
        },
        _active: {
          filter: 'brightness(0.90) saturate(1.1)',
        },
      },
      secondary: {
        backgroundColor: 'ruby.3',
        color: 'ruby.12',
        _disabled: {
          backgroundColor: 'ruby.a.3',
        },
        _hover: {
          backgroundColor: 'ruby.7',
        },
        _active: {
          backgroundColor: 'ruby.5',
        },
      },
    },
    size: {
      small: {
        px: '0.75rem',
        py: '0.25rem',
        borderRadius: '0.5em',
      },
      medium: {
        px: '1rem',
        py: '0.5rem',
        borderRadius: '0.75em',
      },
    },
  },
});

export default Button;
