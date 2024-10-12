import { createSignal, createUniqueId, type Component } from 'solid-js';
import AccountMenu from './AccountMenu';
import { Tooltip } from '@/components/ui/tooltip';
import t from '~/app/i18n';
import {
  type RoomCategory,
  type SpaceRooms,
} from '~/app/organisms/room-list/RoomList';
import SpaceList from '~/app/organisms/space-list/SpaceList';
import { flex, square } from '~styled/patterns';
import { Flex, Square } from '~styled/jsx';
import ChatsTeardropFill from '~icons/ph/chats-teardrop-fill';
import FolderUserFill from '~icons/ph/folder-user-fill';
import { Tabs } from '@ark-ui/solid';
import { css, cx } from '~styled/css';
import { IconButton } from '@/components/ui/icon-button';
import { Portal } from 'solid-js/web';
import { button } from '~styled/recipes';

export type SidebarProps = {
  category: RoomCategory;
  onCategoryChanged: (category: RoomCategory) => void;
};

const Sidebar: Component = (props) => {
  // const category = (): RoomCategory => props.category;
  // const categoryType = () => category().type;
  // const currentSpaceId = () =>
  //   categoryType() === 'space' ? (category() as SpaceRooms).space : undefined;

  const [value, setValue] = createSignal('chats');

  return (
    <Tabs.Root
      orientation='vertical'
      value={value()}
      onValueChange={({ value }) => setValue(value)}
      class={flex({
        direction: 'row',
        shrink: '0',
        h: 'dvh',
        overflowY: 'scroll',
        borderRightWidth: '1',
        scrollbar: 'hidden',
        borderColor: 'border.default',
      })}
    >
      <Tabs.List
        class={flex({
          direction: 'column',
          gap: '2',
          p: '2',
          w: '16',
          borderRightWidth: '1',
          borderColor: 'border.default',
        })}
      >
        <Tooltip.Root positioning={{ placement: 'right' }}>
          <Tooltip.Trigger.AsChild>
            {(props) => (
              <IconButton.AsChild
                variant='outline'
                px='0'
                py='0'
                width='12'
                height='12'
                rounded='full'
                colorPalette='accent'
                _selected={{ bg: 'colorPalette.5' }}
                {...props()}
              >
                {(props) => (
                  <Tabs.Trigger value='chats' {...props()}>
                    <ChatsTeardropFill class={square({ size: '6' })} />
                  </Tabs.Trigger>
                )}
              </IconButton.AsChild>
            )}
          </Tooltip.Trigger.AsChild>
          <Portal>
            <Tooltip.Positioner>
              <Tooltip.Content>Chats</Tooltip.Content>
            </Tooltip.Positioner>
          </Portal>
        </Tooltip.Root>
        <Tooltip.Root positioning={{ placement: 'right' }}>
          <Tooltip.Trigger.AsChild>
            {(props) => (
              <IconButton.AsChild
                variant='outline'
                px='0'
                py='0'
                width='12'
                height='12'
                rounded='full'
                colorPalette='accent'
                _selected={{ bg: 'colorPalette.5' }}
                {...props()}
              >
                {(props) => (
                  <Tabs.Trigger value='dms' {...props()}>
                    <FolderUserFill class={square({ size: '6' })} />
                  </Tabs.Trigger>
                )}
              </IconButton.AsChild>
            )}
          </Tooltip.Trigger.AsChild>
          <Portal>
            <Tooltip.Positioner>
              <Tooltip.Content>DMs</Tooltip.Content>
            </Tooltip.Positioner>
          </Portal>
        </Tooltip.Root>
        {/* Accounts Menu */}
        <Flex direction='column' mt='auto' position='sticky' bottom='0'>
          <Square size='12'>Hello</Square>
        </Flex>
      </Tabs.List>
      <Tabs.Content value='chats'>Chats</Tabs.Content>
      <Tabs.Content value='dms'>DMs</Tabs.Content>
    </Tabs.Root>
  );
};

export default Sidebar;
