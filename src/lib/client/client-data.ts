import {
  type MatrixClient,
  MemoryStore,
  createClient,
  ClientEvent,
  SyncState,
} from 'matrix-js-sdk';
import RoomList from './RoomList';

export default function createClientData(
  homeserver: string,
  accessToken: string,
  userId: string,
  deviceId?: string
) {
  const clientPromiseFn = async (
    baseUrl: string,
    accessToken: string,
    userId: string,
    deviceId?: string
  ) => {
    // TODO: Proper persistence
    // const store = new IndexedDBStore({
    //   indexedDB: window.indexedDB,
    //   localStorage: window.localStorage,
    //   dbName: `project-nanase:${this.id}:sync-store`
    // })
    // await store.startup()
    const store = new MemoryStore();
    await store.startup();
    // TODO: Encryption
    // const cryptoStore = new IndexedDBCryptoStore(
    //   window.indexedDB,
    //   `project-nanase:${this.id}:crypto-store`
    // );

    const client = createClient({
      baseUrl,
      accessToken,
      userId,
      store,
      deviceId,
      useAuthorizationHeader: true,
      // TODO: Encryption
      cryptoStore: undefined,
      timelineSupport: true,
    });
    // TODO: Encryption
    // await this.matrixClient.initCrypto()
    await client.startClient({
      lazyLoadMembers: true,
    });
    // TODO
    // client.setGlobalErrorOnUnknownDevices(false)

    await new Promise<void>((resolve) => {
      if (client.isInitialSyncComplete()) resolve();
      else
        client.once(ClientEvent.Sync, (state) => {
          if (state === SyncState.Prepared) resolve();
        });
    });

    return client;
  };

  const returnFn = (
    baseUrl: string,
    accessToken: string,
    userId: string,
    deviceId?: string
  ): [string, Promise<MatrixClient>, Promise<RoomList>] => {
    const client = clientPromiseFn(baseUrl, accessToken, userId, deviceId);
    const roomListPromise = client.then((client) => new RoomList(client));

    return [userId, client, roomListPromise];
  };

  return returnFn(homeserver, accessToken, userId, deviceId);
}
