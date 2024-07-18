import { createIntersectionObserver } from '@solid-primitives/intersection-observer';
import { Key } from '@solid-primitives/keyed';
import { createScrollPosition } from '@solid-primitives/scroll';
import { Show, createEffect, createSignal, on, type Component } from 'solid-js';
import { type EventTimelineSet } from 'matrix-js-sdk';
import RoomBeginning from './RoomBeginning';
import Placeholder from '~/app/components/placeholder/Placeholder';
import { createRoomEvents } from '~/app/hooks/createRoomEvents';
import TimelineItem from '~/app/organisms/timeline/TimelineItem';
import { annoationOrReplace } from '~/app/utils/room';
import { type RelationData } from '~/types/room';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { Box, Flex } from '~styled/jsx';

type RoomTimelineProps = {
  roomId: string;
  timelineSet: EventTimelineSet;
  setRelationData: (rel: RelationData | undefined) => void;
};

const RoomTimeline: Component<RoomTimelineProps> = (props) => {
  let endRef!: HTMLDivElement;
  let timelineRef!: HTMLDivElement;
  const client = createCurrentClientResource();
  const roomId = () => props.roomId;
  const timelineSet = () => props.timelineSet;
  const { events, paginateBack } = createRoomEvents(client, timelineSet);
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
    <Flex
      ref={timelineRef}
      direction='column'
      position='relative'
      grow='1'
      overflowY='auto'
      h='full'
    >
      <Show when={events()?.at(0)?.getWireType() !== 'm.room.create'}>
        <Box mt='1' px='2' py='1'>
          <Placeholder />
        </Box>
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
                  timelineSet={timelineSet()}
                  setRelationData={props.setRelationData}
                />
              </Show>
            );
          }}
        </Key>
        <div ref={endRef} data-project-nanase-timeline-end />
      </Show>
    </Flex>
  );
};

export default RoomTimeline;
