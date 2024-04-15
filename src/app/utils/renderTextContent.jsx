import { fromDom } from 'hast-util-from-dom';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Switch, Match } from 'solid-js';
import linkifyElement from 'linkify-element';
import { Fragment, jsx, jsxs } from 'solid-js/h/jsx-runtime';
import { getHttpUriForMxc } from 'matrix-js-sdk';
import { isEmojiOnly } from '~/app/utils/message';
import { sanitizeMatrixHtml } from '~/lib/utils/sanitize';

export function renderTextContent(content, _roomId, baseUrl) {
  const node = document.createElement('span');
  if (content.format === 'org.matrix.custom.html') {
    node.innerHTML = sanitizeMatrixHtml(content.formatted_body, baseUrl);
  } else {
    node.innerText = content.body;
  }

  linkifyElement(node, { rel: 'noopener', target: '_blank' });
  node.className = 'mx-prose max-w-none text-wrap';
  if (isEmojiOnly(content.body))
    node.className = 'mx-prose max-w-none text-wrap text-4xl';
  const hast = fromDom(node);

  return (
    <>
      {toJsxRuntime(hast, {
        Fragment,
        jsx,
        jsxs,
        elementAttributeNameCase: 'html',
        stylePropertyNameCase: 'css',
        components: {
          span: (props) => (
            <Switch fallback={<span {...props} />}>
              <Match when={'data-project-nanase-pill' in props}>
                <a
                  href={`https://matrix.to/#/${props['data-project-nanase-pill']}`}
                  target='_blank'
                >
                  {props['data-project-nanase-pill']}
                </a>
              </Match>
              <Match when={'data-mx-spoiler' in props}>
                <span class='px-1 bg-black dark:bg-white text-transparent hover:text-white dark:hover:text-black'>
                  {props.children}
                </span>
              </Match>
            </Switch>
          ),
          img: (props) => (
            <img
              {...props}
              class='inline-block'
              src={getHttpUriForMxc(
                baseUrl,
                props.src,
                undefined,
                undefined,
                undefined,
                true
              )}
            />
          ),
        },
      })}
    </>
  );
}
