import { type MatrixClient } from 'matrix-js-sdk';
import { createContext, useContext } from 'solid-js';

const MatrixClientContext = createContext<MatrixClient>();

export const MatrixClientProvider = MatrixClientContext.Provider;

export function useMatrixClient(): MatrixClient {
  const mx = useContext(MatrixClientContext);
  if (!mx)
    throw new Error('Matrix client used without providing a MatrixClient!');
  return mx;
}
