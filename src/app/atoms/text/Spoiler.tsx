import { type ParentComponent } from 'solid-js';
import { styled } from '~styled/jsx';

const Span = styled('span', {
  base: {
    transitionProperty: 'color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
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
