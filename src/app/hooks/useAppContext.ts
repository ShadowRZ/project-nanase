import { useContext, createContext } from 'solid-js';
import { type MatrixClient } from 'matrix-js-sdk';
import type RoomList from '~/lib/client/RoomList';

type AppContextProps = {
  clients: Map<string, [string, Promise<MatrixClient>, Promise<RoomList>]>;
  current: () => string;
};

export const AppContext = createContext<AppContextProps>();

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('App context used without an AppContext!');
  }

  return ctx;
};
