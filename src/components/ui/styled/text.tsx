import type { ComponentProps } from 'solid-js';
import { styled } from '~styled/jsx';
import { type TextVariantProps, text } from '~styled/recipes';
import type { StyledComponent } from '~styled/types';

type ParagraphProps = TextVariantProps & { as?: JSX.ElementType };

export type TextProps = ComponentProps<typeof Text>;
export const Text = styled('p', text) as StyledComponent<'p', ParagraphProps>;
