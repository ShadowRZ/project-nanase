import { useParams } from '@solidjs/router';
import { Component } from 'solid-js';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { RoomProvider } from '../../hooks/useRoom';
import { Room } from './Room';

export const RoomRoute: Component = () => {
  const mx = useMatrixClient();
  const params = useParams();
  const room = () => mx().getRoom(params.roomId) ?? undefined;

  return (
    <RoomProvider value={room}>
      <Room />
    </RoomProvider>
  );
};
