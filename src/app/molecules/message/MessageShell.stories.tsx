import type { Meta, StoryObj } from 'storybook-solidjs';
import CMessageShell from './MessageShell';
import Box from '~/app/atoms/box/Box';

const meta: Meta<typeof CMessageShell> = {
  component: CMessageShell,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MessageShell: Story = {
  args: {
    avatar: '',
    name: 'Alice',
    userId: '@alice:example.org',
  },
  render: (props) => (
    // @ts-expect-error Props are from Storybook
    <CMessageShell {...props}>Message renders here</CMessageShell>
  ),
};

export const BoxedMessageShell: Story = {
  args: {
    avatar: '',
    name: 'Alice',
    userId: '@alice:example.org',
  },
  render: (props) => (
    // @ts-expect-error Props are from Storybook
    <CMessageShell {...props}>
      <Box color='default'>Message renders here</Box>
    </CMessageShell>
  ),
};

export const BoxedPrimaryMessageShell: Story = {
  args: {
    avatar: '',
    name: 'Alice',
    userId: '@alice:example.org',
  },
  render: (props) => (
    // @ts-expect-error Props are from Storybook
    <CMessageShell {...props}>
      <Box color='primary'>Message renders here</Box>
    </CMessageShell>
  ),
};
