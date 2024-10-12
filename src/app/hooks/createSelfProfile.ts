import { MatrixClient, MatrixEvent, User, UserEvent } from 'matrix-js-sdk';
import { Accessor, createEffect, createMemo, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

export type Profile = {
  displayName?: string;
  avatarUrl?: string;
};

export const createSelfProfile = (mx: Accessor<MatrixClient>) => {
  const user = createMemo(() => {
    const $mx = mx();
    return $mx.getUser($mx.getSafeUserId());
  });
  const [profile, setProfile] = createStore<Profile>({});

  createEffect(() => {
    const $mx = mx();
    $mx
      .getProfileInfo($mx.getSafeUserId())
      .then(({ avatar_url, displayname }) => {
        setProfile(
          produce(($profile) => {
            $profile.displayName = displayname;
            $profile.avatarUrl = avatar_url;
          })
        );
        return;
      })
      .catch(() => {});
  });

  const onDisplayName = (_: MatrixEvent | undefined, user: User) => {
    setProfile(($profile) => ({
      ...$profile,
      displayName: user.displayName,
    }));
  };

  const onAvatarUrl = (_: MatrixEvent | undefined, user: User) => {
    setProfile(($profile) => ({
      ...$profile,
      avatarUrl: user.avatarUrl,
    }));
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

  return profile;
};
