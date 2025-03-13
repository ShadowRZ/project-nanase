import { Room, RoomEvent } from 'matrix-js-sdk';
import { type Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export const createRoomTimeline = (room: Accessor<Room>) => {
  const timelineSet = () => room().getUnfilteredTimelineSet();
  const timeline = () => timelineSet().getLiveTimeline();

  const [signal, refetch] = createSignal(undefined, {
    equals: false,
  });

  const onTimeline = () => {
    refetch();
  };

  const events = () => {
    signal();
    return timeline().getEvents();
  };

  createEffect(() => {
    const $room = room();
    $room.on(RoomEvent.Timeline, onTimeline);
    onCleanup(() => {
      $room.off(RoomEvent.Timeline, onTimeline);
    });
  });

  const scrollback = async () => {
    const client = room().client;
    await client.paginateEventTimeline(timeline(), { backwards: true });
  };

  return { events, scrollback, timelineSet };
};
