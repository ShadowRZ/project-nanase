import type { Meta, StoryObj } from 'storybook-solidjs';
import CStateMessageShell from './StateMessageShell';

const meta: Meta<typeof CStateMessageShell> = {
  component: CStateMessageShell,
  tags: ['autodocs'],
  render: (props) => (
    <CStateMessageShell {...props}>did something.</CStateMessageShell>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StateMessageShell: Story = {
  args: {
    avatar: '',
    name: 'Alice',
    userId: '@alice:example.org',
    timestamp: 1_700_000_000_000,
  },
};
