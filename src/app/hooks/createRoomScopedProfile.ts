import {
  type MatrixEvent,
  type RoomMember,
  RoomMemberEvent,
} from 'matrix-js-sdk';
import { createEffect, createResource, onCleanup } from 'solid-js';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { getRoomMemberAvatarUrl } from '~/lib/utils/matrix';
import { type ProfileResource } from '~/types/profile';

export const createRoomScopedProfile = (
  roomId: string,
  userId: string
): ProfileResource => {
  const client = createCurrentClientResource();
  const room = () => client()?.getRoom(roomId) ?? undefined;
  const member = () => room()?.getMember(userId) ?? undefined;

  const [name, { refetch: refetchName }] = createResource(
    member,
    ($member) => $member.name
  );

  const [avatar, { refetch: refetchAvatar }] = createResource(
    member,
    ($member) => getRoomMemberAvatarUrl(room(), $member)
  );

  const onMember = (_event: MatrixEvent, member: RoomMember) => {
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
