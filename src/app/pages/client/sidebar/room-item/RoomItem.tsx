import { Button, Text } from '@hanekokoro-ui/solid';
import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';
import { useNavigate, useParams } from '@solidjs/router';
import { type Component, Show } from 'solid-js';
import HashStraightBold from '~icons/ph/hash-straight-bold';
import UserCircleFill from '~icons/ph/user-circle-fill';
import { trimReplyFallback } from '../../../../../lib/utils/matrix';
import { MxcAvatar } from '../../../../components/mxc-avatar/MxcAvatar';
import NotificationCount from '../../../../components/notification-count/NotificationCount';
import { Time } from '../../../../components/time/Time';
import { createRoomInfo } from '../../../../hooks/createRoomInfo';
import { useMatrixClient } from '../../../../hooks/useMatrixClient';

type RoomItemProps = {
  roomId: string;
  direct?: boolean;
};

export const RoomItem: Component<RoomItemProps> = (props) => {
  const mx = useMatrixClient();
  const room = () => mx().getRoom(props.roomId) ?? undefined;
  const {
    name: $name,
    avatar: $avatar,
    lastTs,
    unread,
    lastEvent,
  } = createRoomInfo(room);

  const lastSender = () =>
    lastEvent()?.sender?.name ?? (lastEvent()?.getContent().sender as string);

  const name = () => {
    if (props.direct) {
      const userId = room()?.guessDMUserId();
      return userId === undefined
        ? undefined
        : room()?.getMember(userId)?.rawDisplayName;
    } else {
      return $name();
    }
  };

  const avatar = () => {
    if (props.direct) {
      const userId = room()?.guessDMUserId();
      return userId === undefined
        ? undefined
        : room()?.getMember(userId)?.getMxcAvatarUrl();
    } else {
      return $avatar();
    }
  };

  const lastContent = () =>
    trimReplyFallback(lastEvent()?.getContent().body as string);

  const navigate = useNavigate();
  const params = useParams();
  const selected = () => params.roomId === props.roomId;

  const onClick = () => {
    navigate(`/rooms/${props.roomId}`);
  };

  return (
    <Show when={room()}>
      <Button
        data-selected={selected() ? '' : undefined}
        onClick={onClick}
        colorPalette='neutral'
        variant='ghost'
        display='flex'
        flexDirection='row'
        textAlign='start'
        rounded='xl'
        height='unset'
        p='2'
        _selected={{ bg: 'accent.4' }}
        css={{
          '& svg': {
            width: '75%',
            height: '75%',
          },
        }}
      >
        <MxcAvatar
          flexShrink='0'
          icon={
            <Show when={props.direct} fallback={<HashStraightBold />}>
              <UserCircleFill />
            </Show>
          }
          src={avatar()}
        />
        <Flex direction='column' grow='1' overflow='hidden'>
          <styled.span display='inline-flex' overflow='hidden'>
            <Text
              as='span'
              size='md'
              fontWeight='bold'
              minW='0'
              flexGrow='1'
              truncate
            >
              {name()}
            </Text>
            <Show when={lastTs !== undefined}>
              <styled.span display='inline-flex' alignItems='center'>
                <Time timestamp={lastTs()!} color='fg.subtle' flexShrink='0' />
              </styled.span>
            </Show>
          </styled.span>
          <styled.span display='inline-flex' overflow='hidden'>
            <styled.span flexGrow='1' truncate>
              <Show when={lastSender}>
                <Text size='md' fontWeight='bold' as='span'>
                  {lastSender()}:{' '}
                </Text>
              </Show>
              <Show when={lastSender()}>
                <Text size='md' as='span' color='fg.muted'>
                  {lastContent()}
                </Text>
              </Show>
            </styled.span>
            <Show when={unread() && unread() > 0}>
              <NotificationCount count={unread()} highlight />
            </Show>
          </styled.span>
        </Flex>
      </Button>
    </Show>
  );
};
