import { type Component } from 'solid-js';
import { Avatar } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { Flex } from '~styled/jsx';
import { MatrixClient } from 'matrix-js-sdk';
import { MxcImg } from '~/app/components/mxc-img/MxcImg';

export type ClientProfileProps = {
  mx: MatrixClient;
  avatar?: string;
  name?: string;
  userId: string;
};

const ProfileContent: Component<ClientProfileProps> = (props) => {
  return (
    <Flex direction='row' gap='2' alignItems='center'>
      <Avatar.WithComponent>
        {(imgProps) => (
          <MxcImg {...imgProps()} src={props.avatar} client={props.mx} />
        )}
      </Avatar.WithComponent>
      <Flex direction='column' overflow='hidden'>
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
