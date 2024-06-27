import type { Meta, StoryObj } from 'storybook-solidjs';
import IconButton from './IconButton';
import UserCircleFill from '~icons/ph/user-circle-fill';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'radio',
      options: ['large-bordered', 'small-bordered', 'normal', 'circle'],
    },
  },
  render: (props) => <IconButton {...props} icon={UserCircleFill} />,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LargeBordered: Story = {
  args: {
    type: 'large-bordered',
    checked: false,
  },
};

export const SmallBordered: Story = {
  args: {
    type: 'small-bordered',
    checked: false,
  },
};

export const Normal: Story = {
  args: {
    type: 'normal',
  },
};

export const Circle: Story = {
  args: {
    type: 'circle',
  },
};
