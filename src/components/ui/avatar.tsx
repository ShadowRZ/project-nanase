import type { AvatarImageProps } from '@ark-ui/solid';
import { type JSX, type FlowComponent, splitProps } from 'solid-js';
import UserCircleFill from '~icons/ph/user-circle-fill';
import * as StyledAvatar from './styled/avatar';

export interface AvatarProps extends StyledAvatar.RootProps {
  name?: string;
  src?: string;
  icon?: JSX.Element;
}

const Avatar = (props: AvatarProps) => {
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

const WithComponent: FlowComponent<
  Omit<AvatarProps, 'children'>,
  AvatarImageProps['asChild']
> = (props) => {
  const [localProps, rootProps] = splitProps(props, [
    'name',
    'src',
    'children',
    'icon',
  ]);

  return (
    <StyledAvatar.Root {...rootProps}>
      <StyledAvatar.Fallback>
        {getInitials(localProps.name) || localProps.icon || <UserCircleFill />}
      </StyledAvatar.Fallback>
      <StyledAvatar.Image
        src={localProps.src}
        alt={localProps.name}
        asChild={localProps.children}
      />
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
