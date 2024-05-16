import { ContextMenu } from '@kobalte/core';
import { type EventTimelineSet, type MatrixEvent } from 'matrix-js-sdk';
import { Show, createSignal, type Component } from 'solid-js';
import Panel from '~/app/atoms/panel/Panel';
import EventComponent from '~/app/components/event-component/EventComponent';
import createMaybeRedactedEvent from '~/app/hooks/createMaybeRedactedEvent';
import ViewSourceDialog from '~/app/organisms/view-source/ViewSourceDialog';
import { type RelationData } from '~/types/room';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import CodeDuotone from '~icons/ph/code-duotone';

type EventProps = {
  roomId: string;
  event: MatrixEvent;
  timelineSet: EventTimelineSet;
  setRelationData?: (rel: RelationData | undefined) => void;
};

const TimelineItem: Component<EventProps> = (props) => {
  const roomId = () => props.roomId;
  const event = createMaybeRedactedEvent(() => props.event, roomId);
  const timelineSet = () => props.timelineSet;
  const canReply = () =>
    !(event().isState() || event().isRedacted() || event().isRedaction());

  const [sourceOpen, setSourceOpen] = createSignal(false);

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          as='div'
          data-project-nanase-roomid={roomId()}
          data-project-nanase-eventid={event().getId()}
          class='ui-expanded:bg-slate-100 dark:ui-expanded:bg-slate-900 px-2 py-1'
        >
          <EventComponent
            roomId={roomId()}
            event={event()}
            timelineSet={timelineSet()}
          />
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <Panel
            decoration='bordered'
            as={ContextMenu.Content}
            class='z-5 animate-popup-close ui-expanded:animate-popup-open overflow-clip'
          >
            <Show when={canReply()}>
              <ContextMenu.Item
                onSelect={() => {
                  props.setRelationData?.({
                    type: 'reply',
                    eventId: event().getId()!,
                  });
                }}
                class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900'
              >
                <ArrowBendUpLeftDuotone /> Reply
              </ContextMenu.Item>
            </Show>
            <ContextMenu.Item
              onSelect={() => {
                setSourceOpen(true);
              }}
              class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900'
            >
              <CodeDuotone /> View Source
            </ContextMenu.Item>
          </Panel>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <ViewSourceDialog
        open={sourceOpen()}
        onOpenChange={setSourceOpen}
        event={event()}
      />
    </>
  );
};

export default TimelineItem;
