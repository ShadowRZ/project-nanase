import { createMxcUrl } from '../../hooks/createMxcUrl';
import { Avatar as StyledAvatar } from '@shadowrz/hanekokoro-ui';
import { type JSX, splitProps } from 'solid-js';
import {
  MatrixClientProvider,
  useMatrixClient,
} from '../../hooks/useMatrixClient';
import UserCircleFill from '~icons/ph/user-circle-fill';

export interface MxcAvatarProps extends StyledAvatar.RootProps {
  name?: string;
  src?: string;
  icon?: JSX.Element;
}

export const MxcAvatar = (props: MxcAvatarProps) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'src', 'icon']);

  const mx = useMatrixClient();
  const src = () => localProps.src;

  const $src = createMxcUrl(mx, src);

  return (
    <MatrixClientProvider value={mx}>
      <StyledAvatar.Root {...rootProps}>
        <StyledAvatar.Fallback>
          {getInitials(localProps.name) || localProps.icon || (
            <UserCircleFill />
          )}
        </StyledAvatar.Fallback>
        <StyledAvatar.Image src={$src()} alt={localProps.name} />
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
