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
import { Accessor, createEffect, onCleanup } from 'solid-js';
import { createRefetchMemo } from './createRefetchMemo';

export const createRoomInfo = (room: Accessor<Room | undefined>) => {
  const [name, refetchName] = createRefetchMemo(() => room()?.name);
  const [topic, refetchTopic] = createRefetchMemo(
    () =>
      room()
        ?.getLiveTimeline()
        .getState(EventTimeline.FORWARDS)
        ?.getStateEvents(EventType.RoomTopic, '')
        ?.getContent<MRoomTopicEventContent>().topic
  );
  const [members, refetchMembers] = createRefetchMemo(
    () => room()?.getMembers.length ?? 0
  );
  const [lastTs, refetchLastTs] = createRefetchMemo(() =>
    room()?.getLastActiveTimestamp()
  );
  const [avatar, refetchAvatar] = createRefetchMemo(
    () => room()?.getMxcAvatarUrl() ?? undefined
  );
  const [unread, refetchUnread] = createRefetchMemo(
    () =>
      room()?.getRoomUnreadNotificationCount(NotificationCountType.Highlight) ??
      0
  );
  const [maySendMessage, refetchMaySendMessage] = createRefetchMemo(
    () => room()?.maySendMessage() ?? false
  );
  const [encrypted, refetchEncrypted] = createRefetchMemo(
    () => room()?.hasEncryptionStateEvent() ?? false
  );
  const [lastEvent, refetchLastEvent] = createRefetchMemo(() =>
    room()?.getLastLiveEvent()
  );

  const onRoomStateEvent = (event: MatrixEvent) => {
    if (event.getType() === 'm.room.topic') {
      refetchTopic();
    }

    if (event.getType() === 'm.room.avatar') {
      refetchAvatar();
    }

    if (event.getType() === 'm.room.power_levels') {
      refetchMaySendMessage();
    }

    if (event.getType() === 'm.room.encryption') {
      refetchEncrypted();
    }
  };

  const onRoomName = (): void => {
    refetchName();
  };

  const onRoomMembers = (): void => {
    refetchMembers();
  };

  const onTimeLine = (): void => {
    refetchLastTs();
    refetchLastEvent();
  };

  const onUnread = (): void => {
    refetchUnread();
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
