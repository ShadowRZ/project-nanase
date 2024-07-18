import type { Meta, StoryObj } from 'storybook-solidjs';
import Panel from './Panel';
import { css } from '~styled/css';

const meta: Meta<typeof Panel> = {
  component: Panel,
  tags: ['autodocs'],
  argTypes: {
    decoration: {
      control: 'radio',
      options: ['bordered', 'shadowed'],
    },
  },
  render: (props) => (
    <Panel {...props} class={css({ p: '2' })}>
      This is a example panel
    </Panel>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BorderedPanel: Story = {
  args: {
    decoration: 'bordered',
  },
};

export const ShadowPanel: Story = {
  args: {
    decoration: 'shadowed',
  },
};
