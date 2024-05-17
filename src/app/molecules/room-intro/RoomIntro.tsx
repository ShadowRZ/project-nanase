import { Show, type Component } from 'solid-js';
import { Popover } from '@kobalte/core/popover';
import Avatar from '~/app/atoms/avatar/Avatar';
import IconButton from '~/app/atoms/button/IconButton';
import Text from '~/app/atoms/text/Text';
import ChatCircleDotsBold from '~icons/ph/chat-circle-dots-bold';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';
import ArrowLeft from '~icons/ph/arrow-left';
import DotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
import Panel from '~/app/atoms/panel/Panel';

type RoomIntroProps = {
  name: string;
  topic?: string;
  avatar?: string;
  direct?: boolean;
  onBack?: () => void;
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
      <Popover>
        <IconButton
          as={Popover.Trigger}
          type='normal'
          icon={DotsThreeVerticalBold}
        />
        <Popover.Portal>
          <Panel
            as={Popover.Content}
            decoration='bordered'
            class='mt-1 z-50 outline-none animate-hovercard-close ui-expanded:animate-hovercard-open'
          >
            Hello
          </Panel>
        </Popover.Portal>
      </Popover>
    </div>
  );
};

export default RoomIntro;
