import { createResource, createEffect, onCleanup } from 'solid-js';
import { useClientData } from './useClientData';
import { RoomListEvents } from '~/lib/client/RoomList';

export function createSpaceRoomList(category: () => string) {
  const { roomList } = useClientData();

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
    if (thisRoomList !== undefined) {
      onRoomList();
    }

    thisRoomList?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisRoomList?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return result;
}
