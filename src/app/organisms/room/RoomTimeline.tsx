import {
  type Component,
  Show,
  createEffect,
  For,
  on,
  createSignal,
} from 'solid-js';
import { createIntersectionObserver } from '@solid-primitives/intersection-observer';
import { createScrollPosition } from '@solid-primitives/scroll';
import RoomBeginning from './RoomBeginning';
import TimelineItem from '~/app/organisms/timeline/TimelineItem';
import { annoationOrReplace } from '~/app/utils/room';
import { createRoomEvents } from '~/app/hooks/createRoomEvents';
import Placeholder from '~/app/components/placeholder/Placeholder';

type RoomTimelineProps = {
  roomId: string;
};

const RoomTimeline: Component<RoomTimelineProps> = (props) => {
  let endRef!: HTMLDivElement;
  let timelineRef!: HTMLDivElement;
  const roomId = () => props.roomId;
  const { events, timelineSet, paginateBack } = createRoomEvents(roomId);
  const [bottom, setBottom] = createSignal(true);

  createEffect(
    on(events, () => {
      if (bottom())
        endRef.scrollIntoView({
          block: 'end',
          inline: 'nearest',
        });
    })
  );

  createEffect(
    on(roomId, () => {
      endRef.scrollIntoView({
        block: 'end',
        inline: 'nearest',
      });
    })
  );

  createIntersectionObserver(
    () => [endRef],
    (el) => {
      setBottom(el[0].isIntersecting);
    }
  );

  const scroll = createScrollPosition(() => timelineRef);

  createEffect(() => {
    if (scroll.y <= 256 && events()?.at(0)?.getType() !== 'm.room.create')
      paginateBack().catch(() => {});
  });

  return (
    <div
      ref={timelineRef}
      class='relative grow h-full overflow-y-auto flex flex-col'
    >
      <Show when={events()?.at(0)?.getWireType() !== 'm.room.create'}>
        <div class='mt-1 px-2 py-1'>
          <Placeholder />
        </div>
      </Show>
      <Show when={timelineSet() !== undefined}>
        <For each={events()}>
          {(event) => {
            const ev = () => {
              void events();
              return event;
            };

            return (
              <Show when={!annoationOrReplace(ev())}>
                <Show when={event.getWireType() === 'm.room.create'}>
                  <RoomBeginning />
                </Show>
                <TimelineItem
                  event={ev()}
                  roomId={roomId()}
                  timelineSet={timelineSet()!}
                />
              </Show>
            );
          }}
        </For>
        <div ref={endRef} data-project-nanase-timeline-end />
      </Show>
    </div>
  );
};

export default RoomTimeline;
