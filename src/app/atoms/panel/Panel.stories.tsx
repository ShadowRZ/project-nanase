// @unocss-ignore
import type { Meta, StoryObj } from 'storybook-solidjs';
import Panel from './Panel';

const meta: Meta<typeof Panel> = {
  component: Panel,
  tags: ['autodocs'],
  argTypes: {
    style: {
      control: 'radio',
      options: ['bordered', 'shadow'],
    },
  },
  render: (props) => (
    <Panel {...props} class='p-2'>
      This is a example panel
    </Panel>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BorderedPanel: Story = {
  args: {
    style: 'bordered',
  },
};

export const ShadowPanel: Story = {
  args: {
    style: 'shadow',
  },
};
