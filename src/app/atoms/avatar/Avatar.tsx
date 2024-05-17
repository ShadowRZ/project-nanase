import { type Component, Show } from 'solid-js';
import { Image } from '@kobalte/core/image';
import { Dynamic } from 'solid-js/web';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';

type AvatarProps = {
  src?: string;
  size: 'large' | 'small';
  outlined?: boolean;
  icon?: Component;
  smallIcon?: boolean;
};

const Avatar: Component<AvatarProps> = (props) => {
  return (
    <Image
      class='block shrink-0'
      classList={{
        'size-12': props.size === 'large',
        'size-6': props.size === 'small',
      }}
    >
      <Show when={props.src !== undefined}>
        <Image.Img
          draggable={false}
          class='rounded-full overflow-clip'
          src={props.src}
          classList={{
            'outline outline-2 -outline-offset-2 outline-rose-500/50':
              props.outlined,
            'size-12': props.size === 'large',
            'size-6': props.size === 'small',
          }}
        />
      </Show>
      <Image.Fallback
        class='flex items-center justify-center text-rose-500 rounded-full border-2 border-rose-500/50'
        classList={{
          'size-12': props.size === 'large',
          'size-6': props.size === 'small',
        }}
      >
        <Dynamic
          component={props.icon ?? UserCircleDuotone}
          classList={{
            'size-8': props.size === 'large' && !props.smallIcon,
            'size-6': props.size === 'large' && props.smallIcon,
            'size-4': props.size === 'small',
          }}
        />
      </Image.Fallback>
    </Image>
  );
};

export default Avatar;
