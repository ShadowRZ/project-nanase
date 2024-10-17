import { Room } from 'matrix-js-sdk';
import { Component, For } from 'solid-js';
import { Flex } from '~styled/jsx';
import EventComponent from '../../components/event-component/EventComponent';
import { createRoomTimeline } from '../../hooks/createRoomTimeline';

export const RoomTimeline: Component<{ room: Room }> = (props) => {
  const room = () => props.room;
  const { events, scrollback, timelineSet } = createRoomTimeline(room);

  return (
    <Flex direction='column' overflow='scroll' p='1'>
      <For each={events()}>
        {(event) => (
          <EventComponent
            event={event}
            roomId={room().roomId}
            timelineSet={timelineSet()}
          />
        )}
      </For>
    </Flex>
  );
};
