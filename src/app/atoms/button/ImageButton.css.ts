import { cva } from '~styled/css';

export const imageButton = cva({
  base: {
    borderRadius: '100%',
    backgroundColor: 'transparent',
    flexShrink: '0',
    overflow: 'clip',
  },
  variants: {
    size: {
      large: {
        width: '3rem',
        height: '3rem',
      },
      small: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  },
});

export const image = cva({
  base: {
    transitionProperty: 'filter',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '100%',
    overflow: 'clip',
  },
  variants: {
    size: {
      large: {
        width: '3rem',
        height: '3rem',
      },
      small: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
    checked: {
      true: {
        filter: 'brightness(.75)',
      },
    },
  },
});

export const fallback = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionProperty: 'border-color, background-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    borderRadius: '100%',
    backgroundColor: 'ruby.3',
    _hover: {
      backgroundColor: 'ruby.4',
    },
    _active: {
      backgroundColor: 'ruby.5',
    },
  },
  variants: {
    checked: {
      true: {
        backgroundColor: 'ruby.5',
      },
    },
    size: {
      large: {
        width: '3rem',
        height: '3rem',
      },
      small: {
        width: '1.5rem',
        height: '1.5rem',
      },
    },
  },
});

export const fallbackIcon = cva({
  base: {
    color: 'ruby.12',
  },
  variants: {
    size: {
      large: {
        width: '2rem',
        height: '2rem',
      },
      small: {
        width: '1rem',
        height: '1rem',
      },
    },
  },
});
