import { Component, For } from 'solid-js';
import { useJoinedRooms } from '~/app/hooks/useClientState';
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
