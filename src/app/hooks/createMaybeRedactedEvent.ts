import { createEffect, createMemo, createSignal, onCleanup } from 'solid-js';
import { type Room, RoomEvent, type MatrixEvent } from 'matrix-js-sdk';
import { createCurrentClientResource } from './createClientResource';

export default function createMaybeRedactedEvent(
  event: () => MatrixEvent,
  roomId: () => string
) {
  const client = createCurrentClientResource();
  const room = createMemo(() => client()?.getRoom(roomId()) ?? undefined);

  const [maybeRedactedEvent, setMaybeRedactedEvent] = createSignal(event(), {
    equals: false,
  });

  const updateEvent = (event: MatrixEvent, room: Room) => {
    if (
      maybeRedactedEvent().getId() ===
        (event.getContent().redacts as string | undefined) &&
      room.roomId === roomId()
    ) {
      setMaybeRedactedEvent(maybeRedactedEvent());
    }
  };

  createEffect(() => {
    const thisRoom = room();
    thisRoom?.on(RoomEvent.Redaction, updateEvent);
    thisRoom?.on(RoomEvent.RedactionCancelled, updateEvent);
    onCleanup(() => {
      thisRoom?.off(RoomEvent.Redaction, updateEvent);
      thisRoom?.off(RoomEvent.RedactionCancelled, updateEvent);
    });
  });

  return maybeRedactedEvent;
}
