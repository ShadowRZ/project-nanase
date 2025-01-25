import { Button } from '@hanekokoro-ui/solid';
import { Show, type Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Checks from '~icons/ph/checks';
import FileDuotone from '~icons/ph/file-duotone';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { Flex, Square, styled } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import { Time } from '../../time/Time';

const IconPlaceholder = styled('div', {
  base: {
    height: '4',
    visibility: 'hidden',
  },
});

type FileContentProps = {
  timestamp: number;
  filename?: string;
  mime?: string;
  primary?: boolean;
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
  download?: boolean;
  onClick?: () => void;
};

export const FileContent: Component<FileContentProps> = (props) => {
  return (
    <Button
      onClick={props.onClick}
      data-project-nanase-primary={props.primary ? '' : undefined}
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
