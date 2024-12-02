import { Flex, styled } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import { type ParentComponent } from 'solid-js';
import { MxcAvatar } from '../mxc-avatar/MxcAvatar';

type MessageProps = {
  name?: string;
  avatar?: string;
  userId: string;
};

export const Message: ParentComponent<MessageProps> = (props) => {
  return (
    <Flex direction='row' gap='2'>
      <MxcAvatar src={props.avatar} flexShrink='0' />
      <Flex direction='column'>
        <styled.p fontWeight='bold'>{props.name ?? props.userId}</styled.p>
        {props.children}
      </Flex>
    </Flex>
  );
};
