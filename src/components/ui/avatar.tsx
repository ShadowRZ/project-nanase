import type { AvatarImageProps } from '@ark-ui/solid';
import { FlowComponent, splitProps } from 'solid-js';
import UserCircleFill from '~icons/ph/user-circle-fill';
import * as StyledAvatar from './styled/avatar';

export interface AvatarProps extends StyledAvatar.RootProps {
  name?: string;
  src?: string;
}

const Avatar = (props: AvatarProps) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'src']);

  return (
    <StyledAvatar.Root {...rootProps}>
      <StyledAvatar.Fallback>{getInitials(localProps.name) || <UserCircleFill />}</StyledAvatar.Fallback>
      <StyledAvatar.Image src={localProps.src} alt={localProps.name} />
    </StyledAvatar.Root>
  );
};

const WithComponent: FlowComponent<Omit<AvatarProps, 'children'>, AvatarImageProps['asChild']> = (props) => {
  const [localProps, rootProps] = splitProps(props, ['name', 'src', 'children']);

  return (
    <StyledAvatar.Root {...rootProps}>
      <StyledAvatar.Fallback>{getInitials(localProps.name) || <UserCircleFill />}</StyledAvatar.Fallback>
      <StyledAvatar.Image src={localProps.src} alt={localProps.name} asChild={localProps.children} />
    </StyledAvatar.Root>
  );
};

const AvatarAsChild = Object.assign(Avatar, { WithComponent });

export { AvatarAsChild as Avatar };

const getInitials = (name = '') =>
  name
    .split(' ')
    .map((part) => part[0])
    .splice(0, 2)
    .join('')
    .toUpperCase();
