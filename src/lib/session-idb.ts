import { DBSchema, openDB } from 'idb';
import { Session } from '../types/client';

export interface ProjectNanaseIDB extends DBSchema {
  'kv-sessions': {
    key: string;
    value: Session;
  };
}

const dbPromise = openDB<ProjectNanaseIDB>('project-nanase', 1, {
  upgrade: (db) => {
    db.createObjectStore('kv-sessions');
  },
});

export async function get(key: string) {
  const db = await dbPromise;
  return await db.get('kv-sessions', key);
}

export async function set(key: string, val: Session) {
  const db = await dbPromise;
  return await db.put('kv-sessions', val, key);
}

export async function del(key: string) {
  const db = await dbPromise;
  return await db.delete('kv-sessions', key);
}

export async function clear() {
  const db = await dbPromise;
  return await db.clear('kv-sessions');
}

export async function keys() {
  const db = await dbPromise;
  return await db.getAllKeys('kv-sessions');
}

export async function values() {
  const db = await dbPromise;
  return await db.getAll('kv-sessions');
}
