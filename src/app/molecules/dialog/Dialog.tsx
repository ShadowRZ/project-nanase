import {
  CloseButton,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
  type DialogContentProps,
  type DialogDescriptionProps,
  type DialogTitleProps,
} from '@kobalte/core/dialog';
import { type PolymorphicProps } from '@kobalte/core/polymorphic';
import { Show, type JSX, type ValidComponent } from 'solid-js';
import IconButton from '~/app/atoms/icon-button/IconButton';
import { css, cx } from '~styled/css';
import { Flex, styled } from '~styled/jsx';
import { flex } from '~styled/patterns';
import XIcon from '~icons/ph/x';

const StyledPositioner = styled('div', {
  base: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1rem',
  },
});

const DialogOverlay = styled(Overlay, {
  base: {
    zIndex: 50,
    position: 'fixed',
    inset: 0,
    backgroundColor: 'black/25',
    animationName: 'overlayClose',
    animationDuration: '150ms',
    animationTimingFunction: 'ease-in',
    _expanded: {
      animationName: 'overlayOpen',
      animationDuration: '200ms',
      animationTimingFunction: 'ease-out',
    },
  },
});

function DialogContent<T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, DialogContentProps<T>>
) {
  return (
    <StyledPositioner>
      <Content
        {...props}
        class={cx(
          css({
            bg: 'white',
            display: 'flex',
            flexDirection: 'column',
            padding: '4',
            maxHeight: 'full',
            overflow: 'hidden',
            rounded: 'lg',
            animationName: 'dialogClose',
            animationDuration: '150ms',
            animationTimingFunction: 'ease-in',
            _expanded: {
              animationName: 'dialogOpen',
              animationDuration: '200ms',
              animationTimingFunction: 'ease-out',
            },
            _dark: {
              bg: 'black',
            },
          }),
          props.class
        )}
      />
    </StyledPositioner>
  );
}

function DialogTitle<T extends ValidComponent = 'h2'>(
  props: PolymorphicProps<T, DialogTitleProps>
) {
  return (
    <Title {...props} class={cx(css({ fontWeight: 'bold' }), props.class)} />
  );
}

function DialogDescription<T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, DialogDescriptionProps>
) {
  return (
    <Description
      {...props}
      class={cx(css({ color: 'mauve.11' }), props.class)}
    />
  );
}

type DialogStyledHeaderProps = {
  title?: JSX.Element;
  description?: JSX.Element;
  closeButton?: boolean;
};

function DialogStyledHeader(props: DialogStyledHeaderProps) {
  return (
    <Flex direction='row' alignItems='center' gap='2' mb='2'>
      <span class={flex({ direction: 'column', flexGrow: '1' })}>
        <Dialog.Title>{props.title}</Dialog.Title>
        <Show when={props.description}>
          <Dialog.Description>{props.description}</Dialog.Description>
        </Show>
      </span>
      <Show when={props.closeButton}>
        <IconButton as={CloseButton} type='normal' icon={XIcon} />
      </Show>
    </Flex>
  );
}

const PublicObject = Root;

const Dialog = Object.assign(PublicObject, {
  Content: DialogContent,
  Overlay: DialogOverlay,
  Trigger,
  Portal,
  CloseButton,
  Title: DialogTitle,
  Description: DialogDescription,
  StyledHeader: DialogStyledHeader,
});

export default Dialog;
