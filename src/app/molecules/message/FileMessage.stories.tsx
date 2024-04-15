import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import CFileMessage from './FileMessage';

const meta: Meta<typeof CFileMessage> = {
  component: CFileMessage,
  tags: ['autodocs'],
  args: {
    read: false,
    download: false,
    filename: 'file.bin',
    mime: 'application/octet-stream',
    onClick: fn(),
  },
  argTypes: {
    color: {
      control: 'radio',
      options: ['default', 'primary'],
    },
    status: {
      control: 'radio',
      options: ['sending', 'sent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const FileMessage: Story = {
  args: {
    timestamp: 1_700_000_000_000,
    color: 'default',
    status: 'sent',
  },
};

export const PrimaryFileMessage: Story = {
  args: {
    timestamp: 1_700_000_000_000,
    color: 'primary',
    status: 'sent',
  },
};
