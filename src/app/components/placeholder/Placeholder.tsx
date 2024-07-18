import { type Component } from 'solid-js';
import { Circle, Flex, styled } from '~styled/jsx';

const Placeholder: Component = () => {
  return (
    <Flex
      direction='row'
      alignItems='center'
      gap='2'
      w='full'
      animation='pulse'
    >
      <Circle size='12' bg='slate.3' />
      <Flex direction='column' gap='1' grow='1' overflow='hidden'>
        <styled.span rounded='lg' bg='slate.3' w='1/4' h='5' />
        <styled.span rounded='lg' bg='slate.3' w='1/2' h='5' />
      </Flex>
    </Flex>
  );
};

export default Placeholder;
