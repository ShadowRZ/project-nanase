import type { Meta, StoryObj } from 'storybook-solidjs';
import CRoomReadHeader from './RoomReadHeader';

const meta: Meta<typeof CRoomReadHeader> = {
  component: CRoomReadHeader,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RoomReadHeader: Story = {};
