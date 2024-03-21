import { fromDom } from 'hast-util-from-dom';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Switch, Match } from 'solid-js'; // eslint-disable-line no-unused-vars
import linkifyElement from 'linkify-element';
import { Fragment, jsx, jsxs } from 'solid-js/h/jsx-runtime';
import { isEmojiOnly } from '~/app/utils/message';
import { sanitizeMatrixHtml } from '~/lib/utils/sanitize';

export function renderTextContent(content, _roomId) {
  // eslint-disable-next-line no-undef
  const node = document.createElement('span');
  if (content.format === 'org.matrix.custom.html') {
    node.innerHTML = sanitizeMatrixHtml(content.formatted_body);
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
              {/* <Match when={'data-project-nanase-pill' in props}>
                <HoverableMention
                  roomId={roomId}
                  userId={props['data-project-nanase-pill']}
                  avatar={undefined}
                />
              </Match> */}
              <Match when={'data-mx-spoiler' in props}>
                <span class='px-1 bg-black dark:bg-white text-transparent hover:text-white dark:hover:text-black'>
                  {props.children}
                </span>
              </Match>
            </Switch>
          ),
        },
      })}
    </>
  );
}
