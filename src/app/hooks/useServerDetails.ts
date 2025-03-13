import type { Capabilities } from 'matrix-js-sdk';
import { createContext, useContext } from 'solid-js';

export interface MediaConfig {
  [key: string]: unknown;
  'm.upload.size'?: number;
}

type ContextType = {
  capabilities?: Capabilities;
  mediaConfig?: MediaConfig;
};

const ServerDetailsContext = createContext<ContextType>();

export const ServerDetailsProvider = ServerDetailsContext.Provider;

function useServerDetails(): ContextType {
  const versions = useContext(ServerDetailsContext);
  if (!versions) throw new Error('Server details context not provided!');
  return versions;
}

export const useCapabilities = () => useServerDetails().capabilities;
export const useMediaConfig = () => useServerDetails().mediaConfig;
