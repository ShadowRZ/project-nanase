import { createContext, useContext } from 'solid-js';
import { type SpecVersions } from '../cs-api';

const SpecVersionsContext = createContext<SpecVersions>();

export const SpecVersionsProvider = SpecVersionsContext.Provider;

export function useSpecVersions(): SpecVersions {
  const versions = useContext(SpecVersionsContext);
  if (!versions) throw new Error('SpecVersions context not provided!');
  return versions;
}
