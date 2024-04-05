import { type UploadProgress, type MatrixClient } from 'matrix-js-sdk';
import { createContext, useContext, type Resource } from 'solid-js';
import type RoomList from '~/lib/client/RoomList';

export type UploadData = {
  name: string;
  content_uri?: string;
} & UploadProgress;

type ReactiveClientData = {
  client: Resource<MatrixClient>;
  roomList: Resource<RoomList>;
  // Datas backed by `createStore()`.
  uploads: Record<string, UploadData[]>;
};

export const ClientData = createContext<ReactiveClientData>();

export function useClientData() {
  const ctx = useContext(ClientData);
  if (!ctx) {
    throw new Error('Client Data context was not provided!');
  }

  return ctx;
}
