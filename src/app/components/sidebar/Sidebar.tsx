import type { Component } from 'solid-js';
import AccountMenu from './AccountMenu';
import Tooltip from '~/app/atoms/tooltip/Tooltip';
import IconButton from '~/app/atoms/icon-button/IconButton';
import t from '~/app/i18n';
import Box from '~/app/atoms/box/Box';
import {
  type RoomCategory,
  type SpaceRooms,
} from '~/app/organisms/room-list/RoomList';
import SpaceList from '~/app/organisms/space-list/SpaceList';
import ChatsTeardropFill from '~icons/ph/chats-teardrop-fill';
import FolderUserFill from '~icons/ph/folder-user-fill';

export type SidebarProps = {
  category: RoomCategory;
  onCategoryChanged: (category: RoomCategory) => void;
};

const Sidebar: Component<SidebarProps> = (props) => {
  const category = (): RoomCategory => props.category;
  const categoryType = () => category().type;
  const currentSpaceId = () =>
    categoryType() === 'space' ? (category() as SpaceRooms).space : undefined;

  return (
    <div class='shrink-0 flex flex-col w-16 h-dvh overflow-y-scroll border-r sm:border-slate-200 dark:sm:border-slate-800 scrollbar-none'>
      <div class='flex flex-col gap-2 p-2'>
        <Tooltip placement='right' openDelay={0} closeDelay={0}>
          <IconButton
            as={Tooltip.Trigger}
            class='text-rose-500'
            iconClass='size-6'
            type='large-bordered'
            onClick={() => {
              props.onCategoryChanged({ type: 'chats' });
            }}
            icon={ChatsTeardropFill}
            checked={categoryType() === 'chats'}
          />
          <Tooltip.Portal>
            <Tooltip.Content ml='1'>{t('chats')}</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>
        <Tooltip placement='right' openDelay={0} closeDelay={0}>
          <IconButton
            as={Tooltip.Trigger}
            class='text-rose-500'
            iconClass='size-6'
            type='large-bordered'
            onClick={() => {
              props.onCategoryChanged({ type: 'directs' });
            }}
            icon={FolderUserFill}
            checked={categoryType() === 'directs'}
          />
          <Tooltip.Portal>
            <Tooltip.Content ml='1'>{t('directs')}</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>
        <SpaceList
          currentSpaceId={currentSpaceId()}
          onCurrentSpaceIdChanged={(spaceId) => {
            props.onCategoryChanged({ type: 'space', space: spaceId });
          }}
        />
      </div>
      <div class='mt-auto flex flex-col gap-2 p-2 sticky bottom-0 bg-white dark:bg-black'>
        <AccountMenu />
      </div>
    </div>
  );
};

export default Sidebar;
