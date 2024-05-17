import { createResource } from 'solid-js';
import { useAppContext } from './useAppContext';

export function createClientResource(id: () => string) {
  const { clients } = useAppContext();

  const session = () => clients.get(id())!;
  const client = () => session().client;

  return client;
}

export const createCurrentClientResource = () => useAppContext().client;

export function createCurrentClientUserId() {
  const { clients, current } = useAppContext();

  const session = () => clients.get(current())!;
  const userId = () => session().userId;

  return userId;
}
