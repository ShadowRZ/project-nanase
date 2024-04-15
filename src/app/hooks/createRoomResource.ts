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

  const [name, { refetch: refetchName }] = createResource(
    room,
    ($room) => $room.name as string | undefined
  );
  const [topic, { refetch: refetchTopic }] = createResource(
    room,
    ($room) =>
      $room
        .getLiveTimeline()
        .getState(EventTimeline.FORWARDS)
        ?.getStateEvents(EventType.RoomTopic, '')
        ?.getContent<MRoomTopicEventContent>().topic
  );
  const [members, { refetch: refetchMembers }] = createResource(
    room,
    ($room) => $room.getMembers().length
  );
  const [lastTs, { refetch: refetchLastTs }] = createResource(room, ($room) =>
    $room.getLastActiveTimestamp()
  );
  const [avatar, { refetch: refetchAvatar }] = createResource(room, ($room) =>
    getRoomAvatarUrl($room)
  );
  const [unread, { refetch: refetchUnread }] = createResource(
    room,
    ($room) =>
      $room.getRoomUnreadNotificationCount(NotificationCountType.Highlight) ?? 0
  );

  const onRoomStateEvent = (event: MatrixEvent, _state: RoomState): void => {
    if (event.getType() === 'm.room.topic') {
      void refetchTopic();
    }

    if (event.getType() === 'm.room.avatar') {
      void refetchAvatar();
    }
  };

  const onRoomName = (room: Room): void => {
    void refetchName();
  };

  const onRoomMembers = (_event: MatrixEvent, state: RoomState): void => {
    void refetchMembers();
  };

  const onTimeLine = (event: MatrixEvent): void => {
    void refetchLastTs();
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
