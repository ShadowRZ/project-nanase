import { Tooltip } from '@kobalte/core';
import type { Component } from 'solid-js';
import AccountMenu from './AccountMenu';
import SpaceList from '~/app/organisms/space-list/SpaceList';
import { type RoomCategory } from '~/app/organisms/room-list/RoomList';
import t from '~/app/i18n';
import ChatCircleBold from '~icons/ph/chats-circle-bold';
import UserBold from '~icons/ph/user-bold';
import IconButton from '~/app/atoms/button/IconButton';
import TooltipContent from '~/app/atoms/tooltip/TooltipContent';

export type SidebarProps = {
  category: RoomCategory;
  onCategoryChanged: (category: RoomCategory) => void;
};

const Sidebar: Component<SidebarProps> = (props) => {
  return (
    <div class='shrink-0 flex flex-col w-16 h-dvh overflow-y-scroll border-r sm:border-slate-200 dark:sm:border-slate-800 scrollbar-none'>
      <div class='flex flex-col gap-2 p-2'>
        <Tooltip.Root placement='right' openDelay={0} closeDelay={0}>
          <IconButton
            as={Tooltip.Trigger}
            class='text-rose-500'
            iconClass='size-6'
            type='large-bordered'
            onClick={() => {
              props.onCategoryChanged('chats');
            }}
            icon={ChatCircleBold}
            checked={props.category === 'chats'}
          />
          <Tooltip.Portal>
            <Tooltip.Content as={TooltipContent} class='ml-1'>
              {t('chats')}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <Tooltip.Root placement='right' openDelay={0} closeDelay={0}>
          <IconButton
            as={Tooltip.Trigger}
            class='text-rose-500'
            iconClass='size-6'
            type='large-bordered'
            onClick={() => {
              props.onCategoryChanged('directs');
            }}
            icon={UserBold}
            checked={props.category === 'directs'}
          />
          <Tooltip.Portal>
            <Tooltip.Content as={TooltipContent} class='ml-1'>
              {t('directs')}
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <SpaceList
          category={props.category}
          onCategoryChanged={props.onCategoryChanged}
        />
      </div>
      <div class='mt-auto flex flex-col gap-2 p-2 sticky bottom-0 bg-white dark:bg-black'>
        <AccountMenu />
      </div>
    </div>
  );
};

export default Sidebar;
