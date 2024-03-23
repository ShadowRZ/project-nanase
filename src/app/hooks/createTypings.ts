import {
  createSignal,
  createResource,
  createEffect,
  onCleanup,
} from 'solid-js';
import {
  type MatrixEvent,
  type RoomMember,
  RoomMemberEvent,
} from 'matrix-js-sdk';
import { createStore } from 'solid-js/store';
import { useCurrentClient } from './useCurrentClient';

export const createTypings = () => {
  const client = useCurrentClient();

  const [typings, setTypings] = createStore<Record<string, string[]>>();

  const onTyping = (event: MatrixEvent, member: RoomMember) => {
    if (member.typing) {
      setTypings(member.roomId, (ids) => {
        const data = ids ?? [];
        if (data.includes(member.userId)) return data;
        return [...data, member.userId];
      });
    } else {
      setTypings(member.roomId, (ids) => {
        const data = ids ?? [];
        if (data.includes(member.userId))
          return data.filter((id) => id !== member.userId);
        return data;
      });
    }
  };

  createEffect(() => {
    const thisClient = client();
    thisClient?.client.on(RoomMemberEvent.Typing, onTyping);
    onCleanup(() => {
      thisClient?.client.off(RoomMemberEvent.Typing, onTyping);
    });
  });

  return typings;
};
