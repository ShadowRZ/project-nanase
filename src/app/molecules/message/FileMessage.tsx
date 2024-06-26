import { Button } from '@kobalte/core/button';
import { Show, type Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Box from '~/app/atoms/box/Box';
import Time from '~/app/atoms/time/Time';
import { cva } from '~styled/css';
import { Flex, Square, styled } from '~styled/jsx';
import { square } from '~styled/patterns';
import Checks from '~icons/ph/checks';
import FileDuotone from '~icons/ph/file-duotone';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

const button = cva({
  base: {
    width: 'fit',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'initial',
    textAlign: 'start',
  },
  variants: {
    status: {
      sending: {
        opacity: '50',
      },
      sent: {},
    },
  },
});

const IconPlaceholder = styled('div', {
  base: {
    height: '4',
    visibility: 'hidden',
  },
});

type FileMessageProps = {
  timestamp: number;
  filename?: string;
  mime?: string;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
  download?: boolean;
  onClick?: () => void;
};

const FileMessage: Component<FileMessageProps> = (props) => {
  return (
    <Button
      as={Box}
      color={props.color ?? 'default'}
      class={button({ status: props.status })}
      onClick={props.onClick}
    >
      <Flex direction='row' gap='2'>
        <Square
          size='12'
          rounded='full'
          bg={{ base: 'white', _dark: 'black' }}
          display='flex'
          alignItems='center'
          justifyContent='center'
        >
          <Dynamic
            component={props.download ? LoadingIndicator : FileDuotone}
            class={square({
              size: '8',
              color: { base: 'black', _dark: 'white' },
            })}
          />
        </Square>
        <Flex direction='column'>
          <styled.span fontWeight='bold' minW='0' truncate>
            {props.filename ?? '<File>'}
          </styled.span>
          <styled.span opacity='50' minW='0' truncate>
            {props.mime ?? '<Unknown Type>'}
          </styled.span>
        </Flex>
      </Flex>
      <styled.div
        textStyle='xs'
        display='inline-flex'
        ml='2'
        flexDirection='row'
        gap='0.5'
        alignItems='flex-end'
        justifyContent='center'
        translateY='1'
      >
        <Show when={props.edited ?? false} fallback={<IconPlaceholder />}>
          <PencilSimpleLine class={square({ size: 4 })} />
        </Show>
        <Show when={props.read ?? false} fallback={<IconPlaceholder />}>
          <Checks class={square({ size: 4 })} />
        </Show>
        <Time timestamp={props.timestamp} />
      </styled.div>
    </Button>
  );
};

export default FileMessage;
