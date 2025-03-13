import { ReactiveMap } from '@solid-primitives/map';
import { MatrixClient, MatrixEvent, User, UserEvent } from 'matrix-js-sdk';
import {
  type Accessor,
  batch,
  createEffect,
  createMemo,
  onCleanup,
} from 'solid-js';

export type ProfileSignal = {
  name: Accessor<string | undefined>;
  avatar: Accessor<string | undefined>;
};

const names = new ReactiveMap<string, string | undefined>();
const avatars = new ReactiveMap<string, string | undefined>();

export const createSelfProfile = (mx: Accessor<MatrixClient>) => {
  const userId = () => mx().getSafeUserId();
  const user = createMemo(() => mx().getUser(userId()));

  createEffect(() => {
    const $mx = mx();
    const userId = $mx.getSafeUserId();
    $mx
      .getProfileInfo(userId)
      .then(({ avatar_url, displayname }) => {
        batch(() => {
          names.set(userId, displayname);
          avatars.set(userId, avatar_url);
        });
        return;
      })
      .catch(() => {});
  });

  const onDisplayName = (_: MatrixEvent | undefined, user: User) => {
    names.set(user.userId, user.displayName);
  };

  const onAvatarUrl = (_: MatrixEvent | undefined, user: User) => {
    avatars.set(user.userId, user.avatarUrl);
  };

  createEffect(() => {
    const $user = user();
    $user?.on(UserEvent.DisplayName, onDisplayName);
    $user?.on(UserEvent.AvatarUrl, onAvatarUrl);
    onCleanup(() => {
      $user?.off(UserEvent.DisplayName, onDisplayName);
      $user?.off(UserEvent.AvatarUrl, onAvatarUrl);
    });
  });

  const name = () => names.get(userId());
  const avatar = () => avatars.get(userId());

  return { name, avatar };
};
