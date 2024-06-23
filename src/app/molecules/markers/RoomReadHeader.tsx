import { Separator } from '@kobalte/core/separator';
import { type Component } from 'solid-js';
import Text from '~/app/atoms/text/Text';
import { divider } from '~styled/patterns';
import { styled } from '~styled/jsx';

const RoomReadHeader: Component = () => {
  return (
    <styled.div color='gray.11'>
      <Text font='bold' textAlign='right'>
        NEW
      </Text>
      <Separator class={divider({ orientation: 'horizontal' })} />
    </styled.div>
  );
};

export default RoomReadHeader;
