import { createEffect, createResource, onCleanup } from 'solid-js';
import createRoomList from './createRoomList';
import { RoomListEvents } from '~/lib/client/room-list';

export function createRooms() {
  const roomList = createRoomList();

  const [chats, { refetch: refetchChats }] = createResource(
    roomList,
    ($roomList) => [...$roomList.rooms]
  );
  const [directs, { refetch: refetchDirects }] = createResource(
    roomList,
    ($roomList) => [...$roomList.directs]
  );

  const onRoomList = () => {
    void refetchChats();
    void refetchDirects();
  };

  createEffect(() => {
    const thisRoomList = roomList();
    thisRoomList?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisRoomList?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return { chats, directs };
}
