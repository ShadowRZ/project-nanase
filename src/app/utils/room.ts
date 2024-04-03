import {
  type MatrixEvent,
  RelationType,
  type EventTimelineSet,
  EventType,
} from 'matrix-js-sdk';

export function annoationOrReplace(event: MatrixEvent) {
  return (
    event.getRelation()?.rel_type === RelationType.Annotation ||
    event.getRelation()?.rel_type === RelationType.Replace
  );
}

export function getEventEdits(
  timelineSet: EventTimelineSet,
  event: MatrixEvent
): MatrixEvent[] {
  const edits = timelineSet.relations.getChildEventsForEvent(
    event.getId()!,
    RelationType.Replace,
    event.getType()
  );

  return edits?.getRelations() ?? [];
}

export function getEventReactions(
  timelineSet: EventTimelineSet,
  event: MatrixEvent
): Array<[string, Set<MatrixEvent>]> {
  const edits = timelineSet.relations.getChildEventsForEvent(
    event.getId()!,
    RelationType.Annotation,
    EventType.Reaction
  );

  return edits?.getSortedAnnotationsByKey() ?? [];
}

export function getEditedEvent(
  timelineSet: EventTimelineSet,
  event: MatrixEvent
): MatrixEvent | undefined {
  return getEventEdits(timelineSet, event)
    .sort((m1, m2) => m2.getTs() - m1.getTs())
    .find((ev) => ev.getSender() === event.getSender());
}

export const isMembershipChanged = (event: MatrixEvent): boolean =>
  event.getContent().membership !== event.getPrevContent().membership ||
  event.getContent().reason !== event.getPrevContent().reason;
