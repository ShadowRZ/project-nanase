import { Show, type ParentComponent } from 'solid-js';
import Box from '~/app/atoms/box/Box';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Checks from '~icons/ph/checks';

type TextMessageProps = {
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent' | 'read';
};

const TextMessage: ParentComponent<TextMessageProps> = (props) => {
  return (
    <Box
      color={props.color ?? 'default'}
      class='w-fit relative'
      classList={{
        'opacity-50': props.status === 'sending',
      }}
    >
      {props.children}
      <Text
        as='span'
        size='smaller'
        class='ml-2 float-right w-fit inline-flex flex-row gap-0.5 items-center translate-y-3'
      >
        <Show
          when={props.status === 'read'}
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
