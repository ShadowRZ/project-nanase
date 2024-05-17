import {
  useContext,
  createContext,
  type Resource,
  type Accessor,
} from 'solid-js';
import { type MatrixClient } from 'matrix-js-sdk';
import { type Session } from '~/lib/client/session';

type AppContextProps = {
  client: Accessor<MatrixClient>;
  clients: Map<string, Session>;
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
