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
