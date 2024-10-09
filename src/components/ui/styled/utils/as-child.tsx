import { PolymorphicProps } from '@ark-ui/solid';
import { FlowComponent, JSX, ParentComponent, splitProps } from 'solid-js';

type HTMLElements = keyof JSX.IntrinsicElements;

/**
 * The component type for `AsChild` components.
 */
export type AsChildComponent<E extends HTMLElements, P extends PolymorphicProps<E>> = FlowComponent<
  Omit<P, 'asChild' | 'children'>,
  P['asChild']
>;

/**
 * Decorates a function with an `AsChild` component.
 *
 * `AsChild` component uses `children` prop to function as `asChild`.
 * This is used to help Solid users as `@ark-ui/solid` requires the `asChild`
 * prop to be a function instead of a boolean.
 *
 * @param Component The component to decorate.
 * @returns The decorated component with an `AsChild` component.
 */
export function asChild<E extends HTMLElements, P extends PolymorphicProps<E>>(Component: ParentComponent<P>) {
  const AsChild: AsChildComponent<E, P> = (props) => {
    const [asChildProps, rootProps] = splitProps(props, ['children']);

    // @ts-expect-error Computing props is probably not worth it.
    return <Component {...rootProps} asChild={asChildProps.children} />;
  };

  return Object.assign(Component, { AsChild });
}
