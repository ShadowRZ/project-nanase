import {
  type MatrixClient,
  type EventTimelineSet,
  MatrixEvent,
} from 'matrix-js-sdk';
import { type CryptoBackend } from 'matrix-js-sdk/lib/common-crypto/CryptoBackend';
import { createResource } from 'solid-js';

export function createReplyEvent(
  roomId: string,
  eventId: string,
  timelineSet: EventTimelineSet,
  client: MatrixClient
) {
  const [target] = createResource(async () => {
    const room = client.getRoom(roomId);
    await room?.loadMembersIfNeeded();
    const timelineEvent = timelineSet.findEventById(eventId);
    if (timelineEvent !== undefined) return timelineEvent;
    const ev = new MatrixEvent(await client.fetchRoomEvent(roomId, eventId));
    if (ev.isEncrypted() && client.getCrypto())
      await ev.attemptDecryption(client.getCrypto() as CryptoBackend);
    return ev;
  });

  return target;
}
