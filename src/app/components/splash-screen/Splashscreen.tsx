import { ParentComponent } from 'solid-js';
import { Flex, styled } from '~styled/jsx';

export const SplashScreen: ParentComponent = (props) => (
  <Flex direction='column' minH='full'>
    <Flex grow='1' direction='column' align='center' justify='center' gap='2'>
      <styled.img
        w='32'
        h='32'
        rounded='2xl'
        src={`${import.meta.env.BASE_URL}pwa-512x512.png`}
      />
      {props.children}
    </Flex>
  </Flex>
);
