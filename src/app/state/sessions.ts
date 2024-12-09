import { makePersisted } from '@solid-primitives/storage';
import { ClientEvent, MatrixClient, SyncState } from 'matrix-js-sdk';
import { createResource, createSignal } from 'solid-js';
import { initClient, startClient } from '../../lib/client/init';
import * as sm from '../../lib/session-idb';
import { type Session } from '../../types/client';

const [$sessions, { refetch }] = createResource(async () => await sm.values());

const sessions = () => $sessions() ?? [];

// eslint-disable-next-line solid/reactivity
const [current, setCurrent] = makePersisted(createSignal<string>(), {
  storage: localStorage,
  name: 'project-nanase-current-session',
  serialize: (value) => value!,
  deserialize: (value) => value,
});

const cache = new Map<string, MatrixClient>();
const started = new Map<MatrixClient, boolean>();

export const fetchClient = async (session: Session) => {
  if (cache.has(session.userId)) {
    return cache.get(session.userId)!;
  } else {
    const client = await initClient(session);
    cache.set(session.userId, client);

    return client;
  }
};

export const fetchClientStart = async (mx: MatrixClient) => {
  if (started.has(mx) && started.get(mx)) {
    return;
  } else {
    let ok = false;
    if (!mx.clientRunning) await startClient(mx);

    await new Promise<void>((resolve) => {
      const onSync = (state: SyncState) => {
        if (state === SyncState.Prepared) {
          mx.off(ClientEvent.Sync, onSync);
          resolve();
        }
      };

      mx.on(ClientEvent.Sync, onSync);
    });

    ok = true;
    started.set(mx, ok);

    return;
  }
};

export const currentSession = () =>
  sessions().find(($session) => $session.userId === current())!;

export const addSession = (session: Session) => {
  const userId = session.userId;
  void sm.set(userId, session).then(async () => await refetch());
};

export const removeSession = (session: Session) => {
  const userId = session.userId;
  void sm.del(userId).then(async () => await refetch());
};

export const isInitial = () => sessions().length === 0;

export { current, sessions, setCurrent };
