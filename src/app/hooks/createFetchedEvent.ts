import { MatrixEvent } from 'matrix-js-sdk';
import { useMatrixClient } from './useMatrixClient';
import { createAsync } from '@solidjs/router';

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
    const ev = new MatrixEvent(await mx().fetchRoomEvent(roomId(), eventId()));
    await mx().decryptEventIfNeeded(ev);
    return ev;
  });

  return target;
}
