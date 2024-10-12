import type { JSX, ParentComponent } from 'solid-js';
import { Flex } from '~styled/jsx';

const ClientLayout: ParentComponent<{ nav?: JSX.Element }> = (props) => {
  return (
    <Flex grow='1'>
      <Flex shrink='0'>{props.nav}</Flex>
      <Flex grow='1'>{props.children}</Flex>
    </Flex>
  );
};

export default ClientLayout;
