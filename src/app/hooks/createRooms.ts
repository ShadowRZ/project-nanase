import { MatrixClient, Room } from 'matrix-js-sdk';
import { Accessor } from 'solid-js';
import { createDirects } from './createDirects';
import { createJoinedRooms } from './createJoinedRooms';

const isRoom = (room: Room | null) => {
  if (!room) return false;
  return !room.isSpaceRoom();
};

export const createRooms = (mx: Accessor<MatrixClient>) => {
  const $directs = createDirects(mx);
  const $joined = createJoinedRooms(mx);

  const rooms = () =>
    $joined.filter((id) => isRoom(mx().getRoom(id)) && !$directs.includes(id));

  const directs = () =>
    $joined.filter((id) => isRoom(mx().getRoom(id)) && $directs.includes(id));

  return { rooms, directs };
};
