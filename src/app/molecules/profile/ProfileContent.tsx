import { type Component } from 'solid-js';
import Avatar from '~/app/atoms/avatar/Avatar';
import Text from '~/app/atoms/text/Text';

export type ClientProfileProps = {
  avatar?: string;
  name?: string;
  userId: string;
};

const ProfileContent: Component<ClientProfileProps> = (props) => {
  return (
    <div class='flex flex-row gap-2 items-center'>
      <Avatar src={props.avatar} size='large' />
      <div class='flex flex-col overflow-hidden'>
        <Text title={props.name ?? props.userId} font='bold' content='truncate'>
          {props.name ?? props.userId}
        </Text>
        <Text title={props.userId} content='truncate'>
          {props.userId}
        </Text>
      </div>
    </div>
  );
};

export default ProfileContent;
