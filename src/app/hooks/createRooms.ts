import { createEffect, createResource, onCleanup } from 'solid-js';
import createRoomList from './createRoomList';
import { RoomListEvents } from '~/lib/client/RoomList';

export function createRooms() {
  const roomList = createRoomList();

  const [chats, { refetch: refetchChats }] = createResource(
    roomList,
    ($roomList) => Array.from($roomList.rooms)
  );
  const [directs, { refetch: refetchDirects }] = createResource(
    roomList,
    ($roomList) => Array.from($roomList.directs)
  );

  const onRoomList = () => {
    void refetchChats();
    void refetchDirects();
  };

  createEffect(() => {
    const thisRoomList = roomList();
    if (thisRoomList !== undefined) {
      onRoomList();
    }

    thisRoomList?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisRoomList?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return { chats, directs };
}
