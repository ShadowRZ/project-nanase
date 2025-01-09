import { createClient, IndexedDBStore, type MatrixClient } from 'matrix-js-sdk';
import { type Session } from '../../types/client';

export const initClient = async (session: Session) => {
  const { baseUrl, accessToken, userId, deviceId } = session;
  const store = new IndexedDBStore({
    indexedDB: globalThis.indexedDB,
    localStorage: globalThis.localStorage,
    dbName: `project-nanase:sync-store:${session.userId}`,
  });

  const mx = createClient({
    baseUrl,
    accessToken,
    userId,
    store,
    deviceId,
    useAuthorizationHeader: true,
    // TODO: Encryption
    cryptoStore: undefined,
    timelineSupport: true,
    verificationMethods: ['m.sas.v1'],
  });

  await store.startup();
  // TODO: Encryption
  mx.setMaxListeners(50);

  return mx;
};

export const startClient = async (mx: MatrixClient) => {
  await mx.startClient({
    lazyLoadMembers: true,
  });
};

export const clearCacheAndReload = async (mx: MatrixClient) => {
  mx.stopClient();
  await mx.store.deleteAllData();
  location.reload();
};

export const logoutClient = async (mx: MatrixClient) => {
  mx.stopClient();
  try {
    await mx.logout();
  } catch {
    // ignore if failed to logout
  }

  await mx.clearStores();
};
