import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Component, Show } from 'solid-js';
import { trimReplyFallback } from '~/lib/utils/matrix';
import HashStraightBold from '~icons/ph/hash-straight-bold';
import UserCircleFill from '~icons/ph/user-circle-fill';
import { Flex, styled } from '~styled/jsx';
import NotificationCount from '../../../../atoms/notification/NotificationCount';
import { Time } from '../../../../components/time/Time';
import { MxcAvatar } from '../../../../components/mxc-avatar/MxcAvatar';
import { createRoomInfo } from '../../../../hooks/createRoomInfo';
import { useMatrixClient } from '../../../../hooks/useMatrixClient';
import { useNavigate } from '@solidjs/router';

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
  const onClick = () => {
    navigate(`/rooms/${props.roomId}`);
  };

  return (
    <Show when={room()}>
      <Button
        onClick={onClick}
        colorPalette='neutral'
        variant='ghost'
        display='flex'
        flexDirection='row'
        textAlign='start'
        rounded='xl'
        height='unset'
        p='2'
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
          client={mx()}
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
