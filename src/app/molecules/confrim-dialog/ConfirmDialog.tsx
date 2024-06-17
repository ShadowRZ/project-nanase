import { CloseButton } from '@kobalte/core/alert-dialog';
import { type ParentComponent, splitProps, type JSX, Show } from 'solid-js';
import Button from '~/app/atoms/button/Button';
import AlertDialog from '~/app/molecules/dialog/AlertDialog';
import { Flex } from '~styled/jsx';

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title: JSX.Element;
  description?: JSX.Element;
  confirm: string;
  cancel: string;
  type: 'normal' | 'danger';
};

const ConfrimDialog: ParentComponent<ConfirmDialogProps> = (props) => {
  const [local, header, others] = splitProps(
    props,
    [
      'open',
      'onOpenChange',
      'confirm',
      'cancel',
      'type',
      'onConfirm',
      'onCancel',
      'children',
    ],
    ['title', 'description']
  );
  return (
    <AlertDialog
      open={local.open}
      onOpenChange={local.onOpenChange}
      modal
      preventScroll
      {...others}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.StyledHeader {...header} />
          <Show when={local.children}>{local.children}</Show>
          <Flex direction='row' justify='end' gap='2'>
            <CloseButton
              as={Button}
              onClick={local.onCancel}
              size='small'
              aria-label={local.cancel}
              color='secondary'
            >
              {local.cancel}
            </CloseButton>
            <Button
              onClick={local.onConfirm}
              size='small'
              aria-label={local.confirm}
              color={local.type === 'danger' ? 'danger' : 'primary'}
              autofocus={false}
            >
              {local.confirm}
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};

export default ConfrimDialog;
