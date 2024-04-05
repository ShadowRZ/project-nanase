import type { MatrixClient as BaseMatrixClient, User } from 'matrix-js-sdk';
import * as sdk from 'matrix-js-sdk';
import { logger } from 'matrix-js-sdk/lib/logger';
import RoomList, {
  RoomListEvents,
  type RoomListEventsHandlerMap,
} from './RoomList';
import { type SessionData } from '~/types/client';

logger.disableAll();

export enum ClientEvents {
  Started = 'MatrixClient.Started',
  SyncState = 'MatrixClient.SyncState',
}

export type ClientEventsHandlerMap = {
  [ClientEvents.Started]: () => void;
  [ClientEvents.SyncState]: (state: sdk.SyncState) => void;
};

export function createNewSessionId(): string {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
}

/**
 * A wrapper against {@link sdk.MatrixClient}.
 */
export class MatrixClient extends sdk.TypedEventEmitter<
  ClientEvents | RoomListEvents,
  ClientEventsHandlerMap & RoomListEventsHandlerMap
> {
  public done = false;
  public readonly id: string;
  public readonly userId: string;
  private holdClient?: BaseMatrixClient;
  private readonly homeserver: string;
  private readonly accessToken: string;
  private readonly deviceId?: string;
  private user!: User;
  private clientRooms?: RoomList;
  private startPromise?: Promise<void>;
  private profilePromise?: Promise<{
    displayname?: string;
    avatar_url?: string;
  }>;

  /**
   * Gets the holding client.
   * **Only vaild if {@link wait()} returns.**
   */
  public get client(): BaseMatrixClient {
    return this.holdClient!;
  }

  /**
   * Gets the room list.
   * **Only vaild if {@link wait()} returns.**
   */
  public get roomList(): RoomList {
    return this.clientRooms!;
  }

  // eslint-disable-next-line max-params
  constructor(
    homeserver: string,
    accessToken: string,
    userId: string,
    id?: string,
    deviceId?: string
  ) {
    super();
    this.id = id ?? createNewSessionId();
    this.homeserver = homeserver;
    this.accessToken = accessToken;
    this.userId = userId;
    this.deviceId = deviceId;
  }

  public async start() {
    if (this.holdClient !== undefined) {
      return;
    }

    await this.startClient();
    this.setupSync();
  }

  public async startAndWait() {
    await this.start();
    await this.wait();
  }

  public async wait() {
    if (!this.done) {
      if (this.startPromise === undefined)
        this.startPromise = new Promise<void>((resolve) => {
          this.once(ClientEvents.Started, () => {
            resolve();
          });
        });
      await this.startPromise;
    }
  }

  async startClient() {
    // TODO: Proper persistence
    // const store = new sdk.IndexedDBStore({
    //   indexedDB: window.indexedDB,
    //   localStorage: window.localStorage,
    //   dbName: `project-nanase:${this.id}:sync-store`
    // })
    // await store.startup()
    const store = new sdk.MemoryStore();
    await store.startup();
    // TODO: Encryption
    // const cryptoStore = new sdk.IndexedDBCryptoStore(
    //   global.indexedDB,
    //   `project-nanase:${this.id}:crypto-store`
    // );

    this.holdClient = sdk.createClient({
      baseUrl: this.homeserver,
      accessToken: this.accessToken,
      userId: this.userId,
      store,
      useAuthorizationHeader: true,
      deviceId: this.deviceId,
      // TODO: Encryption
      cryptoStore: undefined,
      timelineSupport: true,
    });
    // TODO: Encryption
    // await this.matrixClient.initCrypto()
    await this.holdClient.startClient({
      lazyLoadMembers: true,
    });
    // This.#client.setGlobalErrorOnUnknownDevices(false)
  }

  public async profileSnapshot(): Promise<{
    displayName?: string;
    avatarUrl?: string;
    user: User;
  }> {
    await this.wait();
    if (this.profilePromise === undefined)
      this.profilePromise = this.client.getProfileInfo(this.userId);
    const resp = await this.profilePromise;
    return {
      displayName: resp.displayname,
      avatarUrl: this.mxcUrlToHttp(resp.avatar_url),
      user: this.user,
    };
  }

  public sessionData(): SessionData {
    return {
      homeserver: this.homeserver,
      accessToken: this.accessToken,
      id: this.id,
      userId: this.userId,

      deviceId: this.client.getDeviceId()!,
    };
  }

  setupSync() {
    this.client.on(sdk.ClientEvent.Sync, (state, prev) => {
      this.emit(ClientEvents.SyncState, state);
      // eslint-disable-next-line default-case
      switch (state) {
        case sdk.SyncState.Prepared: {
          console.log(`=> User ID: ${this.userId} State: ${state}`);
          console.log('   Previous State:', prev);
          if (prev === null) {
            this.setupState();
            this.emit(ClientEvents.Started);
            this.done = true;
          }

          break;
        }

        case sdk.SyncState.Error: {
          console.log(`=> User ID: ${this.userId} State: ${state}`);
          break;
        }

        case sdk.SyncState.Catchup: {
          console.log(`=> User ID: ${this.userId} State: ${state}`);
          break;
        }

        case sdk.SyncState.Syncing: {
          break;
        }

        case sdk.SyncState.Reconnecting: {
          console.log(`=> User ID: ${this.userId} State: ${state}`);
          break;
        }

        case sdk.SyncState.Stopped: {
          console.log(`=> User ID: ${this.userId} State: ${state}`);
          break;
        }
      }
    });
  }

  public async logout(): Promise<void> {
    this.client.stopClient();
    try {
      await this.client.logout();
    } catch {
      // Ignore failed logout, clean anyway
    }

    await this.client.clearStores();
  }

  public mxcUrlToHttp(mxcUrl?: string) {
    if (mxcUrl === undefined) return undefined;
    return this.client.mxcUrlToHttp(mxcUrl) ?? undefined;
  }

  private setupState(): void {
    // By the time we are prepared we should be able to get info for ourselves.
    this.user = this.client.getUser(this.client.getSafeUserId())!;
    this.clientRooms = new RoomList(this.client);
    this.clientRooms.on(RoomListEvents.ListUpdated, this.emitRoomEvents);
  }

  private emitRoomEvents() {
    this.emit(RoomListEvents.ListUpdated);
  }
}
