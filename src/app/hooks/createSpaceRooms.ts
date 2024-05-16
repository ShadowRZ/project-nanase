import { createResource, createEffect, onCleanup } from 'solid-js';
import createRoomList from './createRoomList';
import { RoomListEvents } from '~/lib/client/room-list';

export function createSpaceChildrens() {
  const roomList = createRoomList();

  const [spaceChildrens, { refetch: refetchSpaceChildrens }] = createResource(
    roomList,
    ($roomList) => Object.fromEntries($roomList.spaceChildrens)
  );

  const onRoomList = () => {
    void refetchSpaceChildrens();
  };

  createEffect(() => {
    const thisRoomList = roomList();
    thisRoomList?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisRoomList?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return spaceChildrens;
}
