import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CRoomIntro from './RoomIntro';

const meta: Meta<typeof CRoomIntro> = {
  component: CRoomIntro,
  tags: ['autodocs'],
  args: {
    onBack: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RoomIntro: Story = {
  args: {
    name: 'Demo',
    topic: '',
    avatar: '',
    direct: false,
  },
};
