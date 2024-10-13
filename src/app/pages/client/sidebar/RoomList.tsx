import { Component, For } from 'solid-js';
import {
  useDirects,
  useJoinedRooms,
  useRoomHierarchy,
} from '../../../hooks/useClientState';
import { Flex } from '~styled/jsx';
import { RoomItem } from './room-item/RoomItem';

export const JoinedRooms: Component = () => {
  const rooms = useJoinedRooms();

  return (
    <Flex direction='column' width='full' p='1'>
      <For each={rooms()}>{(roomId) => <RoomItem roomId={roomId} />}</For>
    </Flex>
  );
};

export const DirectRooms: Component = () => {
  const directs = useDirects();

  return (
    <Flex direction='column' width='full' p='1'>
      <For each={directs()}>
        {(roomId) => <RoomItem direct roomId={roomId} />}
      </For>
    </Flex>
  );
};

export const SpaceChildrens: Component<{ roomId: string }> = (props) => {
  const hierarchy = useRoomHierarchy();
  const roomId = () => props.roomId;
  const rooms = () => hierarchy.get(roomId())?.values().toArray() ?? [];

  return (
    <Flex direction='column' width='full' p='1'>
      <For each={rooms()}>{(roomId) => <RoomItem roomId={roomId} />}</For>
    </Flex>
  );
};
