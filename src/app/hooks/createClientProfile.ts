import { createEffect, createResource, onCleanup } from 'solid-js';
import { type MatrixEvent, type User, UserEvent } from 'matrix-js-sdk';
import { useClientsController } from '~/app/hooks/useClientsController';

export function createClientProfile(id: () => string) {
  const controller = useClientsController();
  const client = () => controller()?.getClient(id());
  const [profile] = createResource(client, async ($client) => {
    return $client.profileSnapshot();
  });
  const [name, { mutate: mutateName, refetch: refetchName }] = createResource(
    profile,
    ($profile) => $profile.displayName
  );
  const [avatar, { mutate: mutateAvatar, refetch: refetchAvatar }] =
    createResource(profile, ($profile) => $profile.avatarUrl);

  const onDisplayName = (_event: MatrixEvent | undefined, user: User): void => {
    mutateName(user.displayName);
  };

  const onAvatarUrl = (_event: MatrixEvent | undefined, user: User): void => {
    mutateAvatar(
      user.avatarUrl === undefined
        ? undefined
        : client()?.client.mxcUrlToHttp(user.avatarUrl, 48, 48, 'crop') ??
            undefined
    );
  };

  createEffect(() => {
    const thisUser = profile()?.user;
    if (thisUser !== undefined) {
      void refetchAvatar();
      void refetchName();
    }

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
