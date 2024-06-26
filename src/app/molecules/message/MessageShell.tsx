import { splitProps, type Component, type ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Avatar from '~/app/components/avatar/Avatar';
import Text from '~/app/atoms/text/Text';
import { Flex } from '~styled/jsx';

type BaseMessageProps = {
  name?: string;
  avatar?: string;
  userId: string;
};

type MessageProps = {
  nameComponent?: Component<BaseMessageProps>;
  avatarComponent?: Component<BaseMessageProps>;
} & BaseMessageProps;

const StaticAvatar: Component<BaseMessageProps> = (props) => {
  return <Avatar.Img size='large' src={props.avatar} />;
};

const StaticText: Component<BaseMessageProps> = (props) => {
  return <Text font='bold'>{props.name ?? props.userId}</Text>;
};

const MessageShell: ParentComponent<MessageProps> = (props) => {
  const [base] = splitProps(props, ['name', 'avatar', 'userId']);
  return (
    <Flex direction='row' gap='2'>
      <Dynamic component={props.avatarComponent ?? StaticAvatar} {...base} />
      <Flex direction='column'>
        <Dynamic component={props.nameComponent ?? StaticText} {...base} />
        {props.children}
      </Flex>
    </Flex>
  );
};

export default MessageShell;
