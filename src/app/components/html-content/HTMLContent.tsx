import { Component, createMemo, For, Show, type JSX } from 'solid-js';
import { Spoiler } from '../spoiler/Spoiler';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import HighlightCode from '../highlight/HighlightCode';
import { MxcImg } from '../mxc-img/MxcImg';
import { Dynamic } from 'solid-js/web';

type ReplaceComponents = Partial<{
  [K in keyof JSX.IntrinsicElements]: (
    element: Element
  ) => Component<JSX.IntrinsicElements[K]>;
}>;

const replace: ReplaceComponents = {
  span: () => (props) => (
    <Show
      when={Object.hasOwn(props, 'data-mx-spoiler')}
      fallback={<span {...props} />}
    >
      <Spoiler>{props.children}</Spoiler>
    </Show>
  ),
  img: () => (props) => {
    const mx = useMatrixClient();
    return (
      <MxcImg {...props} client={mx()} src={props.src} display='inline-block' />
    );
  },
  code: () => (props) => <HighlightCode>{props.children}</HighlightCode>,
};

const toProps = (attrs: NamedNodeMap) => {
  const ret = {} as Record<string, string>;

  for (const attr of attrs) {
    ret[attr.localName] = attr.value;
  }

  return ret;
};

const toJSX = (node: Node): JSX.Element => {
  if (node.nodeType == Node.ELEMENT_NODE) {
    const elem = node as Element;
    const tagName = elem.localName;
    const props = toProps(elem.attributes);
    const comp = Object.hasOwn(replace, tagName)
      ? replace[tagName as keyof JSX.IntrinsicElements]?.(elem)
      : tagName;
    return (
      <Dynamic {...props} component={comp}>
        <Show when={node.hasChildNodes()}>
          <For each={[...node.childNodes]}>{($node) => toJSX($node)}</For>
        </Show>
      </Dynamic>
    );
  } else {
    return node;
  }
};

export const HTMLContent: Component<{ element: HTMLElement }> = (props) => {
  const node = createMemo(() => props.element);

  const converted = () => {
    const $node = node();
    return [...$node.childNodes].map((node) =>
      toJSX(node)
    ) satisfies JSX.Element;
    // // Process <img /> tags.
    // for (const item of $node.querySelectorAll('img')) {
    //   const src = item.src;
    //   const jsx = toNode(
    //     <MxcImg client={mx()} src={src} display='inline-block' />
    //   );
    //   if (jsx) item.replaceChildren(...jsx);
    // }
    // // Migrate <font />
    // for (const item of $node.querySelectorAll('font')) {
    //   const replaced = document.createElement('span');
    //   replaced.innerHTML = item.innerHTML;
    //   item.replaceWith(replaced);
    //   replaced.style.setProperty('color', item.color);
    //   replaced.style.setProperty('font-family', item.face);
    // }
    // // Add highlight to <code />
    // for (const item of $node.querySelectorAll('code')) {
    //   const children = [...item.childNodes];
    //   const jsx = toNode(<HighlightCode>{children}</HighlightCode>);
    //   if (jsx) item.replaceChildren(...jsx);
    // }
    // // Process <span />
    // for (const item of $node.querySelectorAll('span')) {
    //   if (Object.hasOwn(item.dataset, 'mxSpoiler')) {
    //     const children = [...item.childNodes];
    //     const jsx = toNode(<Spoiler>{children}</Spoiler>);
    //     if (jsx) item.replaceChildren(...jsx);
    //   } else {
    //     // eslint-disable-next-line unicorn/no-null
    //     item.style.setProperty('color', item.dataset.mxColor ?? null);
    //     item.style.setProperty(
    //       'background-color',
    //       // eslint-disable-next-line unicorn/no-null
    //       item.dataset.mxBgColor ?? null
    //     );
    //   }
    // }
  };

  return converted as unknown as JSX.Element;
};
