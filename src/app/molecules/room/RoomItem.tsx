import { Button } from '@kobalte/core/button';
import { Show, type Component } from 'solid-js';
import NotificationCount from '~/app/atoms/notification/NotificationCount';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import Avatar from '~/app/components/avatar/Avatar';
import { styled, Flex } from '~styled/jsx';
import { css } from '~styled/css';
import HashStraightDuotone from '~icons/ph/hash-straight-duotone';
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

const RoomItemButton = styled(Button, {
  base: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'start',
    p: '2',
    gap: '2',
    w: 'full',
    rounded: '2xl',
    transition: 'common',
    transitionDuration: '150ms',
    bg: {
      base: 'transparent',
      _hover: 'mauve.a.4',
    },
  },
  variants: {
    current: {
      true: {
        bg: {
          base: 'ruby.a.3',
          _hover: 'ruby.a.4',
        },
      },
    },
  },
});

const RoomItem: Component<RoomItemProps> = (props) => {
  const current = () => props.current;
  return (
    <RoomItemButton onClick={props.onClick} current={current()}>
      <Show
        when={props.direct}
        fallback={
          <Avatar
            src={props.avatar}
            size='large'
            fallback={HashStraightDuotone}
          />
        }
      >
        <Avatar src={props.avatar} size='large' fallback={UserCircleDuotone} />
      </Show>
      <Flex direction='column' grow='1' overflow='hidden'>
        <styled.span display='inline-flex' overflow='hidden'>
          <Text
            as='span'
            font='bold'
            content='truncate'
            class={css({ flexGrow: '1' })}
          >
            {props.name}
          </Text>
          <Show when={props.lastTs !== undefined}>
            <styled.span opacity='50' flexShrink='0' zIndex='-5'>
              <Time timestamp={props.lastTs} />
            </styled.span>
          </Show>
        </styled.span>
        <styled.span display='inline-flex' overflow='hidden'>
          <styled.span flexGrow='1' truncate opacity='75'>
            <Show when={props.lastSender}>
              <Text font='bold' as='span'>
                {props.lastSender}:{' '}
              </Text>
            </Show>
            <Show when={props.lastSender}>
              <Text as='span'>{props.lastContent}</Text>
            </Show>
          </styled.span>
          <Show when={props.unread && props.unread > 0}>
            <NotificationCount count={props.unread!} highlight />
          </Show>
        </styled.span>
      </Flex>
    </RoomItemButton>
  );
};

export default RoomItem;
