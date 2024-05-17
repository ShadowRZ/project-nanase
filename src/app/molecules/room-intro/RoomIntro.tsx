import { Show, type Component } from 'solid-js';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import Avatar from '~/app/atoms/avatar/Avatar';
import IconButton from '~/app/atoms/button/IconButton';
import Text from '~/app/atoms/text/Text';
import Panel from '~/app/atoms/panel/Panel';
import ChatCircleDotsBold from '~icons/ph/chat-circle-dots-bold';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';
import ArrowLeft from '~icons/ph/arrow-left';
import DotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
import UsersThreeDuotone from '~icons/ph/users-three-duotone';
import GearDuotone from '~icons/ph/gear-duotone';
import DoorOpenDuotone from '~icons/ph/door-open-duotone';

type RoomIntroProps = {
  name: string;
  topic?: string;
  avatar?: string;
  direct?: boolean;
  onBack?: () => void;
  onMembers?: () => void;
  onSettings?: () => void;
  onLeaveRoom?: () => void;
};

const RoomIntro: Component<RoomIntroProps> = (props) => {
  return (
    <div class='box-content flex flex-row gap-4 items-center h-12 px-4 py-2 border-b border-slate-200 dark:border-slate-800'>
      <IconButton
        onClick={props.onBack}
        type='normal'
        icon={ArrowLeft}
        class='static md:hidden'
      />
      <Show
        when={!props.direct}
        fallback={
          <Avatar src={props.avatar} size='large' icon={UserCircleDuotone} />
        }
      >
        <Avatar
          src={props.avatar}
          size='large'
          icon={ChatCircleDotsBold}
          smallIcon
        />
      </Show>
      <span class='grow flex flex-col flex-1 min-w-0 truncate'>
        <Text font='bold' content='truncate' class='flex-1'>
          {props.name}
        </Text>
        <Show when={props.topic}>
          <Text content='truncate' title={props.topic} class='flex-1'>
            {props.topic}
          </Text>
        </Show>
      </span>
      <DropdownMenu placement='bottom-end'>
        <IconButton
          as={DropdownMenu.Trigger}
          type='normal'
          icon={DotsThreeVerticalBold}
        />
        <DropdownMenu.Portal>
          <Panel
            as={DropdownMenu.Content}
            decoration='bordered'
            class='mt-1 z-5 outline-none animate-hovercard-close ui-expanded:animate-hovercard-open overflow-clip'
          >
            <DropdownMenu.Item
              onSelect={props.onMembers}
              class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900'
            >
              <UsersThreeDuotone /> Members
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={props.onSettings}
              class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900'
            >
              <GearDuotone /> Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={props.onLeaveRoom}
              class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900 text-red'
            >
              <DoorOpenDuotone /> Leave Room
            </DropdownMenu.Item>
          </Panel>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </div>
  );
};

export default RoomIntro;
