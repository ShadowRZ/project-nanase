import { Accessor, createContext, ParentComponent, useContext } from 'solid-js';
import { useMatrixClient } from './useMatrixClient';
import { createSelfProfile, Profile } from './createSelfProfile';
import { createRooms } from './createRooms';

type ClientState = {
  rooms: Accessor<string[]>;
  directs: Accessor<string[]>;
  profile: Profile;
};

const ClientStateContext = createContext<ClientState>();

const useClientState = () => {
  const ctx = useContext(ClientStateContext);
  if (!ctx) {
    throw new Error('Client state Context was not provided!');
  }
  return ctx;
};

export const WithClientState: ParentComponent = (props) => {
  const mx = useMatrixClient();
  const { rooms, directs } = createRooms(mx);
  const profile = createSelfProfile(mx);

  return (
    <ClientStateContext.Provider value={{ rooms, directs, profile }}>
      {props.children}
    </ClientStateContext.Provider>
  );
};

export const useDirects = () => useClientState().directs;
export const useJoinedRooms = () => useClientState().rooms;
export const useSelfProfile = () => useClientState().profile;
