import { fromDom } from 'hast-util-from-dom';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import linkifyElement from 'linkify-element';
import { getHttpUriForMxc } from 'matrix-js-sdk';
import { Match, Show, Switch } from 'solid-js';
import { Fragment, jsx, jsxs } from 'solid-js/h/jsx-runtime';
import HighlightCode from '~/app/components/highlight/HighlightCode';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createRoomScopedProfile } from '~/app/hooks/createRoomScopedProfile';
import { isEmojiOnly } from '~/app/utils/message';
import { sanitizeMatrixHtml } from '~/lib/utils/sanitize';
import ArrowRightBold from '~icons/ph/arrow-right-bold';

export function renderTextContent(content, roomId, baseUrl) {
  const node = document.createElement('span');
  if (content.format === 'org.matrix.custom.html') {
    node.innerHTML = sanitizeMatrixHtml(content.formatted_body, baseUrl);
  } else {
    node.innerText = content.body;
  }

  linkifyElement(node, {
    rel: 'noopener',
    target: '_blank',
    ignoreTags: ['pre', 'code'],
  });

  let className = 'mx-prose max-w-none text-wrap first:mt-0 last:mb-0';
  if (isEmojiOnly(content.body)) className += ' text-4xl';
  node.className = className;

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
            <Switch
              fallback={
                <span
                  {...props}
                  style={{
                    color: props['data-mx-color'],
                    'background-color': props['data-mx-bg-color'],
                  }}
                />
              }
            >
              <Match when={'data-project-nanase-pill' in props}>
                <a
                  href={props['data-project-nanase-href']}
                  target='_blank'
                  class='color-[--project-nanase-pills] no-underline font-bold'
                >
                  {props.children}
                </a>
              </Match>
              <Match when={'data-project-nanase-reference' in props}>
                <a
                  href={props['data-project-nanase-href']}
                  target='_blank'
                  class='color-[--project-nanase-pills] no-underline font-bold'
                >
                  <Show
                    when={
                      props.children.toString() ===
                      props['data-project-nanase-href']
                    }
                    fallback={props.children}
                  >
                    {props['data-project-nanase-reference']}
                  </Show>
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
          font: (props) => (
            <span
              style={{
                color: props.color,
                'font-family': props.face,
              }}
            >
              {props.children}
            </span>
          ),
          a: (props) => (
            <Show
              when={props.href.startsWith('https://matrix.to/#/')}
              fallback={<a {...props} />}
            >
              <MatrixLink link={props.href} roomId={roomId} />
            </Show>
          ),
          code: (props) => <HighlightCode>{props.children}</HighlightCode>,
        },
      })}
    </>
  );
}

function MatrixLink(props) {
  const userLink = () =>
    /^https?:\/\/matrix.to\/#\/(@.+:.+)/.exec(decodeURIComponent(props.link));
  const roomAliasLink = () =>
    /^https?:\/\/matrix.to\/#\/(#.+:.+)/.exec(decodeURIComponent(props.link));
  const roomLink = () =>
    /^https?:\/\/matrix.to\/#\/(![^/]+:[^/]+)(?:\/(\$[^/]+))?(?:\?(.+))?/.exec(
      decodeURIComponent(props.link)
    );
  const roomId = () => props.roomId;

  function renderRoomLink(result) {
    const part1 = result[1];
    const part2 = result[2] ? `/${result[2]}` : '';
    const part3 = result[3] ? `?${result[3]}` : '';
    return `https://matrix.to/#/${part1}${part2}${part3}`;
  }

  return (
    <Switch>
      <Match when={userLink() !== null}>
        <a
          href={`https://matrix.to/#/${userLink()[1]}`}
          target='_blank'
          class='color-[--project-nanase-pills] no-underline font-bold'
        >
          @<UserName roomId={roomId()} userId={userLink()[1]} />
        </a>
      </Match>
      <Match when={roomAliasLink() !== null}>
        <a
          href={`https://matrix.to/#/${roomAliasLink()[1]}`}
          target='_blank'
          class='color-[--project-nanase-pills] no-underline font-bold'
        >
          <ArrowRightBold class='inline mb-0.5' /> {roomAliasLink()[1]}
        </a>
      </Match>
      <Match when={roomLink() !== null}>
        <a
          href={renderRoomLink(roomLink())}
          target='_blank'
          class='color-[--project-nanase-pills] no-underline font-bold'
        >
          <ArrowRightBold class='inline mb-0.5' />{' '}
          {roomLink()[2] ? 'Event In ' : ''}
          <RoomName roomId={roomLink()[1]} />
        </a>
      </Match>
    </Switch>
  );
}

function RoomName(props) {
  const roomId = () => props.roomId;
  const { name } = createRoomResource(roomId);

  return <>{name() ?? roomId()}</>;
}

function UserName(props) {
  const roomId = () => props.roomId;
  const userId = () => props.userId;
  const { name } = createRoomScopedProfile(roomId, userId);

  return <>{name() ?? userId()}</>;
}
