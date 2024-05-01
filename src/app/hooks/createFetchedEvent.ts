import {
  type MatrixClient,
  type EventTimelineSet,
  MatrixEvent,
  type Room,
} from 'matrix-js-sdk';
import { type CryptoBackend } from 'matrix-js-sdk/lib/common-crypto/CryptoBackend';
import { createResource } from 'solid-js';

export function createFetchedEvent(
  roomId: () => string,
  eventId: () => string,
  timelineSet: () => EventTimelineSet,
  client: () => MatrixClient
) {
  const room = () => client().getRoom(roomId()) ?? undefined;

  const [target] = createResource(
    (): [string, Room | undefined, string, EventTimelineSet] => [
      roomId(),
      room(),
      eventId(),
      timelineSet(),
    ],
    async ([$roomId, $room, $eventId, $timelineSet]) => {
      await $room?.loadMembersIfNeeded();
      const timelineEvent = $timelineSet.findEventById($eventId);
      if (timelineEvent !== undefined) return timelineEvent;
      const ev = new MatrixEvent(
        await client().fetchRoomEvent($roomId, $eventId)
      );
      if (ev.isEncrypted() && client().getCrypto())
        await ev.attemptDecryption(client().getCrypto() as CryptoBackend);
      return ev;
    }
  );

  return target;
}
