import {
  type MatrixClient,
  MemoryStore,
  createClient,
  ClientEvent,
  SyncState,
} from 'matrix-js-sdk';
import RoomList from './room-list';
import { type ClientContext } from '~/types/client';

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
  ): Promise<[MatrixClient, Promise<void>]> => {
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

    const wait = new Promise<void>((resolve) => {
      if (client.isInitialSyncComplete()) resolve();
      else
        client.once(ClientEvent.Sync, (state) => {
          if (state === SyncState.Prepared) resolve();
        });
    });

    return [client, wait];
  };

  const roomListFn = async (
    waitClient: Promise<[MatrixClient, Promise<void>]>
  ) => {
    const [client, wait] = await waitClient;
    await wait;

    return new RoomList(client);
  };

  const clientFn = async (
    waitClient: Promise<[MatrixClient, Promise<void>]>
  ) => {
    const [client] = await waitClient;
    return client;
  };

  const waitFn = async (waitClient: Promise<[MatrixClient, Promise<void>]>) => {
    const [, wait] = await waitClient;
    await wait;
  };

  const returnFn = (
    baseUrl: string,
    accessToken: string,
    userId: string,
    deviceId?: string
  ): ClientContext => {
    const waitClient = clientPromiseFn(baseUrl, accessToken, userId, deviceId);
    const client = clientFn(waitClient);
    const wait = waitFn(waitClient);
    const roomList = roomListFn(waitClient);

    return {
      userId,
      client,
      wait,
      roomList,
    };
  };

  return returnFn(homeserver, accessToken, userId, deviceId);
}
