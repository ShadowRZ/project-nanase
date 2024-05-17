import { Show, type ParentComponent } from 'solid-js';
import Box from '~/app/atoms/box/Box';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';

type TextMessageProps = {
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
  notice?: boolean;
};

const TextMessage: ParentComponent<TextMessageProps> = (props) => {
  return (
    <Box
      color={props.color ?? 'default'}
      class='w-fit relative flex flex-row'
      classList={{
        'opacity-50': props.status === 'sending',
      }}
      style={{
        '--un-prose-links': props.color === 'primary' ? '#bfdbfe' : '#3b82f6',
        '--project-nanase-pills':
          props.color === 'primary' ? '#fecdd3' : '#e11d48',
      }}
    >
      <div
        classList={{
          'opacity-75': props.notice,
        }}
      >
        {props.children}
      </div>
      <Text
        as='div'
        size='smaller'
        class='ml-2 inline-flex flex-row gap-0.5 items-end justify-center translate-y-1'
      >
        <Show
          when={props.edited ?? false}
          fallback={<div class='invisible h-4' />}
        >
          <PencilSimpleLine class='size-4' />
        </Show>
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
