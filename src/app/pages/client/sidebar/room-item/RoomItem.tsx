import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Component, Show } from 'solid-js';
import { trimReplyFallback } from '~/lib/utils/matrix';
import HashStraightDuotone from '~icons/ph/hash-straight-duotone';
import UserCircleFill from '~icons/ph/user-circle-fill';
import { Flex, styled } from '~styled/jsx';
import NotificationCount from '../../../../atoms/notification/NotificationCount';
import Time from '../../../../atoms/time/Time';
import { MxcAvatar } from '../../../../components/mxc-avatar/MxcAvatar';
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

  return (
    <Show when={room()}>
      <Button
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
            <Show when={props.direct} fallback={<HashStraightDuotone />}>
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
              <styled.span opacity='50' flexShrink='0' zIndex='-5'>
                <Time timestamp={lastTs()!} />
              </styled.span>
            </Show>
          </styled.span>
          <styled.span display='inline-flex' overflow='hidden'>
            <styled.span flexGrow='1' truncate opacity='75'>
              <Show when={lastSender}>
                <Text size='md' fontWeight='bold' as='span'>
                  {lastSender()}:{' '}
                </Text>
              </Show>
              <Show when={lastSender()}>
                <Text size='md' as='span'>
                  {lastContent()}
                </Text>
              </Show>
            </styled.span>
            <Show when={unread() && unread()! > 0}>
              <NotificationCount count={unread()!} highlight />
            </Show>
          </styled.span>
        </Flex>
      </Button>
    </Show>
  );
};
