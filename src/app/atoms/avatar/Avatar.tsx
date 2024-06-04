import { type Component, Show } from 'solid-js';
import { Image } from '@kobalte/core/image';
import { Dynamic } from 'solid-js/web';
import {
  avatar,
  avatarFallback,
  avatarImage,
  fallbackIcon,
} from './Avatar.css';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';

type AvatarProps = {
  src?: string;
  size: 'large' | 'small';
  outlined?: boolean;
  icon?: Component;
};

const Avatar: Component<AvatarProps> = (props) => {
  return (
    <Image
      class={avatar({
        size: props.size,
      })}
    >
      <Image.Img
        draggable={false}
        class={avatarImage({
          outlined: props.outlined,
          size: props.size,
        })}
        src={props.src}
      />
      <Image.Fallback
        class={avatarFallback({
          size: props.size,
        })}
      >
        <Dynamic
          component={props.icon ?? UserCircleDuotone}
          class={fallbackIcon({
            size: props.size,
          })}
        />
      </Image.Fallback>
    </Image>
  );
};

export default Avatar;
