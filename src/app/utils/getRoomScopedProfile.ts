import { type ProfileResource } from '~/types/profile';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { getRoomMemberAvatarUrl } from '~/lib/utils/matrix';

export const getRoomScopedProfile = (
  roomId: string,
  userId: string
): ProfileResource => {
  const client = createCurrentClientResource();
  const room = () => client()?.getRoom(roomId) ?? undefined;
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
