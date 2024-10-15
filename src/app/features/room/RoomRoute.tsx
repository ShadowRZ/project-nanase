import { useParams } from '@solidjs/router';
import { Component } from 'solid-js';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { RoomProvider } from '../../hooks/useRoom';
import { Room } from './Room';

export const RoomRoute: Component = () => {
  const mx = useMatrixClient();
  const { roomId } = useParams();
  const room = () => mx().getRoom(roomId) ?? undefined;

  return (
    <RoomProvider value={room}>
      <Room />
    </RoomProvider>
  );
};
