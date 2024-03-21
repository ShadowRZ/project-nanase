import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CConfirmDialog from './ConfirmDialog';

const meta: Meta<typeof CConfirmDialog> = {
  component: CConfirmDialog,
  tags: ['autodocs'],
  render: (props) => (
    <div class='size-full'>
      <CConfirmDialog {...props} />
    </div>
  ),
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
    open: true,
    type: 'normal',
    confirm: 'Confirm',
    cancel: 'Cancel',
  },
};
