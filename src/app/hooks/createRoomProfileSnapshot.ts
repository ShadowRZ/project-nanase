import { createMemo } from 'solid-js';
import { getRoomMemberAvatarUrl } from '~/lib/utils/matrix';
import { useMatrixClient } from './useMatrixClient';

export default function createRoomProfileSnapshot(
  roomId: () => string,
  userId: () => string
) {
  const client = useMatrixClient();
  const room = () => client()?.getRoom(roomId()) ?? undefined;
  const member = () => room()?.getMember(userId()) ?? undefined;

  const name = createMemo(() => member()?.name);
  const avatar = createMemo(() => {
    const thisRoom = room();
    const thisMember = member();
    return getRoomMemberAvatarUrl(thisRoom, thisMember);
  });

  return { name, avatar };
}
