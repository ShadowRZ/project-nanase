import { createEffect, createResource, onCleanup } from 'solid-js';
import createRoomList from './createRoomList';
import { RoomListEvents } from '~/lib/client/RoomList';

export function createSpaceList() {
  const roomList = createRoomList();

  const [spaces, { refetch: refetchSpaces }] = createResource(
    roomList,
    ($roomList) => {
      return Array.from($roomList.spaceChildrens.keys());
    }
  );

  const onRoomList = () => {
    void refetchSpaces();
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

  return spaces;
}
