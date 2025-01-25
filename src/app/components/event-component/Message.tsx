import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';
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
      <Flex direction='column' minW='0'>
        <styled.p fontWeight='bold' truncate minW='0'>
          {props.name ?? props.userId}
        </styled.p>
        {props.children}
      </Flex>
    </Flex>
  );
};
