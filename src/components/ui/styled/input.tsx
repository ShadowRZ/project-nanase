import { ark } from '@ark-ui/solid';
import type { ComponentProps } from 'solid-js';
import { styled } from '~styled/jsx';
import { input } from '~styled/recipes';

export type InputProps = ComponentProps<typeof Input>;
export const Input = styled(ark.input, input);
