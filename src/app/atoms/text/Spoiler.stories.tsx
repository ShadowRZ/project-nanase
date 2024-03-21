// @unocss-ignore
import type { Meta, StoryObj } from 'storybook-solidjs';
import CSpoiler from './Spoiler';

const meta: Meta<typeof CSpoiler> = {
  component: CSpoiler,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Spoiler: Story = {
  render: (props) => (
    <CSpoiler {...props}>
      This is something that shouldn't easily opened.
    </CSpoiler>
  ),
};
