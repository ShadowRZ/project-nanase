import { type MatrixClient } from 'matrix-js-sdk';
import { type Accessor, createContext, useContext } from 'solid-js';

const MatrixClientContext = createContext<Accessor<MatrixClient>>();

export const MatrixClientProvider = MatrixClientContext.Provider;

export function useMatrixClient(): Accessor<MatrixClient> {
  const mx = useContext(MatrixClientContext);
  if (!mx)
    throw new Error('Matrix client used without providing a MatrixClient!');
  return mx;
}
