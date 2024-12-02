import type { JSX, ParentComponent } from 'solid-js';
import { Flex } from '@shadowrz/hanekokoro-ui/styled-system/jsx';

const ClientLayout: ParentComponent<{ nav?: JSX.Element }> = (props) => {
  return (
    <Flex grow='1'>
      {props.nav}
      {props.children}
    </Flex>
  );
};

export default ClientLayout;
