// https://github.com/cschroeter/park-ui/blob/53235fbaf69e5f6b8a1bb8d2518a5816475a1f3c/components/solid/src/components/ui/styled/utils/create-style-context.tsx
import { type JSX, createContext, useContext } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { cx } from '~styled/css';
import { isCssProperty, styled } from '~styled/jsx';
import type { ElementType, StyledComponent } from '~styled/types';

type Props = Record<string, unknown>;
type Recipe = {
  (props?: Props): Props;
  splitVariantProps: (props: Props) => [Props, Props];
};

type Slot<R extends Recipe> = keyof ReturnType<R>;
type Options = { forwardProps?: string[] };

const shouldForwardProp = (prop: string, variantKeys: string[], options: Options = {}) =>
  options.forwardProps?.includes(prop) || (!variantKeys.includes(prop) && !isCssProperty(prop));

export const createStyleContext = <R extends Recipe>(recipe: R) => {
  const StyleContext = createContext<Record<Slot<R>, string> | undefined>(undefined);

  const withRootProvider = <P extends Props>(Component: ElementType): ((props: P) => JSX.Element) => {
    const StyledComponent = (props: P) => {
      const [variantProps, localProps] = recipe.splitVariantProps(props);
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>;

      return (
        <StyleContext.Provider value={slotStyles}>
          <Component {...localProps} />
        </StyleContext.Provider>
      );
    };
    return StyledComponent;
  };

  const withProvider = <P extends { class?: string }>(
    Component: ElementType,
    slot: Slot<R>,
    options?: Options
  ): ((props: P) => JSX.Element) => {
    const StyledComponent = styled(
      Component,
      {},
      {
        shouldForwardProp: (prop, variantKeys) => shouldForwardProp(prop, variantKeys, options),
      }
    ) as StyledComponent<ElementType>;

    return (props: P) => {
      const [variantProps, localProps] = recipe.splitVariantProps(props);
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>;

      return (
        <StyleContext.Provider value={slotStyles}>
          <Dynamic component={StyledComponent} {...localProps} class={cx(slotStyles?.[slot], props.class)} />
        </StyleContext.Provider>
      );
    };
  };

  const withContext = <P extends { class?: string }>(
    Component: ElementType,
    slot: Slot<R>
  ): ((props: P) => JSX.Element) => {
    const StyledComponent = styled(Component);

    const Foo = (props: P) => {
      const slotStyles = useContext(StyleContext);
      return <Dynamic component={StyledComponent} {...props} class={cx(slotStyles?.[slot], props.class)} />;
    };
    return Foo;
  };

  return {
    withRootProvider,
    withProvider,
    withContext,
  };
};
