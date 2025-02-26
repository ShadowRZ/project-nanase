import { Text } from '@hanekokoro-ui/solid';
import { Flex } from '@hanekokoro-ui/styled-system/jsx';
import { type Component } from 'solid-js';
import { MxcAvatar } from '../mxc-avatar/MxcAvatar';

export type ClientProfileProps = {
  avatar?: string;
  name?: string;
  userId: string;
};

const ProfileContent: Component<ClientProfileProps> = (props) => {
  return (
    <Flex direction='row' gap='2' alignItems='center' minW='0'>
      <MxcAvatar src={props.avatar} />
      <Flex direction='column' overflow='hidden' minW='0'>
        <Text
          title={props.name ?? props.userId}
          size='md'
          lineHeight='inherit'
          fontWeight='bold'
          minW='0'
          truncate
        >
          {props.name ?? props.userId}
        </Text>
        <Text size='sm' color='fg.muted' title={props.userId} minW='0' truncate>
          {props.userId}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProfileContent;
