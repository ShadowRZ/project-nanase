import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CRoomBeginning from './RoomBeginning';

const meta: Meta<typeof CRoomBeginning> = {
  component: CRoomBeginning,
  tags: ['autodocs'],
  render: (props) => (
    <div class='size-full'>
      <CRoomBeginning {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RoomBeginning: Story = {};
