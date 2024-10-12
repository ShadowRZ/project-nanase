import {
  EventTimeline,
  EventType,
  MatrixEvent,
  MRoomTopicEventContent,
  NotificationCountType,
  Room,
  RoomEvent,
  RoomStateEvent,
} from 'matrix-js-sdk';
import { Accessor, createEffect, createResource, onCleanup } from 'solid-js';

export const createRoomInfo = (room: Accessor<Room | undefined>) => {
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
  const [avatar, { refetch: refetchAvatar }] = createResource(
    room,
    ($room) => $room.getMxcAvatarUrl() ?? undefined
  );
  const [unread, { refetch: refetchUnread }] = createResource(
    room,
    ($room) =>
      $room.getRoomUnreadNotificationCount(NotificationCountType.Highlight) ?? 0
  );
  const [maySendMessage, { refetch: refetchMaySendMessage }] = createResource(
    room,
    ($room) => $room.maySendMessage()
  );
  const [encrypted, { refetch: refetchEncrypted }] = createResource(
    room,
    ($room) => $room.hasEncryptionStateEvent()
  );
  const [lastEvent, { refetch: refetchLastEvent }] = createResource(
    room,
    ($room) => $room.getLastLiveEvent()
  );

  const onRoomStateEvent = (event: MatrixEvent): void => {
    if (event.getType() === 'm.room.topic') {
      void refetchTopic();
    }

    if (event.getType() === 'm.room.avatar') {
      void refetchAvatar();
    }

    if (event.getType() === 'm.room.power_levels') {
      void refetchMaySendMessage();
    }

    if (event.getType() === 'm.room.encryption') {
      void refetchEncrypted();
    }
  };

  const onRoomName = (): void => {
    void refetchName();
  };

  const onRoomMembers = (): void => {
    void refetchMembers();
  };

  const onTimeLine = (): void => {
    void refetchLastTs();
    void refetchLastEvent();
  };

  const onUnread = (): void => {
    void refetchUnread();
  };

  createEffect(() => {
    const $room = room();
    $room?.on(RoomEvent.Name, onRoomName);
    $room?.on(RoomEvent.Timeline, onTimeLine);
    $room?.on(RoomStateEvent.Events, onRoomStateEvent);
    $room?.on(RoomStateEvent.Members, onRoomMembers);
    $room?.on(RoomEvent.UnreadNotifications, onUnread);
    onCleanup(() => {
      $room?.off(RoomEvent.Name, onRoomName);
      $room?.off(RoomEvent.Timeline, onTimeLine);
      $room?.off(RoomStateEvent.Events, onRoomStateEvent);
      $room?.off(RoomStateEvent.Members, onRoomMembers);
      $room?.off(RoomEvent.UnreadNotifications, onUnread);
    });
  });

  return {
    name,
    topic,
    avatar,
    members,
    lastEvent,
    lastTs,
    unread,
    encrypted,
    maySendMessage,
  };
};
