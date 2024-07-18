import { type Component } from 'solid-js';
import Text from '~/app/atoms/text/Text';
import { Flex } from '~styled/jsx';
import ArrowBendLeftDownDuotone from '~icons/ph/arrow-bend-left-down-duotone';

const RoomBeginning: Component = () => {
  return (
    <Flex
      direction='column'
      gap='2'
      textStyle='2xl'
      opacity='50'
      grow='1'
      justifyContent='end'
      px='6'
      py='4'
    >
      <Flex direction='row' gap='2' alignItems='center'>
        <ArrowBendLeftDownDuotone />
        <Text font='bold'>This is the start of the conversation.</Text>
      </Flex>
    </Flex>
  );
};

export default RoomBeginning;
