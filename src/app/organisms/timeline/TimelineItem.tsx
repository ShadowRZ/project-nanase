import { ContextMenu } from '@kobalte/core/context-menu';
import { type EventTimelineSet, type MatrixEvent } from 'matrix-js-sdk';
import { Show, createSignal, type Component } from 'solid-js';
import Panel from '~/app/atoms/panel/Panel';
import EventComponent from '~/app/components/event-component/EventComponent';
import createMaybeRedactedEvent from '~/app/hooks/createMaybeRedactedEvent';
import ViewSourceDialog from '~/app/organisms/view-source/ViewSourceDialog';
import { type RelationData } from '~/types/room';
import { css } from '~styled/css';
import { flex } from '~styled/patterns';
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
      <ContextMenu>
        <ContextMenu.Trigger
          as='div'
          data-project-nanase-roomid={roomId()}
          data-project-nanase-eventid={event().getId()}
          class={css({ _expanded: { bg: 'mauve.4' }, px: '2', py: '1' })}
        >
          <EventComponent
            roomId={roomId()}
            event={event()}
            timelineSet={timelineSet()}
          />
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content
            decoration='bordered'
            as={Panel}
            class={css({
              zIndex: '5',
              overflow: 'clip',
              animationName: 'popupClose',
              animationDuration: '150ms',
              animationTimingFunction: 'ease-in',
              _expanded: {
                animationName: 'popupOpen',
                animationDuration: '200ms',
                animationTimingFunction: 'ease-out',
              },
            })}
          >
            <Show when={canReply()}>
              <ContextMenu.Item
                onSelect={() => {
                  props.setRelationData?.({
                    type: 'reply',
                    eventId: event().getId()!,
                  });
                }}
                class={flex({
                  direction: 'row',
                  px: '4',
                  py: '2',
                  gap: '2',
                  alignItems: 'center',
                  _hover: {
                    cursor: 'pointer',
                    bg: 'mauve.4',
                  },
                })}
              >
                <ArrowBendUpLeftDuotone /> Reply
              </ContextMenu.Item>
            </Show>
            <ContextMenu.Item
              onSelect={() => {
                setSourceOpen(true);
              }}
              class={flex({
                direction: 'row',
                px: '4',
                py: '2',
                gap: '2',
                alignItems: 'center',
                _hover: {
                  cursor: 'pointer',
                  bg: 'mauve.4',
                },
              })}
            >
              <CodeDuotone /> View Source
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu>
      <ViewSourceDialog
        open={sourceOpen()}
        onOpenChange={setSourceOpen}
        event={event()}
      />
    </>
  );
};

export default TimelineItem;
