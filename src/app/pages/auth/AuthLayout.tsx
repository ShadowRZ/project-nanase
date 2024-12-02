import { type ParentComponent } from 'solid-js';
import AuthFooter from './AuthFooter';
import { Flex } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import { Card } from '@shadowrz/hanekokoro-ui';

const AuthLayout: ParentComponent = (props) => {
  return (
    <Flex direction='column' h='full' overflowY='scroll' scrollbar='hidden'>
      <Flex flex='1' justifyContent='center' mx='8' my='16'>
        <Card.Root p='2' w='md' h='fit'>
          {props.children}
        </Card.Root>
      </Flex>
      <AuthFooter />
    </Flex>
  );
};

export default AuthLayout;
