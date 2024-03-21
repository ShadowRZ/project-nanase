import type { Meta, StoryObj } from 'storybook-solidjs';
import ImageButton from './ImageButton';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';

const meta: Meta<typeof ImageButton> = {
  component: ImageButton,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'large'] },
  },
  render: (props) => <ImageButton {...props} icon={UserCircleDuotone} />,
};

export default meta;
type Story = StoryObj<typeof ImageButton>;

export const Large: Story = {
  args: {
    size: 'large',
    src: '',
    checked: false,
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    src: '',
    checked: false,
  },
};
