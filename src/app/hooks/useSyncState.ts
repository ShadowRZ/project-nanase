import {
  ClientEvent,
  type ClientEventHandlerMap,
  type MatrixClient,
} from 'matrix-js-sdk';
import { createEffect, onCleanup, type Accessor } from 'solid-js';

export const useSyncState = (
  mx: Accessor<MatrixClient | undefined>,
  onChange: ClientEventHandlerMap[ClientEvent.Sync]
) => {
  createEffect(() => {
    const client = mx();
    client?.on(ClientEvent.Sync, onChange);
    onCleanup(() => {
      client?.removeListener(ClientEvent.Sync, onChange);
    });
  });
};
