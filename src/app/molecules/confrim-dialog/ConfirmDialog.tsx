import { AlertDialog } from '@kobalte/core';
import { type Component, Show, splitProps } from 'solid-js';
import Button from '~/app/atoms/button/Button';
import Panel from '~/app/atoms/panel/Panel';
import Text from '~/app/atoms/text/Text';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description?: string;
  confirm: string;
  cancel: string;
  type: 'normal' | 'danger';
};

const ConfrimDialog: Component<DialogProps> = (props) => {
  const [local, others] = splitProps(props, [
    'open',
    'onOpenChange',
    'title',
    'description',
    'confirm',
    'cancel',
    'type',
    'onConfirm',
    'onCancel',
  ]);
  return (
    <AlertDialog.Root
      open={local.open}
      onOpenChange={local.onOpenChange}
      modal
      preventScroll
      {...others}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay class='z-50 fixed inset-0 bg-black/25 animate-overlay-close ui-expanded:animate-overlay-open' />
        <div class='fixed inset-0 z-50 flex items-center justify-center m-4'>
          <Panel
            decoration='bordered'
            as={AlertDialog.Content}
            class='animate-dialog-close ui-expanded:animate-dialog-open p-4 max-w-md w-full max-h-full'
            onOpenAutoFocus={(ev: Event) => {
              ev.preventDefault();
            }}
          >
            <div class='flex flex-row gap-2 items-center mb-4'>
              <span class='flex flex-col grow'>
                <Text as={AlertDialog.Title} font='bold'>
                  {local.title}
                </Text>
                <Show when={local.description}>
                  <Text class='text-slate-500' as={AlertDialog.Description}>
                    {local.description}
                  </Text>
                </Show>
              </span>
            </div>
            <div class='flex flex-row justify-end gap-2'>
              <Button
                onClick={local.onConfirm}
                size='small'
                aria-label={local.confirm}
                color={local.type === 'danger' ? 'danger' : 'primary'}
                autofocus={false}
              >
                {local.confirm}
              </Button>
              <Button
                onClick={local.onCancel}
                size='small'
                aria-label={local.cancel}
                color='secondary'
                autofocus
              >
                {local.cancel}
              </Button>
            </div>
          </Panel>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default ConfrimDialog;
