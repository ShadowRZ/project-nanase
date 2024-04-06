import { createEffect, createMemo, createResource, onCleanup } from 'solid-js';
import { type MatrixEvent, RoomEvent } from 'matrix-js-sdk';
import { createCurrentClientResource } from './createClientResource';

export default function createRoomLastEvent(roomId: () => string) {
  const client = createCurrentClientResource();
  const room = createMemo(() => client()?.getRoom(roomId()) ?? undefined);

  const [event, { refetch }] = createResource(room, ($room) =>
    $room.getLastLiveEvent()
  );

  const onTimeLine = (_event: MatrixEvent): void => {
    void refetch();
  };

  createEffect(() => {
    const thisRoom = room();
    thisRoom?.on(RoomEvent.Timeline, onTimeLine);
    onCleanup(() => {
      thisRoom?.off(RoomEvent.Timeline, onTimeLine);
    });
  });

  return event;
}
