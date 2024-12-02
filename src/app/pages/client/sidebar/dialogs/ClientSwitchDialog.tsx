import { Dialog, IconButton, Menu, Tooltip } from '@shadowrz/hanekokoro-ui';
import { HStack } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import { square } from '@shadowrz/hanekokoro-ui/styled-system/patterns';
import { Component, createUniqueId } from 'solid-js';
import { Portal } from 'solid-js/web';
import UserSwitchDuotone from '~icons/ph/user-switch-duotone';
import CloseIcon from '~icons/ph/x-bold';

export const ClientSwitchDialog: Component = () => {
  const trigger = createUniqueId();

  return (
    <Dialog.Root ids={{ trigger }}>
      <Tooltip.Root ids={{ trigger }} positioning={{ placement: 'top' }}>
        <Dialog.Trigger.AsChild>
          {(props) => (
            <Tooltip.Trigger.AsChild {...props()}>
              {(props) => (
                <Menu.Item
                  {...props()}
                  value='switch'
                  colorPalette='orange'
                  width='8'
                  height='8'
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                  rounded='full'
                  transition='all'
                  _highlighted={{
                    bg: 'colorPalette.3',
                    ringWidth: '2',
                    outlineStyle: 'solid',
                  }}
                  ringColor='colorPalette.ring'
                >
                  <UserSwitchDuotone
                    class={square({
                      size: '6',
                      color: 'colorPalette.text',
                    })}
                  />
                </Menu.Item>
              )}
            </Tooltip.Trigger.AsChild>
          )}
        </Dialog.Trigger.AsChild>
        <Tooltip.Positioner>
          <Tooltip.Content>Switch Account</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <HStack>
              <Dialog.Title flexGrow='1' verticalAlign='middle'>
                Switch Account
              </Dialog.Title>
              <Dialog.CloseTrigger.AsChild>
                {(props) => (
                  <IconButton
                    variant='ghost'
                    size='small'
                    colorPalette='gray'
                    {...props()}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Dialog.CloseTrigger.AsChild>
            </HStack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
