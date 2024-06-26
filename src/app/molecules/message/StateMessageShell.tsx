import { type ParentComponent } from 'solid-js';
import Avatar from '~/app/components/avatar/Avatar';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';
import { Flex, styled } from '~styled/jsx';

type MessageProps = {
  name?: string;
  avatar?: string;
  userId: string;
  timestamp: number;
};

const StateMessageShell: ParentComponent<MessageProps> = (props) => {
  return (
    <Flex
      direction='row'
      pr='1'
      pl='4'
      gap='2'
      overflow='hidden'
      alignItems='center'
    >
      <Avatar.Img size='small' src={props.avatar} />
      <Text font='italic' css={{ flex: '1', opacity: '50' }}>
        <styled.span fontWeight='bold'>
          {props.name ?? props.userId}
        </styled.span>{' '}
        {props.children}
      </Text>
      <Text size='small' css={{ opacity: '50' }}>
        <Time timestamp={props.timestamp} />
      </Text>
    </Flex>
  );
};

export default StateMessageShell;
