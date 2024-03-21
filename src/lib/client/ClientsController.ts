import { TypedEventEmitter } from 'matrix-js-sdk';
import { MatrixClient, createNewSessionId } from './MatrixClient';
import { type ClientDatas as ClientSessions } from '~/types/client';
import { type ClientData } from '~/lib/auth';

const PROJECT_NANASE_SESSIONS_TOKEN = 'project-nanase-sessions';
const PROJECT_NANASE_CURRENT_TOKEN = 'project-nanase-current-session';

export enum ControllerEvents {
  ClientsUpdated = 'ControllerEvents.ClientsUpdated',
  ClientChanged = 'ControllerEvents.ClientChanged',
}

export type ControllerEventsHandlerMap = {
  [ControllerEvents.ClientsUpdated]: (ids: string[]) => void;
  [ControllerEvents.ClientChanged]: (
    prev: MatrixClient,
    next: MatrixClient
  ) => void;
};

export default class ClientsController extends TypedEventEmitter<
  ControllerEvents,
  ControllerEventsHandlerMap
> {
  public static restoreFromLocalStorage(): ClientsController | undefined {
    const current = localStorage.getItem(PROJECT_NANASE_CURRENT_TOKEN);
    if (current === null) return undefined;
    const stored = localStorage.getItem(PROJECT_NANASE_SESSIONS_TOKEN);
    if (stored === null) return undefined;
    const ret = new ClientsController();
    ret.current = current;
    const data = JSON.parse(stored) as ClientSessions;
    for (const item of data) {
      ret.addClient(
        new MatrixClient(
          item.homeserver,
          item.accessToken,
          item.userId,
          item.id,
          item.deviceId
        )
      );
    }

    return ret;
  }

  public static newSession(): boolean {
    const stored = localStorage.getItem(PROJECT_NANASE_SESSIONS_TOKEN);
    if (stored === null) return true;
    return (JSON.parse(stored) as ClientSessions).length === 0;
  }

  public static populateClientData(data: ClientData): void {
    const id = this.storeClientData(data);
    localStorage.setItem(PROJECT_NANASE_CURRENT_TOKEN, id);
  }

  private static storeClientData(data: ClientData): string {
    const stored = localStorage.getItem(PROJECT_NANASE_SESSIONS_TOKEN) ?? '[]';
    const sessions = JSON.parse(stored) as ClientSessions;
    const id = createNewSessionId();
    sessions.push({
      accessToken: data.access_token,
      homeserver: data.homeserver,
      userId: data.user_id,
      deviceId: data.device_id,
      id,
    });
    localStorage.setItem(
      PROJECT_NANASE_SESSIONS_TOKEN,
      JSON.stringify(sessions)
    );
    return id;
  }

  public readonly clients = new Map<string, MatrixClient>();
  public current!: string;

  public insertSession(data: ClientData): void {
    const id = ClientsController.storeClientData(data);
    const client = new MatrixClient(
      data.homeserver,
      data.access_token,
      data.user_id,
      id,
      data.device_id
    );
    this.clients.set(id, client);
    client.startAndWait().catch(() => {});
    this.updateClients();
  }

  get currentClient(): MatrixClient {
    return this.clients.get(this.current)!;
  }

  public switch(id: string, emit = true): void {
    if (!this.clients.has(id)) {
      return;
    }

    const prev = this.getClient(this.current);
    const next = this.getClient(id);
    this.current = id;
    localStorage.setItem(PROJECT_NANASE_CURRENT_TOKEN, id);
    if (emit) this.emit(ControllerEvents.ClientChanged, prev, next);
  }

  public getClient(id: string): MatrixClient {
    return this.clients.get(id)!;
  }

  public async waitCurrent(): Promise<void> {
    await this.currentClient.wait();
  }

  public async startAndWaitAll(): Promise<void> {
    const promises: Array<Promise<void>> = Array.from(
      this.clients.values()
    ).map(async (client) => {
      await client.startAndWait();
    });
    await Promise.allSettled(promises);
  }

  public updateClients(): void {
    this.emit(ControllerEvents.ClientsUpdated, Array.from(this.clients.keys()));
  }

  public addClient(client: MatrixClient, emit = true): void {
    this.clients.set(client.id, client);
    if (emit) this.updateClients();
  }

  public async logoutClient(id: string): Promise<void> {
    if (!this.clients.has(id)) {
      return;
    }

    const client = this.getClient(id);
    await client.logout();
    this.clients.delete(id);
    this.updateStorage();
    if (this.clients.size === 0) {
      localStorage.removeItem(PROJECT_NANASE_CURRENT_TOKEN);
      window.location.reload();
    } else {
      const ids = Array.from(this.clients.keys());
      this.switch(ids[0]);
      this.updateClients();
    }
  }

  public async logoutCurrentClient(): Promise<void> {
    await this.logoutClient(this.current);
  }

  private updateStorage(): void {
    const sessions = Array.from(this.clients.values()).map((client) =>
      client.sessionData()
    );
    localStorage.setItem(
      PROJECT_NANASE_SESSIONS_TOKEN,
      JSON.stringify(sessions)
    );
  }
}
