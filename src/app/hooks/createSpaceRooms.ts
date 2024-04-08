import { createResource, createEffect, onCleanup } from 'solid-js';
import createRoomList from './createRoomList';
import { RoomListEvents } from '~/lib/client/room-list';

export function createSpaceRoomList(category: () => string) {
  const roomList = createRoomList();

  const [spaceChildrens, { refetch: refetchSpaceChildrens }] = createResource(
    roomList,
    ($roomList) => Object.fromEntries($roomList.spaceChildrens)
  );

  const result = () => spaceChildrens()?.[category()] ?? [];

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

  return result;
}
