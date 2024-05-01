import {
  type EventTimelineSet,
  type IContent,
  type MatrixEvent,
} from 'matrix-js-sdk';
import createEditedEvent from './createEditedEvent';

export default function createEventInfo<EventContent extends IContent>(
  timelineSet: () => EventTimelineSet,
  event: () => MatrixEvent
) {
  const edited = createEditedEvent(timelineSet, event);
  const content = () =>
    (edited()?.getContent()?.['m.new_content'] as EventContent | undefined) ??
    event().getContent<EventContent>();

  return {
    event,
    edited,
    content,
  };
}
