import {
  type MatrixEvent,
  RelationType,
  type EventTimelineSet,
  EventType,
  Room,
  EventTimeline,
  KnownMembership,
  Membership,
} from 'matrix-js-sdk';

export const isJoined = (room: Room) =>
  room.getMyMembership() === (KnownMembership.Join as Membership);

export const isValidChildren = (event: MatrixEvent) =>
  event.getType() === 'm.space.child' &&
  Array.isArray(event.getContent<{ via: string[] }>().via);

export const getSpaceChildrens = (room: Room) => {
  const spaceChilds = room
    .getLiveTimeline()
    .getState(EventTimeline.FORWARDS)
    ?.getStateEvents('m.space.child');
  const children = new Set<string>();
  if (spaceChilds)
    for (const event of spaceChilds) {
      const child = event.getStateKey()!;
      // https://github.com/matrix-org/matrix-spec-proposals/pull/1772
      if (isValidChildren(event)) {
        children.add(child);
      }
    }

  return children;
};

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

export const trimReplyFromBody = (body: string): string => {
  const match = /^> <.+?> .+\n(>.*\n)*?\n/m.exec(body);
  if (!match) return body;
  return body.slice(match[0].length);
};

export const trimReplyFromFormattedBody = (formattedBody: string): string => {
  const suffix = '</mx-reply>';
  const i = formattedBody.lastIndexOf(suffix);
  if (i < 0) {
    return formattedBody;
  }

  return formattedBody.slice(i + suffix.length);
};

export const parseReplyBody = (userId: string, body: string) =>
  `> <${userId}> ${body.replaceAll('\n', '\n> ')}\n\n`;

export const parseReplyFormattedBody = (
  roomId: string,
  userId: string,
  eventId: string,
  formattedBody: string
): string => {
  const replyToLink = `<a href="https://matrix.to/#/${encodeURIComponent(
    roomId
  )}/${encodeURIComponent(eventId)}">In reply to</a>`;
  const userLink = `<a href="https://matrix.to/#/${encodeURIComponent(userId)}">${userId}</a>`;

  return `<mx-reply><blockquote>${replyToLink}${userLink}<br />${formattedBody}</blockquote></mx-reply>`;
};
