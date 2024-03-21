import type { Meta, StoryObj } from 'storybook-solidjs';
import CRoomItem from './RoomItem';

const meta: Meta<typeof CRoomItem> = {
  component: CRoomItem,
  tags: ['autodocs'],
  render: (props) => (
    <div class='w-96 '>
      <CRoomItem {...props} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RoomItem: Story = {
  args: {
    current: false,
    name: 'Demo',
    roomId: '!xxxxxxx:example.org',
    avatar: '',
    lastTs: 1_700_000_000_000,
    unread: 0,
    lastSender: '',
    lastContent: '',
    direct: false,
  },
};
