import { type ProfileResource } from '~/types/profile';
import { useCurrentClient } from '~/app/hooks/useCurrentClient';
import { getRoomMemberAvatarUrl } from '~/lib/utils/matrix';

export const getRoomScopedProfile = (
  roomId: string,
  userId: string
): ProfileResource => {
  const client = useCurrentClient();
  const room = () => client()?.client.getRoom(roomId) ?? undefined;
  const member = () => room()?.getMember(userId) ?? undefined;
  const name = () => member()?.name;
  const avatar = () => {
    const thisRoom = room();
    const thisMember = member();
    return getRoomMemberAvatarUrl(thisRoom, thisMember);
  };

  return {
    name,
    avatar,
  };
};
