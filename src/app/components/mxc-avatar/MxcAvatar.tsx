import { MatrixClient } from 'matrix-js-sdk';
import { Component, ComponentProps, splitProps } from 'solid-js';
import { Avatar } from '@/components/ui/avatar';
import { Assign } from '~styled/types';
import { createMxcUrl } from '../../hooks/createMxcUrl';

type MxcAvatarProps = {
  client: MatrixClient;
  src?: string;
};

export const MxcAvatar: Component<
  Assign<ComponentProps<typeof Avatar>, MxcAvatarProps>
> = (props) => {
  const [selfProps, rootProps] = splitProps(props, ['client', 'src']);

  const mx = () => selfProps.client;
  const src = () => selfProps.src;

  const $src = createMxcUrl(mx, src);

  return <Avatar {...rootProps} src={$src()} />;
};
