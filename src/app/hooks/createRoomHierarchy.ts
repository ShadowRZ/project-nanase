import { ReactiveMap } from '@solid-primitives/map';
import { ReactiveSet } from '@solid-primitives/set';
import {
  ClientEvent,
  MatrixClient,
  MatrixEvent,
  Room,
  RoomEvent,
  RoomStateEvent,
} from 'matrix-js-sdk';
import { Accessor, batch, createEffect, on, onCleanup } from 'solid-js';
import { getSpaceChildrens, isJoined, isValidChildren } from '../utils/room';

export const createRoomHierarchy = (
  mx: Accessor<MatrixClient>
): [
  ReactiveMap<string, ReactiveSet<string>>,
  {
    spaces: () => string[];
  },
] => {
  const map = new ReactiveMap<string, ReactiveSet<string>>();

  createEffect(
    on(mx, ($mx) => {
      batch(() => {
        map.clear();
        for (const room of $mx
          .getRooms()
          .filter((room) => room.isSpaceRoom())) {
          const childrens = getSpaceChildrens(room);

          map.set(room.roomId, new ReactiveSet(childrens));
        }
      });
    })
  );

  const onAddRoom = (room: Room) => {
    if (isJoined(room)) {
      const childrens = getSpaceChildrens(room);
      map.set(room.roomId, new ReactiveSet(childrens));
    }
  };

  const onDeleteRoom = (roomId: string) => {
    map.delete(roomId);
  };

  const onMembershipChange = (room: Room) => {
    if (isJoined(room)) {
      const childrens = getSpaceChildrens(room);
      map.set(room.roomId, new ReactiveSet(childrens));
    } else {
      map.delete(room.roomId);
    }
  };

  const onStateChange = (event: MatrixEvent) => {
    if (event.getType() === 'm.space.child') {
      const children = event.getStateKey();
      const roomId = event.getRoomId();
      if (children && roomId) {
        if (isValidChildren(event)) {
          map.get(roomId)?.add(children);
        } else {
          map.delete(roomId);
        }
      }
    }
  };

  createEffect(() => {
    const $mx = mx();
    $mx.on(ClientEvent.Room, onAddRoom);
    $mx.on(RoomStateEvent.Events, onStateChange);
    $mx.on(RoomEvent.MyMembership, onMembershipChange);
    $mx.on(ClientEvent.DeleteRoom, onDeleteRoom);
    onCleanup(() => {
      $mx.off(ClientEvent.Room, onAddRoom);
      $mx.off(RoomStateEvent.Events, onStateChange);
      $mx.off(RoomEvent.MyMembership, onMembershipChange);
      $mx.off(ClientEvent.DeleteRoom, onDeleteRoom);
    });
  });

  const spaces = () => [...map.keys()];

  return [map, { spaces }];
};
