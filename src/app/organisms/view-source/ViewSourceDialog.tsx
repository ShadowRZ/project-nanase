import { type MatrixEvent } from 'matrix-js-sdk';
import { createMemo, type Component } from 'solid-js';
import HighlightCode from '~/app/components/highlight/HighlightCode';
import t from '~/app/i18n';
import Dialog from '~/app/molecules/dialog/Dialog';
import { css } from '~styled/css';
import { Flex, styled } from '~styled/jsx';

export type ViewSourceDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  event: MatrixEvent;
};

const ViewSourceDialog: Component<ViewSourceDialogProps> = (props) => {
  const event = () => props.event;
  const content = createMemo(() => JSON.stringify(event().event, null, 2));

  return (
    <Dialog modal open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content class={css({ width: '100%', maxWidth: '56rem' })}>
          <Dialog.StyledHeader title={t('view_source')} closeButton />
          <Flex direction='column'>
            <span>
              Event ID:{' '}
              <styled.span fontFamily='mono'>{event().getId()}</styled.span>
            </span>
            <span>
              Room ID:{' '}
              <styled.span fontFamily='mono'>{event().getRoomId()}</styled.span>
            </span>
            <span>
              Sender:{' '}
              <styled.span fontFamily='mono'>
                {event().getSender() ?? '<Unknown>'}
              </styled.span>
            </span>
          </Flex>
          <styled.pre
            css={{
              fontFamily: 'mono',
              minWidth: 0,
              minHeight: 0,
              maxWidth: '56rem',
              flexShrink: 1,
              borderRadius: '0.5rem',
              borderWidth: '1px',
              borderColor: 'mauve.7',
            }}
          >
            <HighlightCode lang='json'>{content()}</HighlightCode>
          </styled.pre>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default ViewSourceDialog;
