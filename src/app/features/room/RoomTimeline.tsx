import { Menu } from '@/components/ui/menu';
import { EventTimelineSet, MatrixEvent, Room } from 'matrix-js-sdk';
import { Component, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import CodeDuotone from '~icons/ph/code-duotone';
import { Flex, styled } from '~styled/jsx';
import EventComponent from '../../components/event-component/EventComponent';
import { createRoomTimeline } from '../../hooks/createRoomTimeline';

const TimelineItem: Component<{
  roomId: string;
  event: MatrixEvent;
  timelineSet: EventTimelineSet;
}> = (rootProps) => {
  return (
    <Menu.Root>
      <Menu.Context>
        {(context) => (
          <Menu.ContextTrigger.AsChild>
            {(props) => (
              <styled.div
                {...props()}
                style={{
                  'user-select': context().open ? 'none' : undefined,
                  '-webkit-user-select': context().open ? 'none' : undefined,
                  '-webkit-touch-callout': context().open ? 'none' : undefined,
                }}
                data-state={context().open ? 'open' : 'closed'}
                bg={{ _open: 'bg.subtle' }}
                px='2'
                py='1'
              >
                <EventComponent
                  event={rootProps.event}
                  roomId={rootProps.roomId}
                  timelineSet={rootProps.timelineSet}
                />
              </styled.div>
            )}
          </Menu.ContextTrigger.AsChild>
        )}
      </Menu.Context>
      <Portal>
        <Menu.Positioner>
          <Menu.Content w='48'>
            <Menu.Item value='reply'>
              <ArrowBendUpLeftDuotone /> Reply
            </Menu.Item>
            <Menu.Item value='source'>
              <CodeDuotone /> Source Code
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export const RoomTimeline: Component<{ room: Room }> = (props) => {
  const room = () => props.room;
  const { events, scrollback, timelineSet } = createRoomTimeline(room);

  return (
    <Flex direction='column' overflow='scroll'>
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
