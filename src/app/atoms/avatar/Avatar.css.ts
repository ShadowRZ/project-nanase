import { cva } from '~styled/css';

export const avatar = cva({
  base: {
    display: 'block',
    flexShrink: '0',
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

export const avatarImage = cva({
  base: {
    borderRadius: '100%',
    overflow: 'clip',
  },
  variants: {
    outlined: {
      true: {
        outlineStyle: 'solid',
        outlineOffset: '-2px',
        outlineWidth: '2px',
        outlineColor: 'rgb(244 63 94 / 0.5)', // FIXME: Swappable Color
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

export const avatarFallback = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    borderWidth: '2px',
    borderColor: 'rgb(244 63 94 / 0.5)', // FIXME: Swappable Color
    color: 'rgb(244 63 94)', // FIXME: Swappable Color
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

export const fallbackIcon = cva({
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
