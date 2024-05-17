import {
  IndexedDBStore,
  type MatrixEvent,
  TypedEventEmitter,
  type User,
  UserEvent,
  createClient,
  type IndexedDBCryptoStore,
  type LocalStorageCryptoStore,
  type MatrixClient,
  type MemoryCryptoStore,
  type MemoryStore,
} from 'matrix-js-sdk';
import RoomList from './room-list';
import { type SessionData } from '~/lib/auth';
import cons from '~/lib/cons';
import { type ClientDataList } from '~/types/client';

export enum SessionEvents {
  ClientLogout = 'SessionEvents.Logout',
  StorePrepared = 'SessionEvents.StorePrepared',
  ProfileUpdated = 'SessionEvents.ProfileUpdated',
}

export type SessionEventsHandlerMap = {
  [SessionEvents.ClientLogout]: (softLogout: boolean) => void;
  [SessionEvents.StorePrepared]: () => void;
  [SessionEvents.ProfileUpdated]: (
    displayName?: string,
    avatarUrl?: string
  ) => void;
};

export class Session extends TypedEventEmitter<
  SessionEvents,
  SessionEventsHandlerMap
> {
  public readonly client: MatrixClient;
  public readonly userId: string;

  private user?: User;
  // IndexedDBStore extends MemoryStore
  private readonly store: MemoryStore;
  // TODO: Encryption
  private readonly cryptoStore!:
    | IndexedDBCryptoStore
    | LocalStorageCryptoStore
    | MemoryCryptoStore;

  private roomList_?: RoomList;

  // eslint-disable-next-line max-params
  constructor(
    id: string,
    baseUrl: string,
    accessToken: string,
    userId: string,
    deviceId?: string
  ) {
    super();
    this.userId = userId;

    const store = new IndexedDBStore({
      indexedDB: window.indexedDB,
      localStorage: window.localStorage,
      dbName: `project-nanase:${id}:sync-store`,
    });
    this.store = store;

    this.client = createClient({
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
  }

  public async start() {
    await this.store.startup();
    // TODO: Encryption
    // await this.client.initCrypto();
    // this.client.setGlobalErrorOnUnknownDevices(false);
    this.client
      .getProfileInfo(this.userId)
      .then((profile) => {
        this.emit(
          SessionEvents.ProfileUpdated,
          profile.displayname,
          profile.avatar_url
        );
      })
      .then(() => {
        this.user = this.client.getUser(this.userId) ?? undefined;
        this.user?.on(UserEvent.DisplayName, this.onProfile);
      })
      .catch((error) => {
        console.error(error);
      });
    this.client
      .startClient({
        lazyLoadMembers: true,
      })
      .catch(() => {});

    this.roomList_ = new RoomList(this.client);
    this.emit(SessionEvents.StorePrepared);
  }

  public async roomList() {
    if (this.roomList_ === undefined) {
      return new Promise<RoomList>((resolve, reject) => {
        this.once(SessionEvents.StorePrepared, () => {
          resolve(this.roomList_!);
        });
      });
    }

    return this.roomList_;
  }

  private onProfile(_event: MatrixEvent | undefined, user: User) {
    this.emit(SessionEvents.ProfileUpdated, user.displayName, user.avatarUrl);
  }
}

export enum SessionListEvents {
  ListUpdated = 'SessionListEvents.ListUpdated',
  ClientLogout = 'SessionListEvents.ClientLogout',
  ProfileUpdated = 'SessionListEvents.ProfileUpdated',
}

export type SessionListEventsHandlerMap = {
  [SessionListEvents.ListUpdated]: () => void;
  [SessionListEvents.ClientLogout]: (id: string, softLogout: boolean) => void;
  [SessionListEvents.ProfileUpdated]: (
    id: string,
    displayName?: string,
    avatarUrl?: string
  ) => void;
};

type ProfileUpdatedCallback = (
  displayName?: string,
  avatarUrl?: string
) => void;

export class SessionList extends TypedEventEmitter<
  SessionListEvents,
  SessionListEventsHandlerMap
> {
  static isInitial() {
    const stored = localStorage.getItem(cons.internal.storage.SESSIONS_TOKEN);
    if (stored === null) return true;
    return (JSON.parse(stored) as ClientDataList).length === 0;
  }

  static populateClientData(data: SessionData): void {
    const id = SessionList.storeClientData(data);
    localStorage.setItem(cons.internal.storage.CURRENT_TOKEN, id);
  }

  static storeClientData(data: SessionData): string {
    const stored =
      localStorage.getItem(cons.internal.storage.SESSIONS_TOKEN) ?? '[]';
    const sessions = JSON.parse(stored) as ClientDataList;
    const id = SessionList.createNewSessionId();
    sessions.push({
      accessToken: data.access_token,
      homeserver: data.homeserver,
      userId: data.user_id,
      deviceId: data.device_id,
      id,
    });
    localStorage.setItem(
      cons.internal.storage.SESSIONS_TOKEN,
      JSON.stringify(sessions)
    );
    return id;
  }

  public static fromLocalStorage() {
    const current = localStorage.getItem(cons.internal.storage.CURRENT_TOKEN);
    if (current === null) return undefined;
    const stored = localStorage.getItem(cons.internal.storage.SESSIONS_TOKEN);
    if (stored === null) return undefined;
    const clients = new Map<string, Session>();

    const data = JSON.parse(stored) as ClientDataList;

    for (const item of data) {
      const client = new Session(
        item.id,
        item.homeserver,
        item.accessToken,
        item.userId,
        item.deviceId
      );
      clients.set(item.id, client);
    }

    return new SessionList(clients, current);
  }

  private static createNewSessionId(): string {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString();
  }

  public clients = new Map<string, Session>();
  public readonly current: string;

  private readonly callbackMaps = new Map<string, ProfileUpdatedCallback>();

  private constructor(clients: Map<string, Session>, current: string) {
    super();
    this.clients = clients;
    this.current = current;
    for (const [id, session] of clients) {
      const fn = (displayName?: string, avatarUrl?: string) => {
        this.emit(SessionListEvents.ProfileUpdated, id, displayName, avatarUrl);
      };

      session.on(SessionEvents.ProfileUpdated, fn);
      this.callbackMaps.set(id, fn);
    }
  }

  public startAll() {
    for (const [, session] of this.clients) {
      session.start().catch(() => {});
    }
  }
}
