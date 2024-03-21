import type { Meta, StoryObj } from 'storybook-solidjs';
import Box from './Box';

const meta: Meta<typeof Box> = {
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    color: { control: 'radio', options: ['default', 'primary'] },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBox: Story = {
  render: (props) => <Box {...props}>Long text Long text Long text</Box>,
  args: {
    text: 'default',
    color: 'default',
  },
};

export const PrimaryBox: Story = {
  render: (props) => <Box {...props}>Long text Long text Long text</Box>,
  args: {
    text: 'default',
    color: 'primary',
  },
};
