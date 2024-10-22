import type { ComponentProps, ValidComponent } from 'solid-js';
import { styled } from '~styled/jsx';
import { type TypographyVariantProps, typography } from '~styled/recipes';
import type { StyledComponent } from '~styled/types';

type BaseTypographyProps = TypographyVariantProps & { as?: ValidComponent };

export type TypographyProps = ComponentProps<typeof Typography>;
export const Typography = styled('div', typography) as StyledComponent<
  'div',
  BaseTypographyProps
>;
