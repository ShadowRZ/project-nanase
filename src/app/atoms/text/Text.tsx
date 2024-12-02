import { type PolymorphicProps } from '@kobalte/core/polymorphic';
import { splitProps, type ValidComponent } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import {
  css,
  cva,
  cx,
  type RecipeVariantProps,
  type Styles,
} from '@shadowrz/hanekokoro-ui/styled-system/css';

const text = cva({
  base: {
    margin: '0',
    padding: '0',
  },
  variants: {
    content: {
      truncate: {
        minWidth: '0',
        truncate: true,
      },
    },
    font: {
      bold: { fontWeight: 'bold' },
      italic: { fontStyle: 'italic' },
    },
    size: {
      default: {
        textStyle: 'md',
      },
      large: {
        textStyle: 'lg',
      },
      medium: {
        textStyle: 'xl',
      },
      small: {
        textStyle: 'sm',
      },
      smaller: {
        textStyle: 'xs',
      },
    },
    color: {
      dimmed: { color: 'mauve.11' },
      warning: { color: 'yellow.11' },
      error: { color: 'red.11' },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type TextVariants = NonNullable<RecipeVariantProps<typeof text>>;

function Text<T extends ValidComponent = 'p'>(
  props: PolymorphicProps<T, TextVariants & { css?: Styles }>
) {
  const [, cssProp, variants, others] = splitProps(
    props,
    ['as'],
    ['css'],
    ['content', 'font', 'color', 'size']
  );

  return (
    <Dynamic
      component={props.as ?? 'p'}
      {...others}
      class={cx(text(variants), css(cssProp.css), props.class)}
    />
  );
}

export default Text;
