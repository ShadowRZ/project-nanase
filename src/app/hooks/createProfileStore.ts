import { createStore } from 'solid-js/store';

type Profile = {
  name?: string;
  avatar?: string;
};

type Store = Record<string, Profile>;

export const [profiles, setProfiles] = createStore<Store>({});
