import { Avatar } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { Tooltip } from '@/components/ui/tooltip';
import { Tabs } from '@ark-ui/solid';
import { createSignal, createUniqueId, For, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import ChatsTeardropFill from '~icons/ph/chats-teardrop-fill';
import FolderUserFill from '~icons/ph/folder-user-fill';
import FoldersDuotone from '~icons/ph/folders-duotone';
import { css } from '~styled/css';
import { Flex } from '~styled/jsx';
import { flex, square } from '~styled/patterns';
import { MxcImg } from '../../../components/mxc-img/MxcImg';
import { createRoomInfo } from '../../../hooks/createRoomInfo';
import { useSpaces } from '../../../hooks/useClientState';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import AccountMenu from './AccountMenu';
import { DirectRooms, JoinedRooms, SpaceChildrens } from './RoomList';

const SpaceTabItem: Component<{ roomId: string }> = (props) => {
  const roomId = () => props.roomId;

  const trigger = createUniqueId();
  const mx = useMatrixClient();
  const room = () => mx().getRoom(roomId()) ?? undefined;
  const { name, avatar } = createRoomInfo(room);

  return (
    <Tooltip.Root ids={{ trigger }} positioning={{ placement: 'right' }}>
      <Tooltip.Trigger.AsChild>
        {(props) => (
          <Tabs.Trigger
            value={roomId()}
            asChild={(props) => (
              <Avatar.WithComponent
                icon={<FoldersDuotone />}
                ids={{ root: trigger }}
                {...props()}
              >
                {(props) => (
                  <MxcImg {...props()} client={mx()} src={avatar()} />
                )}
              </Avatar.WithComponent>
            )}
            {...props()}
          />
        )}
      </Tooltip.Trigger.AsChild>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{name()}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};

const Sidebar: Component = () => {
  const [value, setValue] = createSignal('chats');
  const spaces = useSpaces();

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
        w: { base: 'full', md: '27.5rem' },
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
                color='colorPalette.12'
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
                color='colorPalette.12'
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
        <For each={spaces()}>{(space) => <SpaceTabItem roomId={space} />}</For>
        <Flex direction='column' mt='auto' position='sticky' bottom='0'>
          <AccountMenu />
        </Flex>
      </Tabs.List>
      <Tabs.Content
        value='chats'
        class={css({ overflow: 'scroll', width: 'full' })}
      >
        <JoinedRooms />
      </Tabs.Content>
      <Tabs.Content
        value='dms'
        class={css({ overflow: 'scroll', width: 'full' })}
      >
        <DirectRooms />
      </Tabs.Content>
      <For each={spaces()}>
        {(space) => (
          <Tabs.Content
            value={space}
            class={css({ overflow: 'scroll', width: 'full' })}
          >
            <SpaceChildrens roomId={space} />
          </Tabs.Content>
        )}
      </For>
    </Tabs.Root>
  );
};

export default Sidebar;
