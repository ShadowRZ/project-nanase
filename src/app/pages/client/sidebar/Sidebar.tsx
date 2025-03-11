import { Tabs, Tooltip } from '@hanekokoro-ui/solid';
import { css } from '@hanekokoro-ui/styled-system/css';
import { Flex, Square } from '@hanekokoro-ui/styled-system/jsx';
import { square } from '@hanekokoro-ui/styled-system/patterns';
import { createSignal, For, type Component } from 'solid-js';
import ChatsTeardropDuotone from '~icons/ph/chats-teardrop-duotone';
import FolderUserDuotone from '~icons/ph/folder-user-duotone';
import FoldersDuotone from '~icons/ph/folders-duotone';
import { MxcAvatar } from '../../../components/mxc-avatar/MxcAvatar';
import { createRoomInfo } from '../../../hooks/createRoomInfo';
import { useSpaces } from '../../../hooks/useClientState';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import AccountMenu from './AccountMenu';
import { DirectRooms, JoinedRooms, SpaceChildrens } from './RoomList';

const SpaceTabItem: Component<{ roomId: string }> = (props) => {
  const roomId = () => props.roomId;

  const mx = useMatrixClient();
  const room = () => mx().getRoom(roomId()) ?? undefined;
  const { name, avatar } = createRoomInfo(room);

  return (
    <Tabs.Trigger value={roomId()}>
      <Tooltip.Root placement='right'>
        <Tooltip.Trigger
          as={MxcAvatar}
          icon={<FoldersDuotone />}
          src={avatar()}
        />
        <Tooltip.Portal>
          <Tooltip.Content>{name()}</Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tabs.Trigger>
  );
};

const Sidebar: Component = () => {
  const [value, setValue] = createSignal('chats');
  const spaces = useSpaces();

  return (
    <Tabs.Root
      orientation='vertical'
      value={value()}
      onChange={(value) => setValue(value)}
      flexShrink='0'
      h='dvh'
      overflowY='scroll'
      borderRightWidth='1'
      scrollbar='hidden'
      w={{ base: 'full', md: '27.5rem' }}
      borderColor='border.default'
    >
      <Tabs.List
        borderRightWidth='1'
        borderColor='border.default'
        gap='2'
        p='2'
      >
        <Tabs.Trigger value='chats'>
          <Tooltip.Root placement='right'>
            <Tooltip.Trigger
              as={Square}
              size='12'
              rounded='full'
              alignContent='center'
              justifyContent='center'
              colorPalette='accent'
              color='colorPalette.11'
              bg='colorPalette.dimmed'
            >
              <ChatsTeardropDuotone class={square({ size: '8' })} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>Chats</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tabs.Trigger>
        <Tabs.Trigger value='dms'>
          <Tooltip.Root placement='right'>
            <Tooltip.Trigger
              as={Square}
              size='12'
              rounded='full'
              alignContent='center'
              justifyContent='center'
              colorPalette='accent'
              color='colorPalette.11'
              bg='colorPalette.dimmed'
            >
              <FolderUserDuotone class={square({ size: '8' })} />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content>DMs</Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tabs.Trigger>
        <For each={spaces()}>{(space) => <SpaceTabItem roomId={space} />}</For>
        <Flex direction='column' mt='auto' position='sticky' bottom='0'>
          <AccountMenu />
        </Flex>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content
        value='chats'
        class={css({ overflowY: 'scroll', width: 'full' })}
      >
        <JoinedRooms />
      </Tabs.Content>
      <Tabs.Content
        value='dms'
        class={css({ overflowY: 'scroll', width: 'full' })}
      >
        <DirectRooms />
      </Tabs.Content>
      <For each={spaces()}>
        {(space) => (
          <Tabs.Content
            value={space}
            class={css({ overflowY: 'scroll', width: 'full' })}
          >
            <SpaceChildrens roomId={space} />
          </Tabs.Content>
        )}
      </For>
    </Tabs.Root>
  );
};

export default Sidebar;
