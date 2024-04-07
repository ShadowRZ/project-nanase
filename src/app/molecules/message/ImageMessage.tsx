import { splitProps, type Component, Show } from 'solid-js';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Checks from '~icons/ph/checks';

type ImageBoxProps = {
  src?: string;
  width: number;
  height: number;
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
};

const ImageMessage: Component<ImageBoxProps> = (props) => {
  const [image] = splitProps(props, ['src', 'width', 'height']);
  return (
    <div
      class='relative w-fit'
      classList={{
        'opacity-50': props.status === 'sending',
      }}
    >
      <img {...image} class='rounded-lg' />
      <Text
        as='span'
        size='smaller'
        class='box-content text-white px-1 absolute bottom-0 right-0 inline-flex flex-row gap-0.5 items-center bg-black/50 rounded-ee-lg'
      >
        <Show when={props.read ?? false}>
          <Checks class='size-4' />
        </Show>
        <Time timestamp={props.timestamp} />
      </Text>
    </div>
  );
};

export default ImageMessage;
