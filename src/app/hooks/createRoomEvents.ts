import {
  type EventTimelineSet,
  RoomEvent,
  type MatrixClient,
} from 'matrix-js-sdk';
import {
  createEffect,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js';

export const createRoomEvents = (
  client: () => MatrixClient,
  timelineSet: () => EventTimelineSet
) => {
  const [events, { refetch: refetchEvents }] = createResource(
    timelineSet,
    ($timelineSet) => $timelineSet.getLiveTimeline().getEvents(),
    {
      storage(init) {
        // eslint-disable-next-line solid/reactivity
        return createSignal(init, { equals: false });
      },
    }
  );

  const paginateBack = async () => {
    const thisTimelineSet = timelineSet();
    if (thisTimelineSet !== undefined) {
      await client()?.paginateEventTimeline(thisTimelineSet.getLiveTimeline(), {
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
    const thisTimelineSet = timelineSet();
    if (thisTimelineSet !== undefined) {
      void refetchEvents();
    }

    thisTimelineSet?.on(RoomEvent.Timeline, onTimeLine);
    onCleanup(() => {
      thisTimelineSet?.off(RoomEvent.Timeline, onTimeLine);
    });
  });

  return { events, paginateBack };
};
