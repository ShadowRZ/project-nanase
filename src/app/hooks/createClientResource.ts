import { createResource } from 'solid-js';
import { useAppContext } from './useAppContext';

export function createClientResource(id: () => string) {
  const { clients } = useAppContext();

  const [client] = createResource(id, async ($id) => {
    const [, client] = clients.get($id)!;
    return client;
  });

  return client;
}

export function createCurrentClientResource() {
  const { current } = useAppContext();
  return createClientResource(current);
}
