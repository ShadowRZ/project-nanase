import { createEffect, createResource, onCleanup } from 'solid-js';
import createRoomList from './createRoomList';
import { RoomListEvents } from '~/lib/client/room-list';

export function createSpaceList() {
  const roomList = createRoomList();

  const [spaces, { refetch: refetchSpaces }] = createResource(
    roomList,
    ($roomList) => {
      return [...$roomList.spaceChildrens.keys()];
    }
  );

  const onRoomList = () => {
    void refetchSpaces();
  };

  createEffect(() => {
    const thisRoomList = roomList();
    thisRoomList?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisRoomList?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return spaces;
}
