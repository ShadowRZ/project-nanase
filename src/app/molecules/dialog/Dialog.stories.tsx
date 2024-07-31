import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import { createSignal } from 'solid-js';
import CDialog from './Dialog';
import Button from '~/app/atoms/button/Button';
import { css } from '~styled/css';

const meta: Meta<typeof CDialog> = {
  component: CDialog,
  tags: ['autodocs'],
  render(props: any) {
    const [open, setOpen] = createSignal(false);

    return (
      <div class={css({ width: 'full', height: 'full' })}>
        <Button color='secondary' size='medium' onClick={() => setOpen(true)}>
          Show Dialog
        </Button>
        <CDialog open={open()} {...props}>
          <CDialog.Overlay />
          <CDialog.Content>
            <CDialog.StyledHeader
              title='Dialog Title'
              description='Dialog Description'
              closeButton
            />
            <div>This is dialog content. Hello World!</div>
          </CDialog.Content>
        </CDialog>
      </div>
    );
  },
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Dialog: Story = {};
