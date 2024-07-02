import { Root, Trigger, Portal, Arrow, Content } from '@kobalte/core/tooltip';
import { styled } from '~styled/jsx';

const TooltipRoot = Root;

const TooltipContent = styled(Content, {
  base: {
    rounded: 'lg',
    padding: '2',
    bg: 'slate.800',
    color: 'white',
  },
});

const Tooltip = Object.assign(TooltipRoot, {
  Trigger,
  Portal,
  Arrow,
  Content: TooltipContent,
});

export default Tooltip;
