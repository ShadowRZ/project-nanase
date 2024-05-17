import { Show, splitProps, type ParentComponent } from 'solid-js';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';

type ImageBoxProps = {
  src?: string;
  width: number;
  height: number;
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
};

const ImageMessage: ParentComponent<ImageBoxProps> = (props) => {
  const [image] = splitProps(props, ['src', 'width', 'height']);
  return (
    <div
      class='relative w-fit'
      classList={{
        'opacity-50': props.status === 'sending',
      }}
    >
      {props.children ?? <img {...image} class='rounded-lg' />}
      <Text
        as='span'
        size='smaller'
        class='box-content text-white px-1 absolute bottom-0 right-0 inline-flex flex-row gap-0.5 items-center bg-black/50 rounded-ee-lg'
      >
        <Show
          when={props.edited ?? false}
          fallback={<div class='invisible h-4' />}
        >
          <PencilSimpleLine class='size-4' />
        </Show>
        <Show when={props.read ?? false}>
          <Checks class='size-4' />
        </Show>
        <Time timestamp={props.timestamp} />
      </Text>
    </div>
  );
};

export default ImageMessage;
