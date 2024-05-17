import { ClientEvent, SyncState, type MatrixClient } from 'matrix-js-sdk';

export function useClientPreparedCallback(
  client: MatrixClient,
  callback: (client: MatrixClient) => void
) {
  const fn = (state: SyncState) => {
    if (state === SyncState.Prepared) {
      callback(client);
    }

    client.off(ClientEvent.Sync, fn);
  };

  client.on(ClientEvent.Sync, fn);
}
