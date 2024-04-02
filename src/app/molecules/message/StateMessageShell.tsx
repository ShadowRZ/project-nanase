import { type ParentComponent } from 'solid-js';
import Avatar from '~/app/atoms/avatar/Avatar';
import Text from '~/app/atoms/text/Text';
import Time from '~/app/atoms/time/Time';

type MessageProps = {
  name?: string;
  avatar?: string;
  userId: string;
  timestamp: number;
};

const StateMessageShell: ParentComponent<MessageProps> = (props) => {
  return (
    <div class='pr-1 pl-4 flex flex-row items-center gap-2 overflow-hidden'>
      <Avatar size='small' src={props.avatar} />
      <Text font='italic' class='opacity-50 flex-1'>
        <Text font='bold' as='span'>
          {props.name ?? props.userId}
        </Text>
        {props.children}
      </Text>
      <Text size='small' class='opacity-50'>
        <Time timestamp={props.timestamp} />
      </Text>
    </div>
  );
};

export default StateMessageShell;
