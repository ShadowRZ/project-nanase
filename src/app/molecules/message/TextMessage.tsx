import { Show, type ParentComponent } from 'solid-js';
import Box from '~/app/atoms/box/Box';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Checks from '~icons/ph/checks';

type TextMessageProps = {
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
};

const TextMessage: ParentComponent<TextMessageProps> = (props) => {
  return (
    <Box
      color={props.color ?? 'default'}
      class='w-fit relative flex flex-row'
      classList={{
        'opacity-50': props.status === 'sending',
      }}
    >
      <div>{props.children}</div>
      <Text
        as='div'
        size='smaller'
        class='ml-2 inline-flex flex-row gap-0.5 items-end justify-center translate-y-1'
      >
        <Show
          when={props.read ?? false}
          fallback={<div class='invisible h-4' />}
        >
          <Checks class='size-4' />
        </Show>
        <Time timestamp={props.timestamp} />
      </Text>
    </Box>
  );
};

export default TextMessage;
