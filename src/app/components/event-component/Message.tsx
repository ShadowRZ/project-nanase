import { type ParentComponent } from 'solid-js';
import { Flex, styled } from '~styled/jsx';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { MxcAvatar } from '../mxc-avatar/MxcAvatar';

type MessageProps = {
  name?: string;
  avatar?: string;
  userId: string;
};

export const Message: ParentComponent<MessageProps> = (props) => {
  const mx = useMatrixClient();

  return (
    <Flex direction='row' gap='2'>
      <MxcAvatar client={mx()} src={props.avatar} flexShrink='0' />
      <Flex direction='column'>
        <styled.p fontWeight='bold'>{props.name ?? props.userId}</styled.p>
        {props.children}
      </Flex>
    </Flex>
  );
};
