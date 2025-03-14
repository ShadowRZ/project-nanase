import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';
import { type ParentComponent } from 'solid-js';
import { MxcAvatar } from '../mxc-avatar/MxcAvatar';
import { Time } from '../time/Time';

type StateProps = {
  name?: string;
  avatar?: string;
  userId: string;
  timestamp: number;
};

export const State: ParentComponent<StateProps> = (props) => {
  return (
    <Flex
      direction='row'
      pr='1'
      pl='4'
      gap='2'
      overflow='hidden'
      alignItems='center'
    >
      <MxcAvatar size='sm' src={props.avatar} flexShrink='0' />
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
