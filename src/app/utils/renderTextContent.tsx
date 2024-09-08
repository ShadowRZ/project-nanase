import linkifyElement from 'linkify-element';
import { getHttpUriForMxc } from 'matrix-js-sdk';
import { type Component, Match, Switch, createComponent } from 'solid-js';
import { render } from 'solid-js/web';
import Spoiler from '~/app/atoms/text/Spoiler';
import HighlightCode from '~/app/components/highlight/HighlightCode';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createRoomScopedProfile } from '~/app/hooks/createRoomScopedProfile';
import { isEmojiOnly } from '~/app/utils/message';
import { sanitizeMatrixHtml } from '~/lib/utils/sanitize';
import { type MaybeFormattedMessage } from '~/types/event-content';
import ArrowRightBold from '~icons/ph/arrow-right-bold';

export function renderTextContent(
  content: MaybeFormattedMessage,
  roomId: string,
  baseUrl: string
) {
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

  // Process <img /> tags.
  for (const item of node.querySelectorAll('img')) {
    const src = item.src;
    item.classList.add('inline-block');
    item.src = getHttpUriForMxc(
      baseUrl,
      src,
      undefined,
      undefined,
      undefined,
      true
    );
  }

  // Migrate <font />
  for (const item of node.querySelectorAll('font')) {
    const replaced = document.createElement('span');
    replaced.innerHTML = item.innerHTML;
    item.replaceWith(replaced);
    replaced.style.setProperty('color', item.color);
    replaced.style.setProperty('font-family', item.face);
  }

  // Add highlight to <code />
  for (const item of node.querySelectorAll('code')) {
    const children = [...item.childNodes];
    item.replaceChildren();
    render(
      () =>
        createComponent(HighlightCode, {
          children,
        }),
      item
    );
  }

  // Process <span />
  for (const item of node.querySelectorAll('span')) {
    if (Object.hasOwn(item.dataset, 'mxSpoiler')) {
      const children = [...item.childNodes];
      item.replaceChildren();
      render(
        () =>
          createComponent(Spoiler, {
            children,
          }),
        item
      );
    } else {
      // eslint-disable-next-line unicorn/no-null
      item.style.setProperty('color', item.dataset.mxColor ?? null);
      item.style.setProperty(
        'background-color',
        // eslint-disable-next-line unicorn/no-null
        item.dataset.mxBgColor ?? null
      );
    }
  }

  for (const item of node.querySelectorAll('a[href^="https://matrix.to/#/"]')) {
    // @ts-expect-error TypeScript insists the line above produces Element not HTMLAnchorElement.
    const link = item.href as string;
    item.replaceChildren();
    render(
      () =>
        createComponent(MatrixLink, {
          link,
          roomId,
        }),
      item
    );
  }

  return <>{node}</>;
}

type MatrixLinkProps = {
  link: string;
  roomId: string;
};

function renderRoomLink(result: RegExpExecArray) {
  const part1 = result[1];
  const part2 = result[2] ? `/${result[2]}` : '';
  const part3 = result[3] ? `?${result[3]}` : '';
  return `https://matrix.to/#/${part1}${part2}${part3}`;
}

const MatrixLink: Component<MatrixLinkProps> = (props) => {
  const userLink = () =>
    /^https?:\/\/matrix.to\/#\/(@.+:.+)/.exec(decodeURIComponent(props.link));
  const roomAliasLink = () =>
    /^https?:\/\/matrix.to\/#\/(#.+:.+)/.exec(decodeURIComponent(props.link));
  const roomLink = () =>
    /^https?:\/\/matrix.to\/#\/(![^/]+:[^/]+)(?:\/(\$[^/]+))?(?:\?(.+))?/.exec(
      decodeURIComponent(props.link)
    );
  const roomId = () => props.roomId;

  return (
    <Switch>
      <Match when={userLink() !== null}>
        <a
          href={`https://matrix.to/#/${userLink()![1]}`}
          target='_blank'
          class='color-[--project-nanase-pills] no-underline font-bold'
        >
          @<UserName roomId={roomId()} userId={userLink()![1]} />
        </a>
      </Match>
      <Match when={roomAliasLink() !== null}>
        <a
          href={`https://matrix.to/#/${roomAliasLink()![1]}`}
          target='_blank'
          class='color-[--project-nanase-pills] no-underline font-bold'
        >
          <ArrowRightBold class='inline mb-0.5' /> {roomAliasLink()![1]}
        </a>
      </Match>
      <Match when={roomLink() !== null}>
        <a
          href={renderRoomLink(roomLink()!)}
          target='_blank'
          class='color-[--project-nanase-pills] no-underline font-bold'
        >
          <ArrowRightBold class='inline mb-0.5' />{' '}
          {roomLink()![2] ? 'Event In ' : ''}
          <RoomName roomId={roomLink()![1]} />
        </a>
      </Match>
    </Switch>
  );
};

type RoomNameProps = {
  roomId: string;
};

type UserNameProps = {
  roomId: string;
  userId: string;
};

const RoomName: Component<RoomNameProps> = (props) => {
  const roomId = () => props.roomId;
  const { name } = createRoomResource(roomId);

  return <>{name() ?? roomId()}</>;
};

const UserName: Component<UserNameProps> = (props) => {
  const roomId = () => props.roomId;
  const userId = () => props.userId;
  const { name } = createRoomScopedProfile(roomId, userId);

  return <>{name() ?? userId()}</>;
};
