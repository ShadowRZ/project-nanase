import { createClient, IndexedDBStore, type MatrixClient } from 'matrix-js-sdk';
import { type Session } from '~/types/client';

export const initClient = (session: Session) => {
  const { baseUrl, accessToken, userId, deviceId } = session;
  const store = new IndexedDBStore({
    indexedDB: window.indexedDB,
    localStorage: window.localStorage,
    dbName: `project-nanase:${session.userId}:sync-store`,
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
  window.location.reload();
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
