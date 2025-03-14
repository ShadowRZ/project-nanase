import { Dialog, IconButton, Tooltip } from '@hanekokoro-ui/solid';
import { HStack } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import type { PolymorphicCallbackProps } from '@kobalte/core';
import type {
  TooltipTriggerOptions,
  TooltipTriggerRenderProps,
} from '@kobalte/core/tooltip';
import type { Component, ComponentProps } from 'solid-js';
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
              colorPalette='red'
              width='8'
              height='8'
              display='flex'
              alignItems='center'
              justifyContent='center'
              rounded='full'
              _hover={{
                bg: 'colorPalette.3',
                ringWidth: '3',
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
      <Dialog.Portal>
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
                size='sm'
                colorPalette='gray'
              >
                <CloseIcon />
              </Dialog.Close>
            </HStack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
