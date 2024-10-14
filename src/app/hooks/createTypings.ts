import { ReactiveMap } from '@solid-primitives/map';
import { ReactiveSet } from '@solid-primitives/set';
import {
  type MatrixEvent,
  type RoomMember,
  RoomMemberEvent,
} from 'matrix-js-sdk';
import { createEffect, onCleanup } from 'solid-js';
import { useMatrixClient } from './useMatrixClient';

export const createTypings = () => {
  const mx = useMatrixClient();

  const typings = new ReactiveMap<string, ReactiveSet<string>>();

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
    const thisClient = mx();
    thisClient?.on(RoomMemberEvent.Typing, onTyping);
    onCleanup(() => {
      thisClient?.off(RoomMemberEvent.Typing, onTyping);
    });
  });

  return typings;
};
