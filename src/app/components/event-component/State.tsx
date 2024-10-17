import { type ParentComponent } from 'solid-js';
import { useMatrixClient } from '~/app/hooks/useMatrixClient';
import { Flex, styled } from '~styled/jsx';
import { MxcAvatar } from '../mxc-avatar/MxcAvatar';
import { Time } from '../time/Time';

type StateProps = {
  name?: string;
  avatar?: string;
  userId: string;
  timestamp: number;
};

export const State: ParentComponent<StateProps> = (props) => {
  const mx = useMatrixClient();

  return (
    <Flex
      direction='row'
      pr='1'
      pl='4'
      gap='2'
      overflow='hidden'
      alignItems='center'
    >
      <MxcAvatar client={mx()} src={props.avatar} flexShrink='0' />
      <styled.p fontStyle='italic' flex='1' opacity='0.5'>
        <styled.span fontWeight='bold'>
          {props.name ?? props.userId}
        </styled.span>{' '}
        {props.children}
      </styled.p>
      <styled.p textStyle='sm' opacity='0.5'>
        <Time timestamp={props.timestamp} />
      </styled.p>
    </Flex>
  );
};
