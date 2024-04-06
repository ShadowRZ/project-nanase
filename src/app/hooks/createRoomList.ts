import { createResource } from 'solid-js';
import { useAppContext } from './useAppContext';

export default function createRoomList() {
  const { clients, current } = useAppContext();

  const [roomList] = createResource(current, async ($current) => {
    const { roomList } = clients.get($current)!;
    return roomList;
  });

  return roomList;
}
