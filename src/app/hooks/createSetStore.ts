import { createStore, reconcile } from 'solid-js/store';

type SetStoreReturn<T> = [
  T[],
  {
    add: (value: T) => void;
    remove: (value: T) => boolean;
    clear: () => void;
  },
];

export const createSetStore = <T>(value: T[]): SetStoreReturn<T> => {
  const [store, setStore] = createStore<T[]>(value);
  const set = new Set<T>();

  const add = (value: T) => {
    set.add(value);
    setStore(reconcile([...set]));
  };

  const remove = (value: T) => {
    const ret = set.delete(value);
    setStore(reconcile([...set]));

    return ret;
  };

  const clear = () => {
    setStore([]);
  };

  return [store, { add, remove, clear }];
};
