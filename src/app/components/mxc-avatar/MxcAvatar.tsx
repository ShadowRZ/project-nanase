import UserCircleFill from '~icons/ph/user-circle-fill';
import {
  MatrixClientProvider,
  useMatrixClient,
} from '../../hooks/useMatrixClient';
import { MxcImg } from '../mxc-img/MxcImg';

import { Avatar as StyledAvatar } from '@hanekokoro-ui/solid/avatar';
import type { ElementType } from '@hanekokoro-ui/styled-system/types';
import { type JSX, splitProps } from 'solid-js';

export type MxcAvatarProps<T extends ElementType = 'span'> =
  StyledAvatar.RootProps<T> & {
    name?: string;
    src?: string;
    icon?: JSX.Element;
  };

export const MxcAvatar = <T extends ElementType = 'span'>(
  props: MxcAvatarProps<T>
) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'src', 'icon']);
  const mx = useMatrixClient();
  const src = () => localProps.src as string | undefined;
  return (
    <MatrixClientProvider value={mx}>
      <StyledAvatar.Root {...(rootProps as StyledAvatar.RootProps<T>)}>
        <StyledAvatar.Fallback>
          {getInitials(localProps.name) || localProps.icon || (
            <UserCircleFill />
          )}
        </StyledAvatar.Fallback>
        <MxcImg as={StyledAvatar.Image} src={src()} alt={localProps.name} />
      </StyledAvatar.Root>
    </MatrixClientProvider>
  );
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .splice(0, 2)
    .join('')
    .toUpperCase();
