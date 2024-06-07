import {
  type Component,
  Show,
  type ValidComponent,
  splitProps,
} from 'solid-js';
import { Image } from '@kobalte/core/image';
import { Dynamic } from 'solid-js/web';
import { fallback, fallbackIcon, image, imageButton } from './ImageButton.css';

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
      class={imageButton({ size: local.size })}
      {...others}
    >
      <Show when={local.src !== undefined}>
        <Image.Img
          draggable={false}
          class={image({
            size: local.size,
            checked: local.checked,
          })}
          src={local.src}
        />
      </Show>
      <Image.Fallback
        class={fallback({ checked: local.checked, size: local.size })}
      >
        <Dynamic
          component={local.icon}
          class={fallbackIcon({ size: local.size })}
        />
      </Image.Fallback>
    </Image>
  );
};

export default ImageButton;
