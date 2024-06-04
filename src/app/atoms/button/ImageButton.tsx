import {
  type Component,
  Show,
  type ValidComponent,
  splitProps,
} from 'solid-js';
import { Image } from '@kobalte/core/image';
import { Dynamic } from 'solid-js/web';

type ImageButtonProps = {
  [key: string]: any;
  as?: ValidComponent;
  src?: string;
  size: 'large' | 'small';
  checked?: boolean;
  icon: ValidComponent;
};

const ImageButton: Component<ImageButtonProps> = (props) => {
  const [local, others] = splitProps(props, [
    'as',
    'checked',
    'src',
    'icon',
    'size',
  ]);

  return (
    <Image
      as={local.as ?? 'button'}
      class='rounded-full bg-transparent shrink-0 overflow-clip outline-none group'
      classList={{
        'size-12': local.size === 'large',
        'size-6': local.size === 'small',
      }}
      {...others}
    >
      <Show when={local.src !== undefined}>
        <Image.Img
          draggable={false}
          class='transition duration-150 rounded-full overflow-clip outline outline-2 -outline-offset-2 group-focus:outline-rose-500'
          src={local.src}
          classList={{
            'outline-rose-500/50': !local.checked,
            'outline-rose-500': local.checked,
            'size-12': local.size === 'large',
            'size-6': local.size === 'small',
          }}
        />
      </Show>
      <Image.Fallback
        class='transition duration-150 flex items-center justify-center text-rose-500 rounded-full border-2 group-focus:border-rose-500'
        classList={{
          'size-12': local.size === 'large',
          'size-6': local.size === 'small',
          'border-rose-500/50': !local.checked,
          'border-rose-500': local.checked,
        }}
      >
        <Dynamic
          component={local.icon}
          classList={{
            'size-8': local.size === 'large',
            'size-4': local.size === 'small',
          }}
        />
      </Image.Fallback>
    </Image>
  );
};

export default ImageButton;
