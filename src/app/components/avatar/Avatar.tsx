import { Button } from '@kobalte/core/button';
import {
  Image,
  type ImageImgProps,
  type ImageRootProps,
} from '@kobalte/core/image';
import { type PolymorphicProps } from '@kobalte/core/polymorphic';
import {
  Show,
  splitProps,
  type Component,
  type ComponentProps,
  type ValidComponent,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { cva, cx } from '~styled/css';
import UserCircleFill from '~icons/ph/user-circle-fill';

type AvatarVariants = {
  size: 'large' | 'small';
  checked?: boolean;
};

const avatar = cva({
  base: {
    display: 'block',
    flexShrink: '0',
    rounded: 'full',
    overflow: 'clip',
  },
  variants: {
    size: {
      large: {
        width: '12',
        height: '12',
      },
      small: {
        width: '6',
        height: '6',
      },
    },
  },
});

const icon = cva({
  variants: {
    size: {
      large: {
        width: '8',
        height: '8',
      },
      small: {
        width: '4',
        height: '4',
      },
    },
  },
});

const fallback = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'ruby.3',
    color: 'ruby.12',
  },
  variants: {
    size: {
      large: {
        width: '12',
        height: '12',
      },
      small: {
        width: '6',
        height: '6',
      },
    },
    button: {
      true: {
        transition: 'common',
        _hover: {
          backgroundColor: 'ruby.4',
        },
        _active: {
          backgroundColor: 'ruby.5',
        },
      },
    },
    checked: {
      true: {
        backgroundColor: 'ruby.5',
      },
    },
  },
});

const buttonImage = cva({
  base: {
    transition: 'common',
    _hover: {
      filter: 'brightness(.9)',
    },
  },
  variants: {
    checked: {
      true: {
        filter: 'brightness(.75)',
        ':hover': {
          filter: 'brightness(.75)',
        },
      },
    },
  },
});

type AvatarRootProps<T extends ValidComponent> = ComponentProps<T> &
  AvatarVariants &
  ImageRootProps;

function AvatarRoot<T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, AvatarRootProps<T>>
) {
  const [variants, others] = splitProps(props as AvatarRootProps<T>, ['size']);

  return (
    <Image as='span' {...others} class={cx(avatar(variants), others.class)} />
  );
}

type AvatarImageProps<T extends ValidComponent> = ComponentProps<T> &
  AvatarVariants &
  ImageImgProps;

function AvatarImage<T extends ValidComponent = 'img'>(
  props: PolymorphicProps<T, AvatarImageProps<T>>
) {
  const [variants, others] = splitProps(props as AvatarImageProps<T>, ['size']);

  return (
    <Image.Img
      as='img'
      draggable={false}
      {...others}
      class={cx(avatar(variants), others.class)}
    />
  );
}

type AvatarFallbackProps = {
  children: string | ValidComponent;
  button?: boolean;
  checked?: boolean;
} & AvatarVariants;

const AvatarFallback: Component<AvatarFallbackProps> = (props) => (
  <Image.Fallback
    class={fallback({
      size: props.size,
      button: props.button,
      checked: props.checked,
    })}
  >
    <Show
      when={typeof props.children === 'string'}
      fallback={
        <Dynamic
          component={(props.children as ValidComponent) ?? UserCircleFill}
          class={icon({ size: props.size })}
        />
      }
    >
      <div>{props.children as string}</div>
    </Show>
  </Image.Fallback>
);

type AvatarSharedProps<T extends ValidComponent = 'span'> = {
  as?: T;
  size?: 'large' | 'small';
  checked?: boolean;
  fallback?: string | ValidComponent;
  button?: boolean;
} & ComponentProps<T>;

type PolymorphicAvatarProps<T extends ValidComponent = 'span'> =
  AvatarSharedProps<T> & {
    src?: string;
  };

function PolymorphicAvatar<T extends ValidComponent = 'span'>(
  props: PolymorphicProps<T, PolymorphicAvatarProps<T>>
) {
  const [local, variants, others] = splitProps(
    props,
    ['fallback', 'src', 'button', 'checked'],
    ['size']
  );

  return (
    <AvatarRoot {...variants} {...others}>
      <AvatarImage
        {...variants}
        src={local.src}
        class={props.button ? buttonImage({ checked: local.checked }) : ''}
      />
      <AvatarFallback
        children={local.fallback ?? UserCircleFill}
        button={local.button}
        checked={local.checked}
        {...variants}
      />
    </AvatarRoot>
  );
}

const Export_AvatarImg: Component<Omit<PolymorphicAvatarProps, 'button'>> = (
  props
) => <PolymorphicAvatar as='span' {...props} />;

function Export_AvatarButton<T extends ValidComponent = typeof Button>(
  props: { button?: boolean } & PolymorphicAvatarProps<T>
) {
  return <PolymorphicAvatar as={Button} button={true} {...props} />;
}

const Avatar = Object.assign(PolymorphicAvatar, {
  Img: Export_AvatarImg,
  Button: Export_AvatarButton,
});

export default Avatar;
