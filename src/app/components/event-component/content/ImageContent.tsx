import { Component, Show, splitProps } from 'solid-js';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';
import { css } from '@shadowrz/hanekokoro-ui/styled-system/css';
import { styled } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import { square } from '@shadowrz/hanekokoro-ui/styled-system/patterns';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import { MxcImg } from '../../mxc-img/MxcImg';
import { Time } from '../../time/Time';

const Root = styled('div', {
  base: {
    position: 'relative',
    width: 'fit-content',
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

type ImageContentProps = {
  src: string;
  width: number;
  height: number;
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
};

export const ImageContent: Component<ImageContentProps> = (props) => {
  const mx = useMatrixClient();
  const [image] = splitProps(props, ['src', 'width', 'height']);
  return (
    <Root status={props.status}>
      <MxcImg client={mx()} {...image} rounded='lg' />
      <styled.span
        textStyle='xs'
        boxSizing='content-box'
        bg='black/50'
        color='white'
        px='1'
        position='absolute'
        bottom='0'
        right='0'
        display='inline-flex'
        flexDirection='row'
        gap='0.5'
        alignItems='center'
        roundedEndEnd='lg'
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
      </styled.span>
    </Root>
  );
};
