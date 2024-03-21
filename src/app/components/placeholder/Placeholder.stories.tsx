import type { Meta, StoryObj } from 'storybook-solidjs';
import CPlaceholder from './Placeholder';

const meta: Meta<typeof CPlaceholder> = {
  component: CPlaceholder,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {};
