import {
  EventTimeline,
  EventType,
  NotificationCountType,
  RoomEvent,
  RoomStateEvent,
  type MRoomTopicEventContent,
  type MatrixEvent,
  type Room,
  type RoomState,
} from 'matrix-js-sdk';
import { createEffect, createMemo, createResource, onCleanup } from 'solid-js';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { getRoomAvatarUrl } from '~/lib/utils/matrix';

export const createRoomResource = (roomId: () => string) => {
  const client = createCurrentClientResource();
  const room = createMemo(() => client()?.getRoom(roomId()) ?? undefined);

  const [name, { mutate: mutateName }] = createResource(
    room,
    ($room) => $room.name as string | undefined
  );
  const [topic, { mutate: mutateTopic }] = createResource(
    room,
    ($room) =>
      $room
        .getLiveTimeline()
        .getState(EventTimeline.FORWARDS)
        ?.getStateEvents(EventType.RoomTopic, '')
        ?.getContent<MRoomTopicEventContent>().topic
  );
  const [members, { mutate: mutateMembers }] = createResource(
    room,
    ($room) => $room.getMembers().length
  );
  const [lastTs, { mutate: mutateLastTs }] = createResource(room, ($room) =>
    $room.getLastActiveTimestamp()
  );
  const [avatar, { mutate: mutateAvatar }] = createResource(room, ($room) =>
    getRoomAvatarUrl($room)
  );
  const [unread, { refetch: refetchUnread }] = createResource(
    room,
    ($room) =>
      $room.getRoomUnreadNotificationCount(NotificationCountType.Highlight) ?? 0
  );

  const onRoomStateEvent = (event: MatrixEvent, _state: RoomState): void => {
    if (event.getType() === 'm.room.topic') {
      mutateTopic(event.getContent<MRoomTopicEventContent>().topic);
    }

    if (event.getType() === 'm.room.avatar') {
      mutateAvatar(getRoomAvatarUrl(room()));
    }
  };

  const onRoomName = (room: Room): void => {
    mutateName(room.name);
  };

  const onRoomMembers = (_event: MatrixEvent, state: RoomState): void => {
    mutateMembers(state.getMembers().length);
  };

  const onTimeLine = (event: MatrixEvent): void => {
    mutateLastTs(event.getTs());
  };

  const onUnread = (): void => {
    void refetchUnread();
  };

  createEffect(() => {
    const thisRoom = room();
    thisRoom?.on(RoomEvent.Name, onRoomName);
    thisRoom?.on(RoomEvent.Timeline, onTimeLine);
    thisRoom?.on(RoomStateEvent.Events, onRoomStateEvent);
    thisRoom?.on(RoomStateEvent.Members, onRoomMembers);
    thisRoom?.on(RoomEvent.UnreadNotifications, onUnread);
    onCleanup(() => {
      thisRoom?.off(RoomEvent.Name, onRoomName);
      thisRoom?.off(RoomEvent.Timeline, onTimeLine);
      thisRoom?.off(RoomStateEvent.Events, onRoomStateEvent);
      thisRoom?.off(RoomStateEvent.Members, onRoomMembers);
      thisRoom?.off(RoomEvent.UnreadNotifications, onUnread);
    });
  });

  return {
    name,
    topic,
    avatar,
    members,
    lastTs,
    unread,
  };
};
