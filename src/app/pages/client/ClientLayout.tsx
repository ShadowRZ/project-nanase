import type { JSX, ParentComponent } from 'solid-js';
import { Flex } from '~styled/jsx';

const ClientLayout: ParentComponent<{ nav?: JSX.Element }> = (props) => {
  return (
    <Flex grow='1'>
      {props.nav}
      {props.children}
    </Flex>
  );
};

export default ClientLayout;
