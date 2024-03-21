import { createEffect, createResource, onCleanup } from 'solid-js';
import { useCurrentClient } from '~/app/hooks/useCurrentClient';
import { RoomListEvents } from '~/lib/client/RoomList';

export function createSpaceList() {
  const client = useCurrentClient();
  const [spaces, { refetch: refetchSpaces }] = createResource(
    client,
    async ($client) => {
      await $client.wait();
      return Array.from($client.roomList.spaceChildrens.keys());
    }
  );

  const onRoomList = () => {
    void refetchSpaces();
  };

  createEffect(() => {
    const thisClient = client();
    if (thisClient !== undefined) {
      void refetchSpaces();
    }

    thisClient?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisClient?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return spaces;
}
