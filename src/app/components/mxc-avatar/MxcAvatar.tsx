import { Avatar as StyledAvatar } from '@hanekokoro-ui/solid';
import { type JSX, splitProps } from 'solid-js';
import UserCircleFill from '~icons/ph/user-circle-fill';
import {
  MatrixClientProvider,
  useMatrixClient,
} from '../../hooks/useMatrixClient';
import { MxcImg } from '../mxc-img/MxcImg';

export interface MxcAvatarProps extends StyledAvatar.RootProps {
  name?: string;
  src?: string;
  icon?: JSX.Element;
}

export const MxcAvatar = (props: MxcAvatarProps) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'src', 'icon']);

  const mx = useMatrixClient();
  const src = () => localProps.src;

  return (
    <MatrixClientProvider value={mx}>
      <StyledAvatar.Root flexShrink='0' {...rootProps}>
        <StyledAvatar.Fallback>
          {getInitials(localProps.name) || localProps.icon || (
            <UserCircleFill />
          )}
        </StyledAvatar.Fallback>
        <StyledAvatar.Image
          alt={localProps.name}
          asChild={(props) => <MxcImg {...props()} src={src()} />}
        />
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
