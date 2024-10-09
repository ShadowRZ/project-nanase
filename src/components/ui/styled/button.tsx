import { ark } from '@ark-ui/solid';
import type { ComponentProps } from 'solid-js';
import { styled } from '~styled/jsx';
import { button } from '~styled/recipes';
import { asChild } from './utils/as-child';

export type ButtonProps = ComponentProps<typeof Button>;
export const Button = asChild(styled(ark.button, button));
