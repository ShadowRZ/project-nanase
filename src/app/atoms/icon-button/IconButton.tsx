import { splitProps, type Component, type ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { cva, cx } from '~styled/css';

export const iconButton = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'common',
  },
  variants: {
    checked: {
      true: {},
    },
    color: {
      default: {
        bg: 'transparent',
        _hover: {
          bg: 'gray.3',
        },
        _active: {
          bg: 'gray.4',
        },
      },
      primary: {
        color: 'ruby.12',
        bg: 'ruby.3',
        _hover: {
          bg: 'ruby.4',
        },
        _active: {
          bg: 'ruby.5',
        },
      },
      secondary: {
        color: 'mauve.12',
        _hover: {
          bg: 'mauve.4',
        },
        _active: {
          bg: 'mauve.5',
        },
      },
    },
    type: {
      'large-bordered': {
        rounded: 'full',
        width: '12',
        height: '12',
      },
      'small-bordered': {
        rounded: 'full',
        width: '6',
        height: '6',
      },
      circle: {
        rounded: 'full',
        bg: 'transparent',
        padding: '1',
        _hover: {
          bg: 'gray.3',
        },
        _active: {
          bg: 'gray.4',
        },
      },
      normal: {
        rounded: 'md',
        bg: 'transparent',
        padding: '1',
        _hover: {
          bg: 'gray.3',
        },
        _active: {
          bg: 'gray.4',
        },
      },
    },
  },
  compoundVariants: [
    {
      checked: true,
      type: ['large-bordered', 'small-bordered'],
      color: 'default',
      css: {
        bg: 'gray.4',
      },
    },
    {
      checked: true,
      type: ['large-bordered', 'small-bordered'],
      color: 'primary',
      css: {
        bg: 'ruby.5',
      },
    },
    {
      checked: true,
      type: ['large-bordered', 'small-bordered'],
      color: 'secondary',
      css: {
        bg: 'mauve.5',
      },
    },
    {
      checked: true,
      type: ['circle', 'normal'],
      css: {
        bg: 'gray.4',
      },
    },
  ],
  defaultVariants: {
    color: 'default',
  },
});

export const icon = cva({
  variants: {
    type: {
      'large-bordered': {
        width: '8',
        height: '8',
      },
      'small-bordered': {
        width: '4',
        height: '4',
      },
      circle: {
        width: '6',
        height: '6',
      },
      normal: {
        width: '6',
        height: '6',
      },
    },
  },
});

type IconButtonProps = {
  [key: string]: any;
  as?: ValidComponent;
  type: 'large-bordered' | 'small-bordered' | 'normal' | 'circle';
  icon: ValidComponent;
  class?: string;
  iconClass?: string;
  checked?: boolean;
};

const IconButton: Component<IconButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'as',
    'checked',
    'class',
    'icon',
    'iconClass',
    'type',
  ]);

  return (
    <Dynamic
      component={local.as ?? 'button'}
      {...others}
      class={cx(
        iconButton({
          checked: props.checked,
          type: props.type,
          color: 'primary',
        }),
        local.class
      )}
    >
      <Dynamic
        component={local.icon}
        class={cx(icon({ type: props.type }), local.iconClass)}
      />
    </Dynamic>
  );
};

export default IconButton;
