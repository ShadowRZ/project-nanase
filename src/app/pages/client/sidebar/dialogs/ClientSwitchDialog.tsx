import { Dialog, IconButton, Tooltip } from '@hanekokoro-ui/solid';
import { HStack } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import { PolymorphicCallbackProps } from '@kobalte/core';
import {
  TooltipTriggerOptions,
  TooltipTriggerRenderProps,
} from '@kobalte/core/tooltip';
import { Component, ComponentProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import UserSwitchDuotone from '~icons/ph/user-switch-duotone';
import CloseIcon from '~icons/ph/x-bold';

export const ClientSwitchDialog: Component = () => {
  return (
    <Dialog.Root>
      <Tooltip.Root placement='top'>
        <Tooltip.Trigger
          as={(
            props: PolymorphicCallbackProps<
              ComponentProps<typeof Dialog.Trigger>,
              TooltipTriggerOptions,
              TooltipTriggerRenderProps
            >
          ) => (
            <Dialog.Trigger
              {...props}
              value='switch'
              colorPalette='orange'
              width='8'
              height='8'
              display='flex'
              alignItems='center'
              justifyContent='center'
              rounded='full'
              _highlighted={{
                bg: 'colorPalette.3',
                ringWidth: '2',
                outlineStyle: 'solid',
              }}
              ringColor='colorPalette.ring'
            />
          )}
        >
          <UserSwitchDuotone
            class={square({
              size: '6',
              color: 'colorPalette.text',
            })}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>Switch Account</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Portal>
        <Dialog.Overlay />
        <Dialog.Positioner>
          <Dialog.Content>
            <HStack>
              <Dialog.Title flexGrow='1' verticalAlign='middle'>
                Switch Account
              </Dialog.Title>
              <Dialog.Close
                as={IconButton}
                variant='ghost'
                size='small'
                colorPalette='gray'
              >
                <CloseIcon />
              </Dialog.Close>
            </HStack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
