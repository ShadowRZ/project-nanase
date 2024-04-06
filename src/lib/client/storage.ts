import { type MatrixClient } from 'matrix-js-sdk';
import type RoomList from './room-list';
import createClientData from './client-data';
import { createNewSessionId } from './session-id';
import { type ClientContext, type ClientDatas } from '~/types/client';
import cons from '~/lib/cons';
import { type SessionData } from '~/lib/auth';

export default function restoreFromStorage() {
  const current = localStorage.getItem(cons.internal.storage.CURRENT_TOKEN);
  if (current === null) return undefined;
  const stored = localStorage.getItem(cons.internal.storage.SESSIONS_TOKEN);
  if (stored === null) return undefined;
  const clients = new Map<string, ClientContext>();

  const data = JSON.parse(stored) as ClientDatas;

  for (const item of data) {
    const client = createClientData(
      item.homeserver,
      item.accessToken,
      item.userId,
      item.deviceId
    );
    clients.set(item.id, client);
  }

  return { clients, current };
}

export function isInitial() {
  const stored = localStorage.getItem(cons.internal.storage.SESSIONS_TOKEN);
  if (stored === null) return true;
  return (JSON.parse(stored) as ClientDatas).length === 0;
}

export function populateClientData(data: SessionData): void {
  const id = storeClientData(data);
  localStorage.setItem(cons.internal.storage.CURRENT_TOKEN, id);
}

function storeClientData(data: SessionData): string {
  const stored =
    localStorage.getItem(cons.internal.storage.SESSIONS_TOKEN) ?? '[]';
  const sessions = JSON.parse(stored) as ClientDatas;
  const id = createNewSessionId();
  sessions.push({
    accessToken: data.access_token,
    homeserver: data.homeserver,
    userId: data.user_id,
    deviceId: data.device_id,
    id,
  });
  localStorage.setItem(
    cons.internal.storage.SESSIONS_TOKEN,
    JSON.stringify(sessions)
  );
  return id;
}
