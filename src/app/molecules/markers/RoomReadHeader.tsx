import { Separator } from '@kobalte/core';
import { type Component } from 'solid-js';
import Text from '~/app/atoms/text/Text';

const RoomReadHeader: Component = () => {
  return (
    <div>
      <Text class='text-right' font='bold'>
        NEW
      </Text>
      <Separator.Root class='mt-1 border-1' />
    </div>
  );
};

export default RoomReadHeader;
