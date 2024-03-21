import { splitProps, type Component, type ParentComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import Avatar from '~/app/atoms/avatar/Avatar';
import Text from '~/app/atoms/text/Text';

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
  return <Avatar size='large' src={props.avatar} />;
};

const StaticText: Component<BaseMessageProps> = (props) => {
  return <Text font='bold'>{props.name ?? props.userId}</Text>;
};

const MessageShell: ParentComponent<MessageProps> = (props) => {
  const [base] = splitProps(props, ['name', 'avatar', 'userId']);
  return (
    <div class='flex flex-row gap-2'>
      <Dynamic component={props.avatarComponent ?? StaticAvatar} {...base} />
      <div class='flex flex-col'>
        <Dynamic component={props.nameComponent ?? StaticText} {...base} />
        {props.children}
      </div>
    </div>
  );
};

export default MessageShell;
