import { type Component } from 'solid-js';
import { styled } from '~styled/jsx';

const Wrapper = styled('span', {
  base: {
    display: 'inline-flex',
    rounded: 'full',
    width: 'fit-content',
    minWidth: '6',
    height: '6',
    px: '1',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'medium',
  },
  variants: {
    highlight: {
      false: {
        backgroundColor: 'mauve.3',
        color: 'mauve.12',
      },
      true: {
        backgroundColor: 'ruby.9',
        color: 'white',
      },
    },
  },
});

type NotificationCountProps = {
  count: number;
  highlight?: boolean;
};

const NotificationCount: Component<NotificationCountProps> = (props) => (
  <Wrapper highlight={props.highlight ?? false}>{props.count}</Wrapper>
);

export default NotificationCount;
