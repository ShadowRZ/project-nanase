import { Button } from '@kobalte/core/button';
import { Show, type Component } from 'solid-js';
import Avatar from '~/app/atoms/avatar/Avatar';
import NotificationCount from '~/app/atoms/notification/NotificationCount';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import ChatCircleDotsBold from '~icons/ph/chat-circle-dots-bold';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';

type RoomItemProps = {
  current: boolean;
  name: string;
  roomId: string;
  avatar?: string;
  lastTs: number;
  unread?: number;
  lastSender?: string;
  lastContent?: string;
  direct?: boolean;
  onClick?: (ev: MouseEvent) => void;
};

const RoomItem: Component<RoomItemProps> = (props) => {
  return (
    <Button
      onClick={props.onClick}
      class='text-start p-2 transition duration-150 rounded-2xl flex flex-row gap-2 w-full'
      classList={{
        'bg-transparent hover:bg-neutral-200/75': !props.current,
        'bg-rose-200/25 hover:bg-rose-200/75': props.current,
      }}
    >
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
      <div class='grow flex flex-col overflow-hidden'>
        <span class='inline-flex overflow-hidden'>
          <Text as='span' font='bold' content='truncate' class='grow'>
            {props.name}
          </Text>
          <Show when={props.lastTs !== undefined}>
            <span class='opacity-50 shrink-0 -z-5'>
              <Time timestamp={props.lastTs} />
            </span>
          </Show>
        </span>
        <span class='inline-flex overflow-hidden'>
          <span class='grow truncate opacity-75'>
            <Show when={props.lastSender}>
              <Text font='bold' as='span'>
                {props.lastSender}:{' '}
              </Text>
            </Show>
            <Show when={props.lastSender}>
              <Text as='span'>{props.lastContent}</Text>
            </Show>
          </span>
          <Show when={props.unread && props.unread > 0}>
            <NotificationCount count={props.unread!} highlight />
          </Show>
        </span>
      </div>
    </Button>
  );
};

export default RoomItem;
