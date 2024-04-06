import { createResource } from 'solid-js';
import { useAppContext } from './useAppContext';

export function createClientResource(id: () => string) {
  const { clients } = useAppContext();

  const [client] = createResource(id, async ($id) => {
    const { client } = clients.get($id)!;
    return client;
  });

  return client;
}

export const createCurrentClientResource = () => useAppContext().client;

export function createCurrentClientUserId() {
  const { clients, current } = useAppContext();

  const [userId] = createResource(current, ($current) => {
    const { userId } = clients.get($current)!;
    return userId;
  });

  return userId;
}
