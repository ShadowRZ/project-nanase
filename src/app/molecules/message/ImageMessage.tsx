import { Show, splitProps, type ParentComponent } from 'solid-js';
import Time from '~/app/atoms/time/Time';
import { styled } from '~styled/jsx';
import { css } from '~styled/css';
import { square } from '~styled/patterns';
import Checks from '~icons/ph/checks';
import PencilSimpleLine from '~icons/ph/pencil-simple-line';

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

type ImageBoxProps = {
  src?: string;
  width: number;
  height: number;
  timestamp: number;
  color?: 'primary' | 'default';
  status: 'sending' | 'sent';
  read?: boolean;
  edited?: boolean;
};

const ImageMessage: ParentComponent<ImageBoxProps> = (props) => {
  const [image] = splitProps(props, ['src', 'width', 'height']);
  return (
    <Root status={props.status}>
      {props.children ?? <img {...image} class={css({ rounded: 'lg' })} />}
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

export default ImageMessage;
