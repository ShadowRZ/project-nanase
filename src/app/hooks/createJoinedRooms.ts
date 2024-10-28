import { ClientEvent, MatrixClient, Room, RoomEvent } from 'matrix-js-sdk';
import { Accessor, createEffect, on, onCleanup } from 'solid-js';
import { isJoined } from '../utils/room';
import { createSetStore } from './createSetStore';

export const createJoinedRooms = (mx: Accessor<MatrixClient>) => {
  const [joined, { add, remove }] = createSetStore<string>([]);

  createEffect(
    on(mx, ($mx) => {
      for (const $roomId of $mx
        .getRooms()
        .filter((room) => isJoined(room))
        .map((room) => room.roomId))
        add($roomId);
    })
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
      $mx.off(ClientEvent.Room, onAddRoom);
      $mx.off(RoomEvent.MyMembership, onMembershipChange);
      $mx.off(ClientEvent.DeleteRoom, onDeleteRoom);
    });
  });

  return joined;
};
