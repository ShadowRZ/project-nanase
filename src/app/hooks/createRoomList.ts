import { createEffect, createMemo, createResource, onCleanup } from 'solid-js';
import { useCurrentClient } from '~/app/hooks/useCurrentClient';
import { RoomListEvents } from '~/lib/client/RoomList';

export function createRoomList(category: () => 'chats' | 'directs' | string) {
  const client = useCurrentClient();
  const source = createMemo(() => {
    return {
      client: client(),
      category: category(),
    };
  });
  const [rooms, { refetch: refetchRooms }] = createResource(
    source,
    async ($source) => {
      const { client, category } = $source;
      if (client === undefined) return [];
      await client.wait();
      switch (category) {
        case 'chats': {
          return Array.from(client.roomList.rooms);
        }

        case 'directs': {
          return Array.from(client.roomList.directs);
        }

        default: {
          return client.roomList.spaceChildrens.get(category) ?? [];
        }
      }
    }
  );

  const onRoomList = () => {
    void refetchRooms();
  };

  createEffect(() => {
    const thisClient = client();
    if (thisClient !== undefined) {
      void refetchRooms();
    }

    thisClient?.on(RoomListEvents.ListUpdated, onRoomList);
    onCleanup(() => {
      thisClient?.off(RoomListEvents.ListUpdated, onRoomList);
    });
  });

  return rooms;
}
