import { createEffect, createSignal, onCleanup } from 'solid-js';
import { ClientEvent, type SyncState } from 'matrix-js-sdk';
import { createClientResource } from './createClientResource';
import { useAppContext } from './useAppContext';

export function createClientStatus(id: () => string) {
  const client = createClientResource(id);

  // eslint-disable-next-line @typescript-eslint/ban-types
  const [status, setStatus] = createSignal<SyncState | null>(null);

  const onSync = (state: SyncState) => {
    setStatus(state);
  };

  createEffect(() => {
    const thisClient = client();
    thisClient?.on(ClientEvent.Sync, onSync);
    onCleanup(() => {
      thisClient?.off(ClientEvent.Sync, onSync);
    });
  });

  return status;
}

export function createCurrentClientStatus() {
  const { current } = useAppContext();
  return createClientStatus(current);
}
