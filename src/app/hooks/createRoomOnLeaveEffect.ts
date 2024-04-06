import { createEffect, createMemo, onCleanup } from 'solid-js';
import { type Room, RoomEvent } from 'matrix-js-sdk';
import { createCurrentClientResource } from './createClientResource';

export default function createRoomOnLeaveEffect(
  roomId: () => string,
  effect: () => void
) {
  const client = createCurrentClientResource();
  const room = createMemo(() => client()?.getRoom(roomId()) ?? undefined);

  const onMembership = (_room: Room, membership: string) => {
    if (['leave', 'kick', 'ban'].includes(membership)) {
      effect();
    }
  };

  createEffect(() => {
    const thisRoom = room();
    thisRoom?.on(RoomEvent.MyMembership, onMembership);
    onCleanup(() => {
      thisRoom?.off(RoomEvent.MyMembership, onMembership);
    });
  });
}
