import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CDialog from './Dialog';

const meta: Meta<typeof CDialog> = {
  component: CDialog,
  tags: ['autodocs'],
  render: (props) => (
    <div class='size-full'>
      <CDialog {...props}>This is dialog content. Hello World!</CDialog>
    </div>
  ),
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {
  args: {
    title: 'Dialog',
    description: 'Example Description',
    open: true,
  },
};
