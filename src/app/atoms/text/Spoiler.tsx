import { type ParentComponent } from 'solid-js';
import { styled } from '~styled/jsx';

const Span = styled('span', {
  base: {
    transition: 'common',
    backgroundColor: 'black',
    color: 'transparent',
    _hover: {
      color: 'white',
    },
  },
});

const Spoiler: ParentComponent = (props) => {
  return <Span>{props.children}</Span>;
};

export default Spoiler;
