import { type JSX, splitProps } from 'solid-js';
import UserCircleFill from '~icons/ph/user-circle-fill';
import { Avatar as StyledAvatar } from '@hanekokoro-ui/solid';

export interface AvatarProps extends StyledAvatar.RootProps {
  name?: string;
  src?: string;
  icon?: JSX.Element;
}

export const Avatar = (props: AvatarProps) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'src', 'icon']);

  return (
    <StyledAvatar.Root {...rootProps}>
      <StyledAvatar.Fallback>
        {getInitials(localProps.name) || localProps.icon || <UserCircleFill />}
      </StyledAvatar.Fallback>
      <StyledAvatar.Image src={localProps.src} alt={localProps.name} />
    </StyledAvatar.Root>
  );
};

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .splice(0, 2)
    .join('')
    .toUpperCase();
