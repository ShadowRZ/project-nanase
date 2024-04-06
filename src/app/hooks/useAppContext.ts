import { useContext, createContext, type Resource } from 'solid-js';
import { type MatrixClient } from 'matrix-js-sdk';
import { type ClientContext } from '~/types/client';

type AppContextProps = {
  client: Resource<MatrixClient>;
  clients: Map<string, ClientContext>;
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
