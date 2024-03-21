import { useAppContext } from './useAppContext';

export const useCurrentClient = () => useAppContext().client;
