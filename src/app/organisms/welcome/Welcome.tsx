import { type Component } from 'solid-js';
import { Box, styled } from '~styled/jsx';

export const Welcome: Component = () => {
  return (
    <Box
      display={{ base: 'hidden', md: 'flex' }}
      flexGrow='1'
      alignItems='center'
      justifyContent='center'
      w='full'
      h='dvh'
    >
      <styled.p fontWeight='700' color='mauve.11' textStyle='xl'>
        Have a nice day.
      </styled.p>
    </Box>
  );
};
