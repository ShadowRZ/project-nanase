import { type Assign, HoverCard } from '@ark-ui/solid';
import type { ComponentProps } from 'solid-js';
import { type HoverCardVariantProps, hoverCard } from '~styled/recipes';
import type { HTMLStyledProps } from '~styled/types';
import { createStyleContext } from './utils/create-style-context';
import { asChild } from './utils/as-child';

const { withRootProvider, withContext } = createStyleContext(hoverCard);

export type RootProviderProps = ComponentProps<typeof RootProvider>;
export const RootProvider = withRootProvider<Assign<HoverCard.RootProviderProps, HoverCardVariantProps>>(
  HoverCard.RootProvider
);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withRootProvider<Assign<HoverCard.RootProps, HoverCardVariantProps>>(HoverCard.Root);

export const Arrow = withContext<Assign<HTMLStyledProps<'div'>, HoverCard.ArrowBaseProps>>(HoverCard.Arrow, 'arrow');

export const ArrowTip = withContext<Assign<HTMLStyledProps<'div'>, HoverCard.ArrowTipBaseProps>>(
  HoverCard.ArrowTip,
  'arrowTip'
);

export const Content = withContext<Assign<HTMLStyledProps<'div'>, HoverCard.ContentBaseProps>>(
  HoverCard.Content,
  'content'
);

export const Positioner = withContext<Assign<HTMLStyledProps<'div'>, HoverCard.PositionerBaseProps>>(
  HoverCard.Positioner,
  'positioner'
);

export const Trigger = asChild(
  withContext<Assign<HTMLStyledProps<'button'>, HoverCard.TriggerBaseProps>>(HoverCard.Trigger, 'trigger')
);

export { HoverCardContext as Context } from '@ark-ui/solid';
