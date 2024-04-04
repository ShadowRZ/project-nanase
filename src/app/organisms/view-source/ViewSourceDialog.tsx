import { type MatrixEvent } from 'matrix-js-sdk';
import { type Component, createMemo } from 'solid-js';
import HighlightCode from '~/app/components/highlight/HighlightCode';
import t from '~/app/i18n';
import Dialog from '~/app/molecules/dialog/Dialog';

export type ViewSourceDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  event: MatrixEvent;
};

const ViewSourceDialog: Component<ViewSourceDialogProps> = (props) => {
  const event = () => props.event;
  const content = createMemo(() => JSON.stringify(event().event, null, 2));

  return (
    <Dialog
      title={t('view_source')}
      modal
      open={props.open}
      onOpenChange={props.onOpenChange}
      contentClass='w-full max-w-4xl'
    >
      <div class='flex flex-col'>
        <span>
          Event ID: <span class='font-mono'>{event().getId()}</span>
        </span>
        <span>
          Room ID: <span class='font-mono'>{event().getRoomId()}</span>
        </span>
        <span>
          Sender:{' '}
          <span class='font-mono'>{event().getSender() ?? '<Unknown>'}</span>
        </span>
      </div>
      <HighlightCode
        lang='json'
        class='min-w-0 min-h-0 max-w-4xl shrink font-mono rounded-lg border border-slate-200 dark:border-slate-800'
      >
        {content()}
      </HighlightCode>
    </Dialog>
  );
};

export default ViewSourceDialog;
