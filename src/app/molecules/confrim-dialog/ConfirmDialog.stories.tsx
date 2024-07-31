import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import { createSignal } from 'solid-js';
import CConfirmDialog from './ConfirmDialog';
import Button from '~/app/atoms/button/Button';
import { css } from '~styled/css';

const meta: Meta<typeof CConfirmDialog> = {
  component: CConfirmDialog,
  tags: ['autodocs'],
  render(props: any) {
    const [open, setOpen] = createSignal(false);

    return (
      <div class={css({ width: 'full', height: 'full' })}>
        <Button color='secondary' size='medium' onClick={() => setOpen(true)}>
          Show Dialog
        </Button>
        <CConfirmDialog {...props} open={open()} />
      </div>
    );
  },
  argTypes: {
    type: { control: 'radio', options: ['normal', 'danger'] },
  },
  args: {
    onOpenChange: fn(),
    onConfirm: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmDialog: Story = {
  args: {
    title: 'Deactive Account',
    description:
      'Proceed to deactivate your account? All of your data will be permanently removed. This action cannot be undone.',
    type: 'normal',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
};
