import { type Component } from 'solid-js';
import t from '~/app/i18n';
import Dialog from '~/app/molecules/dialog/Dialog';

export type ViewSourceDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  content: string;
};

const ViewSourceDialog: Component<ViewSourceDialogProps> = (props) => {
  return (
    <Dialog
      title={t('view_source')}
      modal
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <div class='min-w-0 min-h-0 overflow-y-auto shrink font-mono p-2 rounded-lg bg-gray-100 border border-slate-200 dark:border-slate-800'>
        <pre>
          <code class='text-wrap break-all'>{props.content}</code>
        </pre>
      </div>
    </Dialog>
  );
};

export default ViewSourceDialog;
