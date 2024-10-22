import {
  type Room,
  RoomMemberEvent,
  type MatrixEvent,
  type RoomMember,
} from 'matrix-js-sdk';
import { createEffect, createResource, onCleanup } from 'solid-js';
import { getRoomMemberAvatarUrl } from '~/lib/utils/matrix';
import { type ProfileResource } from '~/types/profile';
import { useMatrixClient } from './useMatrixClient';

export const createRoomScopedProfile = (
  roomId: () => string,
  userId: () => string
): ProfileResource => {
  const mx = useMatrixClient();
  const room = () => mx()?.getRoom(roomId()) ?? undefined;
  const member = () => room()?.getMember(userId()) ?? undefined;

  const [name, { refetch: refetchName }] = createResource(
    (): [Room | undefined, RoomMember | undefined] => [room(), member()],
    async ([$room, $member]) => {
      await $room?.loadMembersIfNeeded();
      return $member?.name;
    }
  );

  const [avatar, { refetch: refetchAvatar }] = createResource(
    (): [Room | undefined, RoomMember | undefined] => [room(), member()],
    async ([$room, $member]) => {
      await $room?.loadMembersIfNeeded();
      return getRoomMemberAvatarUrl(room(), $member);
    }
  );

  const onMember = (_event: MatrixEvent, _member: RoomMember) => {
    void refetchName();
    void refetchAvatar();
  };

  createEffect(() => {
    const thisMember = member();
    if (thisMember !== undefined) {
      void refetchName();
      void refetchAvatar();
    }

    thisMember?.on(RoomMemberEvent.Membership, onMember);
    onCleanup(() => {
      thisMember?.off(RoomMemberEvent.Membership, onMember);
    });
  });

  return {
    name,
    avatar,
  };
};
