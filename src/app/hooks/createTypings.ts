import { ReactiveMap } from '@solid-primitives/map';
import { ReactiveSet } from '@solid-primitives/set';
import {
  MatrixClient,
  type MatrixEvent,
  type RoomMember,
  RoomMemberEvent,
} from 'matrix-js-sdk';
import { Accessor, createEffect, on, onCleanup } from 'solid-js';

export const createTypings = (mx: Accessor<MatrixClient>) => {
  const typings = new ReactiveMap<string, ReactiveSet<string>>();

  createEffect(on(mx, () => typings.clear()));

  const addTyping = (roomId: string, userId: string) => {
    if (!typings.has(roomId)) typings.set(roomId, new ReactiveSet());
    typings.get(roomId)!.add(userId);
  };

  const removeTyping = (roomId: string, userId: string) => {
    if (!typings.has(roomId)) typings.set(roomId, new ReactiveSet());
    typings.get(roomId)!.delete(userId);
  };

  const onTyping = (_: MatrixEvent, member: RoomMember) => {
    if (member.typing) {
      addTyping(member.roomId, member.userId);
    } else {
      removeTyping(member.roomId, member.userId);
    }
  };

  createEffect(() => {
    const $mx = mx();
    $mx?.on(RoomMemberEvent.Typing, onTyping);
    onCleanup(() => {
      $mx?.off(RoomMemberEvent.Typing, onTyping);
    });
  });

  return typings;
};
