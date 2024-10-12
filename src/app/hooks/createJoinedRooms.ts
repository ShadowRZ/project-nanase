import {
  ClientEvent,
  KnownMembership,
  MatrixClient,
  Membership,
  Room,
  RoomEvent,
} from 'matrix-js-sdk';
import { Accessor, createEffect, onCleanup, untrack } from 'solid-js';
import { createSetStore } from './createSetStore';

const isJoined = (room: Room) =>
  room.getMyMembership() === (KnownMembership.Join as Membership);

export const createJoinedRooms = (mx: Accessor<MatrixClient>) => {
  const [joined, { add, remove }] = createSetStore<string>(
    untrack(() =>
      mx()
        .getRooms()
        .filter((room) => isJoined(room))
        .map((room) => room.roomId)
    )
  );

  const onAddRoom = (room: Room) => {
    if (isJoined(room)) add(room.roomId);
  };

  const onDeleteRoom = (roomId: string) => {
    remove(roomId);
  };

  const onMembershipChange = (room: Room) => {
    if (isJoined(room)) add(room.roomId);
    else remove(room.roomId);
  };

  createEffect(() => {
    const $mx = mx();
    $mx.on(ClientEvent.Room, onAddRoom);
    $mx.on(RoomEvent.MyMembership, onMembershipChange);
    $mx.on(ClientEvent.DeleteRoom, onDeleteRoom);
    onCleanup(() => {
      $mx.removeListener(ClientEvent.Room, onAddRoom);
      $mx.removeListener(RoomEvent.MyMembership, onMembershipChange);
      $mx.removeListener(ClientEvent.DeleteRoom, onDeleteRoom);
    });
  });

  return joined;
};
