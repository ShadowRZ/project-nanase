import linkifyElement from 'linkify-element';
import { type Component, Match, Switch } from 'solid-js';
import { sanitizeMatrixHtml } from '../../../lib/utils/sanitize';
import type { MaybeFormattedMessage } from '../../../types/event-content';
import { useHTMLParser } from '../../hooks/useHTMLParser';
import { HTMLContent } from '../html-content/HTMLContent';

const TextRenderer: Component<{ body: string }> = (props) => {
  const body = () => props.body;
  const node = () => {
    const $node = document.createElement('template');
    $node.innerText = body();
    return $node;
  };
  const renderered = () =>
    linkifyElement(node(), {
      rel: 'noopener',
      target: '_blank',
      ignoreTags: ['pre', 'code'],
    });

  return <HTMLContent element={renderered()} />;
};

const HTMLRenderer: Component<{ body: string }> = (props) => {
  const { parse } = useHTMLParser();
  const body = () => props.body;
  const node = () => parse(sanitizeMatrixHtml(body()));
  const renderered = () =>
    linkifyElement(node(), {
      rel: 'noopener',
      target: '_blank',
      ignoreTags: ['pre', 'code'],
    });

  return <HTMLContent element={renderered()} />;
};

export const FormattedRenderer: Component<{
  content: MaybeFormattedMessage;
}> = (props) => (
  <Switch fallback={<TextRenderer body={props.content.body} />}>
    <Match when={props.content.format === 'org.matrix.custom.html'}>
      <HTMLRenderer body={props.content.formatted_body as string} />
    </Match>
  </Switch>
);
