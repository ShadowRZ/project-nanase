import { ReactiveMap } from '@solid-primitives/map';
import { ReactiveSet } from '@solid-primitives/set';
import {
  type Accessor,
  createContext,
  type ParentComponent,
  useContext,
} from 'solid-js';
import { createRoomHierarchy } from './createRoomHierarchy';
import { createRooms } from './createRooms';
import { createSelfProfile, type ProfileSignal } from './createSelfProfile';
import { createTypings } from './createTypings';
import { useMatrixClient } from './useMatrixClient';

type ClientState = {
  rooms: Accessor<string[]>;
  directs: Accessor<string[]>;
  spaces: Accessor<string[]>;
  profile: ProfileSignal;
  hierarchy: ReactiveMap<string, ReactiveSet<string>>;
  typings: ReactiveMap<string, ReactiveSet<string>>;
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
  const typings = createTypings(mx);
  const [hierarchy, { spaces }] = createRoomHierarchy(mx);

  return (
    <ClientStateContext.Provider
      value={{ rooms, directs, spaces, profile, hierarchy, typings }}
    >
      {props.children}
    </ClientStateContext.Provider>
  );
};

export const useDirects = () => useClientState().directs;
export const useJoinedRooms = () => useClientState().rooms;
export const useSpaces = () => useClientState().spaces;
export const useSelfProfile = () => useClientState().profile;
export const useRoomHierarchy = () => useClientState().hierarchy;
