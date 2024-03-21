// @unocss-ignore
import type { Meta, StoryObj } from 'storybook-solidjs';
import Text from './Text';

const meta: Meta<typeof Text> = {
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['large', 'medium', 'small', 'smaller', 'default'],
    },
    font: {
      control: 'radio',
      options: ['bold', 'italic', 'default'],
    },
    content: {
      control: 'radio',
      options: ['truncate', 'default'],
    },
    color: {
      control: 'radio',
      options: ['default', 'warning', 'error'],
    },
  },
  render: (props) => <Text {...props}>Content</Text>,
};

export default meta;
type Story = StoryObj<typeof Text>;

export const LargeText: Story = {
  args: {
    size: 'large',
  },
};

export const LargeBoldText: Story = {
  args: {
    size: 'large',
    font: 'bold',
  },
};

export const MediumText: Story = {
  args: {
    size: 'medium',
  },
};

export const NormalText: Story = {};

export const SmallText: Story = {
  args: {
    size: 'small',
  },
};

export const SmallerText: Story = {
  args: {
    size: 'smaller',
  },
};

export const Truncated: Story = {
  render: (props) => (
    <Text {...props} style={{ width: '256px' }}>
      Long text Long text Long text Long text Long text Long text Long text Long
      text Long text Long text Long text Long text Long text Long text Long text
      Long text Long text Long text Long text Long text Long text Long text Long
      text Long text Long text Long text Long text Long text Long text Long text
    </Text>
  ),
  args: {
    content: 'truncate',
  },
};

export const WarningText: Story = {
  args: {
    color: 'warning',
  },
};

export const ErrorText: Story = {
  args: {
    color: 'error',
  },
};
