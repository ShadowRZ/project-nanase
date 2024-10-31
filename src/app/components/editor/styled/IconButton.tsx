import { ark } from '@ark-ui/solid';
import type { ComponentProps } from 'solid-js';
import { styled } from '~styled/jsx';
import { type ButtonVariantProps, button } from '~styled/recipes';
export type IconButtonProps = ComponentProps<typeof IconButton>;
export const IconButton = styled(ark.button, button, {
  defaultProps: {
    px: '0',
    py: '0',
    '& svg': { w: '5', h: '5' },
  } as ButtonVariantProps,
});
