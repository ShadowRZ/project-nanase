import { type Component, Show, type ParentComponent } from 'solid-js';
import { Button } from '@kobalte/core';
import Box from '~/app/atoms/box/Box';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';
import FileDuotone from '~icons/ph/file-duotone';

type FileMessageProps = {
  timestamp: number;
  filename: string;
  mime: string;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
  onClick?: () => void;
};

const FileMessage: Component<FileMessageProps> = (props) => {
  return (
    <Box
      as={Button.Root}
      color={props.color ?? 'default'}
      class='w-fit relative flex flex-row items-initial text-start'
      classList={{
        'opacity-50': props.status === 'sending',
      }}
      onClick={props.onClick}
    >
      <div class='flex flex-row gap-2'>
        <div class='size-12 rounded-full bg-white dark:bg-black flex items-center justify-center'>
          <FileDuotone class='size-8 text-black dark:text-white' />
        </div>
        <div class='flex flex-col'>
          <Text as='span' font='bold' content='truncate'>
            {props.filename}
          </Text>
          <Text as='span' class='opacity-50' content='truncate'>
            {props.mime}
          </Text>
        </div>
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

export default FileMessage;
