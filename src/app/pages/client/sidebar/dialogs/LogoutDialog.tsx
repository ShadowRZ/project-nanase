import { Button, Dialog, Menu, Tooltip } from '@hanekokoro-ui/solid';
import { Flex } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import { Component, createUniqueId } from 'solid-js';
import { Portal } from 'solid-js/web';
import PowerDuotone from '~icons/ph/power-duotone';

export const LogoutDialog: Component = () => {
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
                  value='logout'
                  colorPalette='red'
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
                >
                  <PowerDuotone
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
          <Tooltip.Content>Logout</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Logout</Dialog.Title>
            <Flex direction='column' mt='2' gap='2'>
              Proceed to logout?
              <Flex justify='end' gap='2'>
                <Dialog.CloseTrigger.AsChild onClick={() => {}}>
                  {(props) => (
                    <Button {...props()} variant='ghost' colorPalette='gray'>
                      Cancel
                    </Button>
                  )}
                </Dialog.CloseTrigger.AsChild>
                <Dialog.CloseTrigger.AsChild onClick={() => {}}>
                  {(props) => (
                    <Button {...props()} variant='solid' colorPalette='red'>
                      Logout
                    </Button>
                  )}
                </Dialog.CloseTrigger.AsChild>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
