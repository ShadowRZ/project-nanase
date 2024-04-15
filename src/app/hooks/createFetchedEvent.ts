import {
  type MatrixClient,
  type EventTimelineSet,
  MatrixEvent,
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
  const eventF = () => async () => {
    await room()?.loadMembersIfNeeded();
    const timelineEvent = timelineSet().findEventById(eventId());
    if (timelineEvent !== undefined) return timelineEvent;
    const ev = new MatrixEvent(
      await client().fetchRoomEvent(roomId(), eventId())
    );
    if (ev.isEncrypted() && client().getCrypto())
      await ev.attemptDecryption(client().getCrypto() as CryptoBackend);
    return ev;
  };

  const [target] = createResource(eventF, async ($eventF) => $eventF());

  return target;
}
