import {
  TypedEventEmitter,
  type MatrixClient,
  ClientEvent,
  EventTimeline,
  RoomStateEvent,
  SyncState,
} from 'matrix-js-sdk';
import { useClientPreparedCallback } from '~/lib/utils/event';

export enum RoomListEvents {
  ListUpdated = 'RoomListEvents.ListUpdated',
}

export type RoomListEventsHandlerMap = {
  [RoomListEvents.ListUpdated]: () => void;
};

export default class RoomList extends TypedEventEmitter<
  RoomListEvents,
  RoomListEventsHandlerMap
> {
  public rooms = new Set<string>();
  public directs = new Set<string>();
  public spaces = new Set<string>();
  public spaceChildrens = new Map<string, string[]>();
  private mDirects = new Set<string>();
  private readonly client: MatrixClient;

  constructor(client: MatrixClient) {
    super();
    this.client = client;
    this.populateRooms();
    if (client.isInitialSyncComplete()) {
      this.listenEvents();
      this.emit(RoomListEvents.ListUpdated);
    } else {
      useClientPreparedCallback(client, () => {
        this.populateRooms();
        this.emit(RoomListEvents.ListUpdated);
        this.listenEvents();
      });
    }
  }

  private populateRooms(): void {
    this.mDirects = this.getMDirects();
    this.rooms.clear();
    this.directs.clear();
    for (const room of this.client.getRooms()) {
      const { roomId } = room;

      if (room.getMyMembership() !== 'join') continue;

      if (this.mDirects.has(roomId)) this.directs.add(roomId);
      else if (room.isSpaceRoom()) this.populateSpace(roomId);
      else this.rooms.add(roomId);
    }
  }

  private populateSpace(roomId: string): void {
    this.spaces.add(roomId);
    const childrens = this.getSpaceChildren(roomId);
    this.spaceChildrens.set(roomId, childrens);
  }

  private getSpaceChildren(roomId: string): string[] {
    const space = this.client.getRoom(roomId);
    if (space === null) return [];

    const spaceChilds = space
      .getLiveTimeline()
      .getState(EventTimeline.FORWARDS)
      ?.getStateEvents('m.space.child');
    const children = new Set<string>();
    if (spaceChilds)
      for (const event of spaceChilds) {
        const child = event.getStateKey()!;
        // https://github.com/matrix-org/matrix-spec-proposals/pull/1772
        if (
          event.getType() === 'm.space.child' &&
          Object.hasOwn(event.getContent(), 'via')
        ) {
          children.add(child);
        }
      }

    return Array.from(children);
  }

  private getMDirects(): Set<string> {
    const mDirectsId = new Set<string>();
    const mDirect = this.client.getAccountData('m.direct')?.getContent();

    if (mDirect === undefined) return mDirectsId;

    for (const direct of Object.keys(mDirect)) {
      for (const directId of mDirect[direct] as string[]) {
        mDirectsId.add(directId);
      }
    }

    return mDirectsId;
  }

  private listenEvents(): void {
    // Update direct chats
    this.client.on(ClientEvent.AccountData, (event) => {
      if (event.getType() !== 'm.direct') return;

      const latestDirects = this.getMDirects();

      for (const roomId of latestDirects) {
        if (this.directs.has(roomId)) continue;
        this.directs.add(roomId);

        const room = this.client.getRoom(roomId);
        if (room !== null && room.getMyMembership() === 'join') {
          this.directs.add(roomId);
          this.rooms.delete(roomId);
          this.emit(RoomListEvents.ListUpdated);
        }
      }

      for (const roomId of this.directs) {
        if (latestDirects.has(roomId)) continue;
        this.directs.delete(roomId);

        const room = this.client.getRoom(roomId);
        if (room !== null && room.getMyMembership() === 'join') {
          this.directs.delete(roomId);
          this.rooms.add(roomId);
          this.emit(RoomListEvents.ListUpdated);
        }
      }
    });

    // Update space childrens
    this.client.on(RoomStateEvent.Events, (event, state) => {
      if (event.getType() === 'm.space.child') {
        const roomId = event.getRoomId()!;
        const childId = event.getStateKey()!;
        if (
          event.getType() === 'm.space.child' &&
          Object.hasOwn(event.getContent(), 'via')
        ) {
          const children = this.spaceChildrens.get(roomId) ?? [];
          children.push(childId);
          this.spaceChildrens.set(roomId, children);
        } else {
          const children = this.spaceChildrens.get(roomId) ?? [];
          this.spaceChildrens.set(
            roomId,
            children.filter((e) => e !== childId)
          );
        }

        this.emit(RoomListEvents.ListUpdated);
      }
    });
  }
}
