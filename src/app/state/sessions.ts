import { makePersisted } from '@solid-primitives/storage';
import { createStore, produce } from 'solid-js/store';
import { type Session, type SessionMap } from '~/types/client';

// eslint-disable-next-line solid/reactivity
const [sessions, setSessions] = makePersisted(createStore<Session[]>([]), {
  storage: window.localStorage,
  name: 'project-nanase-sessions',
});

export const addSession = (session: Session) => {
  setSessions(
    produce(($state) => {
      $state.push(session);
    })
  );
};

export const removeSession = (session: Session) => {
  setSessions(($state) => {
    return $state.filter(($i) => $i !== session);
  });
};

export const sessionMap = () => {
  const ret: SessionMap = {};
  for (const element of sessions) {
    ret[element.userId] = element;
  }

  return ret;
};

export const isInitial = () => sessions.length === 0;

export { sessions };
