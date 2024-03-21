import type { Meta, StoryObj } from 'storybook-solidjs';
import { Tooltip } from '@kobalte/core';
import CTooltipContent from './TooltipContent';

const meta: Meta<typeof CTooltipContent> = {
  component: CTooltipContent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CTooltipContent>;

export const TooltipContent: Story = {
  render: () => (
    <>
      <CTooltipContent class='w-fit'>Hello, I'm the tooltip!</CTooltipContent>
      <Tooltip.Root placement='bottom' openDelay={0} closeDelay={0}>
        <Tooltip.Trigger class='px-2 py-1 bg-slate-200 rounded-md'>
          Trigger
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content as={CTooltipContent}>
            Hello, I'm the tooltip!
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </>
  ),
};
