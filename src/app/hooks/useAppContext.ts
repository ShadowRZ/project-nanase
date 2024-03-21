import { useContext, createContext } from 'solid-js';
import type ClientsController from '~/lib/client/ClientsController';
import { type MatrixClient } from '~/lib/client/MatrixClient';

type AppContextProps = {
  controller: () => ClientsController | undefined;
  client: () => MatrixClient | undefined;
};

export const AppContext = createContext<AppContextProps>();

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('App context used without an AppContext!');
  }

  return ctx;
};
