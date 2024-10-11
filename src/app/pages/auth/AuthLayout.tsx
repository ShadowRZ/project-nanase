import { type ParentComponent } from 'solid-js';
import AuthFooter from './AuthFooter';
import { Flex } from '~styled/jsx';
import { Card } from '~/components/ui/card';

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
