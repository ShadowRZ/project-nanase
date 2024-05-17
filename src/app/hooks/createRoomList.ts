import { createResource } from 'solid-js';
import { useAppContext } from './useAppContext';

export default function createRoomList() {
  const { clients, current } = useAppContext();

  const session = () => clients.get(current())!;

  const [roomList] = createResource(session, async ($session) => {
    return $session.roomList();
  });

  return roomList;
}
