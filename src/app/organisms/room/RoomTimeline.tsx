import { createIntersectionObserver } from '@solid-primitives/intersection-observer';
import { Key } from '@solid-primitives/keyed';
import { createScrollPosition } from '@solid-primitives/scroll';
import { Show, createEffect, createSignal, on, type Component } from 'solid-js';
import RoomBeginning from './RoomBeginning';
import Placeholder from '~/app/components/placeholder/Placeholder';
import { createRoomEvents } from '~/app/hooks/createRoomEvents';
import TimelineItem from '~/app/organisms/timeline/TimelineItem';
import { annoationOrReplace } from '~/app/utils/room';
import { type RelationData } from '~/types/room';

type RoomTimelineProps = {
  roomId: string;
  setRelationData: (rel: RelationData | undefined) => void;
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
        <Key each={events()} by={(event) => event.getId()}>
          {(event) => {
            return (
              <Show when={!annoationOrReplace(event())}>
                <Show when={event().getWireType() === 'm.room.create'}>
                  <RoomBeginning />
                </Show>
                <TimelineItem
                  event={event()}
                  roomId={roomId()}
                  timelineSet={timelineSet()!}
                  setRelationData={props.setRelationData}
                />
              </Show>
            );
          }}
        </Key>
        <div ref={endRef} data-project-nanase-timeline-end />
      </Show>
    </div>
  );
};

export default RoomTimeline;
