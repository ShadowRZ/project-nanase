import {
  createEffect,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js';
import { type MatrixEvent, type User, UserEvent } from 'matrix-js-sdk';
import { createClientResource } from './createClientResource';
import { useAppContext } from './useAppContext';

export function createClientProfile(id: () => string) {
  const client = createClientResource(id);

  const [name, setName] = createSignal<string>();
  const [avatar, setAvatar] = createSignal<string>();

  const [user] = createResource(
    client,
    ($client) => $client.getUser($client.getSafeUserId())!
  );

  const onDisplayName = (_event: MatrixEvent | undefined, user: User): void => {
    setName(user.displayName);
  };

  const onAvatarUrl = (_event: MatrixEvent | undefined, user: User): void => {
    setAvatar(
      user.avatarUrl === undefined
        ? undefined
        : client()?.mxcUrlToHttp(user.avatarUrl, 48, 48, 'crop') ?? undefined
    );
  };

  createEffect(() => {
    const thisUser = user();
    thisUser?.on(UserEvent.DisplayName, onDisplayName);
    thisUser?.on(UserEvent.AvatarUrl, onAvatarUrl);
    onCleanup(() => {
      thisUser?.off(UserEvent.DisplayName, onDisplayName);
      thisUser?.off(UserEvent.AvatarUrl, onAvatarUrl);
    });
  });

  return {
    name,
    avatar,
  };
}

export function createCurrentClientProfile() {
  const { current } = useAppContext();
  return createClientProfile(current);
}
