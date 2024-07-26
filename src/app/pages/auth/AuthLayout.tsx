import { type ParentComponent } from 'solid-js';
import AuthFooter from './AuthFooter';
import Panel from '~/app/atoms/panel/Panel';
import { Flex } from '~styled/jsx';

const AuthLayout: ParentComponent = (props) => {
  return (
    <Flex direction='column' h='full' overflowY='scroll' scrollbar='hidden'>
      <Flex flex='1' justifyContent='center' mx='8' my='16'>
        <Panel decoration='all' p='4' w='md' h='fit'>
          {props.children}
        </Panel>
      </Flex>
      <AuthFooter />
    </Flex>
  );
};

export default AuthLayout;
