import { type Component } from 'solid-js';
import Text from '~/app/atoms/text/Text';
import ArrowBendLeftDownDuotone from '~icons/ph/arrow-bend-left-down-duotone';

const RoomBeginning: Component = () => {
  return (
    <div class='flex flex-col gap-2 text-2xl opacity-50 grow justify-end px-6 py-4'>
      <div class='flex flex-row gap-2 items-center'>
        <ArrowBendLeftDownDuotone />
        <Text font='bold'>This is the start of the conversation.</Text>
      </div>
    </div>
  );
};

export default RoomBeginning;
