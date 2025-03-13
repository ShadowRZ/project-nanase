import { ContextMenu } from '@hanekokoro-ui/solid';
import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';
import { EventTimelineSet, MatrixEvent, Room } from 'matrix-js-sdk';
import { type Component, For } from 'solid-js';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import CodeDuotone from '~icons/ph/code-duotone';
import EventComponent from '../../components/event-component/EventComponent';
import { createRoomTimeline } from '../../hooks/createRoomTimeline';
import { useSelected } from '../../hooks/useSelected';

const TimelineItem: Component<{
  roomId: string;
  event: MatrixEvent;
  timelineSet: EventTimelineSet;
}> = (rootProps) => {
  const selected = useSelected();

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        disabled={selected()}
        as={styled.div}
        bg={{ _open: 'bg.subtle' }}
        px='2'
        py='1'
        _expanded={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        <EventComponent
          event={rootProps.event}
          roomId={rootProps.roomId}
          timelineSet={rootProps.timelineSet}
        />
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content w='48'>
          <ContextMenu.Item>
            <ArrowBendUpLeftDuotone /> Reply
          </ContextMenu.Item>
          <ContextMenu.Item>
            <CodeDuotone /> Source Code
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};

export const RoomTimeline: Component<{ room: Room }> = (props) => {
  const room = () => props.room;
  const { events, scrollback, timelineSet } = createRoomTimeline(room);

  return (
    <Flex direction='column' overflowY='scroll' mt='auto'>
      <For each={events()}>
        {(event) => (
          <TimelineItem
            event={event}
            roomId={room().roomId}
            timelineSet={timelineSet()}
          />
        )}
      </For>
    </Flex>
  );
};
