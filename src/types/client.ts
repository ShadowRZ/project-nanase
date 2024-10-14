import { type MatrixClient } from 'matrix-js-sdk';
import type RoomList from '~/lib/client/room-list';

export type ClientData = {
  id: string;
  homeserver: string;
  userId: string;
  accessToken: string;
  deviceId: string;
  refreshToken?: string;
};

export type ClientDataList = ClientData[];

export type ClientContext = {
  userId: string;
  client: Promise<MatrixClient>;
  wait: Promise<void>;
  roomList: Promise<RoomList>;
};

export type Session = {
  baseUrl: string;
  userId: string;
  accessToken: string;
  deviceId: string;
};
