import { MatrixEvent } from 'matrix-js-sdk';
import { useMatrixClient } from './useMatrixClient';
import { createAsync } from '@solidjs/router';
import to from 'await-to-js';

export function createFetchedEvent(
  roomId: () => string,
  eventId: () => string
) {
  const mx = useMatrixClient();
  const room = () => mx().getRoom(roomId());
  const timelineSet = () => room()?.getUnfilteredTimelineSet();

  const target = createAsync(async () => {
    const $room = room();
    if ($room === null) return;
    await $room.loadMembersIfNeeded();
    const timelineEvent = timelineSet()!.findEventById(eventId());
    if (timelineEvent !== undefined) return timelineEvent;
    const [err, ok] = await to(mx().fetchRoomEvent(roomId(), eventId()));
    if (err) {
      console.error(
        `Failed to find event ${eventId()} in ${roomId()}:`,
        err.message
      );
      return;
    }
    const ev = new MatrixEvent(ok);
    await mx().decryptEventIfNeeded(ev);
    return ev;
  });

  return target;
}
