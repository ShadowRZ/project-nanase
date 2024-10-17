import { Show, type ParentComponent } from 'solid-js';
import Box from '~/app/atoms/box/Box';
import { Time } from '../../time/Time';
import { css, cva } from '~styled/css';
import { square } from '~styled/patterns';
import { styled } from '~styled/jsx';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';

type TextContentProps = {
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
  notice?: boolean;
};

const root = cva({
  base: {
    width: 'fit-content',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
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

const Wrapper = styled('div', {
  base: {},
  variants: {
    notice: {
      true: {
        opacity: '75',
      },
    },
  },
});

export const TextContent: ParentComponent<TextContentProps> = (props) => {
  return (
    <Box
      color={props.color ?? 'default'}
      class={root({ status: props.status })}
      style={{
        '--un-prose-links': props.color === 'primary' ? '#bfdbfe' : '#3b82f6',
        '--project-nanase-pills':
          props.color === 'primary' ? '#fecdd3' : '#e11d48',
      }}
    >
      <Wrapper notice={props.notice}>{props.children}</Wrapper>
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
    </Box>
  );
};
