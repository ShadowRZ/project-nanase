import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CDialog from './Dialog';

const meta: Meta<typeof CDialog> = {
  component: CDialog,
  tags: ['autodocs'],
  render: (props) => (
    <div style={{ width: '100%', height: '100%' }}>
      <CDialog open {...props}>
        <CDialog.Overlay />
        <CDialog.Content>
          <CDialog.StyledHeader
            title='Dialog Title'
            description='Dialog Description'
            closeButton
          />
          <div>This is dialog content. Hello World!</div>
        </CDialog.Content>
      </CDialog>
    </div>
  ),
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {};
