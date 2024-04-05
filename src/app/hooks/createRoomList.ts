import { createEffect, createMemo, createResource, onCleanup } from 'solid-js';
import { useClientData } from './useClientData';
import { useCurrentClient } from '~/app/hooks/useCurrentClient';
import { RoomListEvents } from '~/lib/client/RoomList';

export function createRoomList() {
  const { roomList } = useClientData();

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
