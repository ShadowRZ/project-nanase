import { Dialog as KDialog } from '@kobalte/core';
import { Show, type ParentComponent, splitProps } from 'solid-js';
import IconButton from '~/app/atoms/button/IconButton';
import Panel from '~/app/atoms/panel/Panel';
import Text from '~/app/atoms/text/Text';
import XIcon from '~icons/ph/x';

type DialogProps = {
  [key: string]: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  contentClass?: string;
};

const Dialog: ParentComponent<DialogProps> = (props) => {
  const [local, others] = splitProps(props, [
    'open',
    'onOpenChange',
    'title',
    'description',
    'children',
    'contentClass',
  ]);
  return (
    <KDialog.Root
      open={local.open}
      onOpenChange={local.onOpenChange}
      {...others}
    >
      <KDialog.Portal>
        <KDialog.Overlay class='z-50 fixed inset-0 bg-black/25 animate-overlay-close ui-expanded:animate-overlay-open' />
        <div class='fixed inset-0 z-50 flex items-center justify-center m-4'>
          <Panel
            style='bordered'
            as={KDialog.Content}
            class={`animate-dialog-close ui-expanded:animate-dialog-open p-4 max-h-full overflow-hidden flex flex-col ${local.contentClass}`}
          >
            <div class='flex flex-row gap-2 items-center mb-2'>
              <span class='flex flex-col grow'>
                <Text as={KDialog.Title} font='bold'>
                  {local.title}
                </Text>
                <Show when={local.description}>
                  <Text class='text-slate-500' as={KDialog.Description}>
                    {local.description}
                  </Text>
                </Show>
              </span>
              <IconButton as={KDialog.CloseButton} type='normal' icon={XIcon} />
            </div>
            {local.children}
          </Panel>
        </div>
      </KDialog.Portal>
    </KDialog.Root>
  );
};

export default Dialog;
