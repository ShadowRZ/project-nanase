import { Typography } from '@hanekokoro-ui/solid';
import { Show, type ParentComponent } from 'solid-js';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';
import { css } from '@hanekokoro-ui/styled-system/css';
import { styled } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import { Time } from '../../time/Time';

type TextContentProps = {
  timestamp: number;
  status: 'sending' | 'sent';
  primary?: boolean;
  read?: boolean;
  edited?: boolean;
  notice?: boolean;
};

const Root = styled('div', {
  base: {
    rounded: 'lg',
    padding: '2',
    maxW: '40rem',
    width: 'fit-content',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'gray.dimmed',
  },
  variants: {
    status: {
      sending: {
        opacity: '50',
      },
      sent: {},
    },
    primary: {
      true: {
        backgroundColor: 'accent.dimmed',
      },
    },
  },
});

export const TextContent: ParentComponent<TextContentProps> = (props) => {
  return (
    <Root primary={props.primary} status={props.status}>
      <Typography minW='0'>{props.children}</Typography>
      <styled.div
        textStyle='xs'
        ml='2'
        display='inline-flex'
        flexDirection='row'
        gap='0.5'
        alignItems='end'
        justifyContent='center'
        translateY='1'
      >
        <Show
          when={props.edited ?? false}
          fallback={<div class={css({ visibility: 'hidden', height: '4' })} />}
        >
          <PencilSimpleLine class={square({ size: 4 })} />
        </Show>
        <Show when={props.read ?? false}>
          <Checks class={square({ size: 4 })} />
        </Show>
        <Time timestamp={props.timestamp} />
      </styled.div>
    </Root>
  );
};
