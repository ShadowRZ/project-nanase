import { type Room } from 'matrix-js-sdk';
import { type Accessor, createContext, useContext } from 'solid-js';

const RoomContext = createContext<Accessor<Room>>();

export const RoomProvider = RoomContext.Provider;

export function useRoom(): Accessor<Room> {
  const room = useContext(RoomContext);
  if (!room) throw new Error('Room used without providing a Room context!');
  return room;
}
