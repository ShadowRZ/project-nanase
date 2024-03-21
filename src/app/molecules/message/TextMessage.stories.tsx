import type { Meta, StoryObj } from 'storybook-solidjs';
import CTextMessage from './TextMessage';

const meta: Meta<typeof CTextMessage> = {
  component: CTextMessage,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'radio',
      options: ['default', 'primary'],
    },
    status: {
      control: 'radio',
      options: ['sending', 'sent', 'read'],
    },
  },
  render: (props) => (
    <CTextMessage {...props}>Message renders here</CTextMessage>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TextMessage: Story = {
  args: {
    timestamp: 1_700_000_000_000,
    color: 'default',
    status: 'sent',
  },
};

export const PrimaryTextMessage: Story = {
  args: {
    timestamp: 1_700_000_000_000,
    color: 'primary',
    status: 'sent',
  },
};
