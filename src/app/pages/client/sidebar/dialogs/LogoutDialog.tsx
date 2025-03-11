import { AlertDialog, Button, Tooltip } from '@hanekokoro-ui/solid';
import { Flex } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import { PolymorphicCallbackProps } from '@kobalte/core';
import {
  TooltipTriggerOptions,
  TooltipTriggerRenderProps,
} from '@kobalte/core/tooltip';
import { Component, ComponentProps } from 'solid-js';
import { Portal } from 'solid-js/web';
import PowerDuotone from '~icons/ph/power-duotone';

export const LogoutDialog: Component = () => {
  return (
    <AlertDialog.Root>
      <Tooltip.Root placement='top'>
        <Tooltip.Trigger
          as={(
            props: PolymorphicCallbackProps<
              ComponentProps<typeof AlertDialog.Trigger>,
              TooltipTriggerOptions,
              TooltipTriggerRenderProps
            >
          ) => (
            <AlertDialog.Trigger
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
          <PowerDuotone
            class={square({
              size: '6',
              color: 'colorPalette.text',
            })}
          />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content>Logout</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
      <Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Positioner>
          <AlertDialog.Content>
            <AlertDialog.Title>Logout</AlertDialog.Title>
            <Flex direction='column' mt='2' gap='2'>
              Proceed to logout?
              <Flex justify='end' gap='2'>
                <AlertDialog.Cancel
                  as={Button}
                  variant='ghost'
                  colorPalette='gray'
                  onClick={() => {}}
                >
                  Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action
                  as={Button}
                  variant='solid'
                  colorPalette='red'
                  onClick={() => {}}
                >
                  Logout
                </AlertDialog.Action>
              </Flex>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </Portal>
    </AlertDialog.Root>
  );
};
