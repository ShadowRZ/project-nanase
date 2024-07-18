import type { Component } from 'solid-js';
import AccountMenu from './AccountMenu';
import Tooltip from '~/app/atoms/tooltip/Tooltip';
import IconButton from '~/app/atoms/icon-button/IconButton';
import t from '~/app/i18n';
import {
  type RoomCategory,
  type SpaceRooms,
} from '~/app/organisms/room-list/RoomList';
import SpaceList from '~/app/organisms/space-list/SpaceList';
import { square } from '~styled/patterns';
import { Flex } from '~styled/jsx';
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
    <Flex
      direction='column'
      shrink='0'
      w='16'
      h='dvh'
      overflowY='scroll'
      borderRightWidth='1'
      scrollbar='hidden'
      borderColor='mauve.7'
    >
      <Flex direction='column' gap='2' p='2'>
        <Tooltip placement='right' openDelay={0} closeDelay={0}>
          <IconButton
            as={Tooltip.Trigger}
            iconClass={square({ size: '6' })}
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
            iconClass={square({ size: '6' })}
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
      </Flex>
      <Flex
        direction='column'
        gap='2'
        p='2'
        mt='auto'
        position='sticky'
        bottom='0'
        bg={{ base: 'white', _dark: 'black ' }}
      >
        <AccountMenu />
      </Flex>
    </Flex>
  );
};

export default Sidebar;
