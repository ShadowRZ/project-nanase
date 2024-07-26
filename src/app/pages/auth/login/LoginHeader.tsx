import { type Component } from 'solid-js';
import { Flex, styled } from '~styled/jsx';

const LoginHeader: Component = () => (
  <Flex direction='column' mb='2'>
    <styled.span textStyle='xl' fontWeight='bold'>
      Sign In
    </styled.span>
    <styled.span>You need to provide your credentials to proceed.</styled.span>
  </Flex>
);

export default LoginHeader;
