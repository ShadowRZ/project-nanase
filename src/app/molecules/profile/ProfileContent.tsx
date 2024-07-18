import { type Component } from 'solid-js';
import Avatar from '~/app/components/avatar/Avatar';
import Text from '~/app/atoms/text/Text';
import { Flex } from '~styled/jsx';

export type ClientProfileProps = {
  avatar?: string;
  name?: string;
  userId: string;
};

const ProfileContent: Component<ClientProfileProps> = (props) => {
  return (
    <Flex direction='row' gap='2' alignItems='center'>
      <Avatar src={props.avatar} size='large' />
      <Flex direction='column' overflow='hidden'>
        <Text title={props.name ?? props.userId} font='bold' content='truncate'>
          {props.name ?? props.userId}
        </Text>
        <Text title={props.userId} content='truncate'>
          {props.userId}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProfileContent;
