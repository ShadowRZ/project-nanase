import {
  MatrixEventEvent,
  RelationType,
  type EventTimelineSet,
  type MatrixEvent,
} from 'matrix-js-sdk';
import { createEffect, createResource, onCleanup } from 'solid-js';

export default function createEditedEvent(
  timelineSet: () => EventTimelineSet,
  event: () => MatrixEvent
) {
  const [edited, { refetch }] = createResource(
    (): [EventTimelineSet, MatrixEvent] => [timelineSet(), event()],
    ([$timelineSet, $event]) => {
      const edits = $timelineSet.relations.getChildEventsForEvent(
        $event.getId()!,
        RelationType.Replace,
        $event.getType()
      );

      const relations = edits?.getRelations() ?? [];

      return relations
        .sort((m1, m2) => m2.getTs() - m1.getTs())
        .find((ev) => ev.getSender() === $event.getSender());
    }
  );

  const fn = () => {
    void refetch();
  };

  createEffect(() => {
    const thisEvent = event();
    thisEvent.on(MatrixEventEvent.Replaced, fn);
    onCleanup(() => {
      thisEvent.off(MatrixEventEvent.Replaced, fn);
    });
  });

  return edited;
}
