import { RoomEvent } from 'matrix-js-sdk';
import {
  createEffect,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';

export const createRoomEvents = (roomId: () => string) => {
  const client = createCurrentClientResource();
  const room = createMemo(() => client()!.getRoom(roomId()) ?? undefined);
  const timelineSet = createMemo(() => room()?.getUnfilteredTimelineSet());
  const timeline = createMemo(() => timelineSet()?.getLiveTimeline());

  const [events, { refetch: refetchEvents }] = createResource(
    timeline,
    ($timeline) => $timeline.getEvents(),
    {
      storage(init) {
        return createSignal(init, { equals: false });
      },
    }
  );

  const paginateBack = async () => {
    await room()?.loadMembersIfNeeded();
    const thisTimeline = timeline();
    if (thisTimeline !== undefined) {
      await client()?.paginateEventTimeline(thisTimeline, {
        backwards: true,
        limit: 10,
      });
      await refetchEvents();
    }
  };

  const onTimeLine = () => {
    void refetchEvents();
  };

  createEffect(() => {
    const thisRoom = room();
    if (thisRoom !== undefined) {
      void refetchEvents();
    }

    thisRoom?.on(RoomEvent.Timeline, onTimeLine);
    thisRoom?.on(RoomEvent.LocalEchoUpdated, onTimeLine);
    onCleanup(() => {
      thisRoom?.off(RoomEvent.Timeline, onTimeLine);
      thisRoom?.off(RoomEvent.LocalEchoUpdated, onTimeLine);
    });
  });

  return { events, timelineSet, paginateBack };
};
