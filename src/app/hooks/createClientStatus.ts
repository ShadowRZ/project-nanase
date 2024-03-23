import { createEffect, createSignal, onCleanup } from 'solid-js';
import { type SyncState } from 'matrix-js-sdk';
import { useClientsController } from './useClientsController';
import { ClientEvents } from '~/lib/client/MatrixClient';

export default function createClientStatus(id: () => string) {
  const controller = useClientsController();
  const client = () => controller()?.getClient(id());

  // eslint-disable-next-line @typescript-eslint/ban-types
  const [status, setStatus] = createSignal<SyncState | null>(null);

  const onSync = (state: SyncState) => {
    setStatus(state);
  };

  createEffect(() => {
    const thisClient = client();
    thisClient?.on(ClientEvents.SyncState, onSync);
    onCleanup(() => {
      thisClient?.off(ClientEvents.SyncState, onSync);
    });
  });

  return status;
}
