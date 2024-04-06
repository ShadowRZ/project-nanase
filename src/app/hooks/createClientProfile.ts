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
  const { clients } = useAppContext();
  const client = createClientResource(id);
  const wait = async () => clients.get(id())!.wait;

  const [user] = createResource(client, ($client) => {
    return $client.getUser($client.getSafeUserId())!;
  });

  const [name, { refetch: refetchName }] = createResource(
    user,
    ($user) => $user.displayName
  );
  const [avatar, { refetch: refetchAvatar }] = createResource(user, ($user) =>
    $user.avatarUrl === undefined
      ? undefined
      : client()?.mxcUrlToHttp($user.avatarUrl, 48, 48, 'crop') ?? undefined
  );

  const onDisplayName = (_event: MatrixEvent | undefined, user: User): void => {
    void refetchName();
  };

  const onAvatarUrl = (_event: MatrixEvent | undefined, user: User): void => {
    void refetchAvatar();
  };

  createEffect(() => {
    const thisUser = user();
    const waiter = wait();
    waiter
      .then(() => {
        void refetchName();
        void refetchAvatar();
      })
      .catch(() => {});
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
