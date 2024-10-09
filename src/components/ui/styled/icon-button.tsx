import { ark } from '@ark-ui/solid';
import type { ComponentProps } from 'solid-js';
import { styled } from '~styled/jsx';
import { type ButtonVariantProps, button } from '~styled/recipes';
import { asChild } from './utils/as-child';

export type IconButtonProps = ComponentProps<typeof IconButton>;
export const IconButton = asChild(
  styled(ark.button, button, {
    defaultProps: { px: '0', py: '0' } as ButtonVariantProps,
  })
);
