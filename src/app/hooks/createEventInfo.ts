import {
  EventStatus,
  MatrixEventEvent,
  type EventTimelineSet,
  type IContent,
  type MatrixEvent,
} from 'matrix-js-sdk';
import { createEffect, createResource, onCleanup } from 'solid-js';
import createEditedEvent from './createEditedEvent';

export default function createEventInfo<EventContent extends IContent>(
  timelineSet: () => EventTimelineSet,
  event: () => MatrixEvent
) {
  const edited = createEditedEvent(timelineSet, event);
  const content = () =>
    (edited()?.getContent()?.['m.new_content'] as EventContent | undefined) ??
    event().getContent<EventContent>();

  const [status, { refetch: refetchStatus }] = createResource(
    event,
    ($event) => $event.status
  );

  const sending = () => status() === EventStatus.SENDING;
  const msgtype = () => content().msgtype;

  const fn = () => {
    void refetchStatus();
  };

  createEffect(() => {
    const thisEvent = event();
    thisEvent.on(MatrixEventEvent.Status, fn);
    onCleanup(() => {
      thisEvent.off(MatrixEventEvent.Status, fn);
    });
  });

  return {
    event,
    edited,
    content,
    sending,
    msgtype,
  };
}
