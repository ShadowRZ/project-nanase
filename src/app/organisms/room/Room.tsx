import { Rerun } from '@solid-primitives/keyed';
import { useNavigate } from '@solidjs/router';
import { type JSONContent } from '@tiptap/core';
import { ContentHelpers } from 'matrix-js-sdk';
import { Show, createMemo, createSignal, type Component } from 'solid-js';
import RoomTimeline from './RoomTimeline';
import Editor, {
  customHtmlEqualsPlainText,
} from '~/app/components/editor/Editor';
import EditorReference from '~/app/components/editor/EditorReference';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { createRoomEvents } from '~/app/hooks/createRoomEvents';
import createRoomOnLeaveEffect from '~/app/hooks/createRoomOnLeaveEffect';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createTypings } from '~/app/hooks/createTypings';
import RoomIntro from '~/app/molecules/room-intro/RoomIntro';
import { isPlain, proseJSONToHTML } from '~/app/utils/proseJSON';
import {
  getEditedEvent,
  parseReplyBody,
  parseReplyFormattedBody,
} from '~/app/utils/room';
import { sanitizeMatrixHtml, sanitizeText } from '~/lib/utils/sanitize';
import { type AnyMessage } from '~/types/event-content';
import { type RelationData } from '~/types/room';

type RoomProps = {
  roomId: string;
};

const Room: Component<RoomProps> = (props) => {
  const client = createCurrentClientResource();
  const roomId = createMemo(() => props.roomId);
  const { name, topic, avatar } = createRoomResource(roomId);
  const { timelineSet } = createRoomEvents(roomId);
  const typings = createTypings();
  const [relationData, setRelationData] = createSignal<
    RelationData | undefined
  >(undefined, { equals: false });

  const navigate = useNavigate();
  createRoomOnLeaveEffect(roomId, () => {
    navigate('/rooms', { replace: true });
  });

  const onSend = (doc: JSONContent, text: string) => {
    const html = proseJSONToHTML(doc);
    const plain = customHtmlEqualsPlainText(html, text);
    const thisRelation = relationData();
    setRelationData(undefined);
    if (thisRelation !== undefined && thisRelation.type === 'reply') {
      const eventId = thisRelation.eventId;
      const event = timelineSet()!.findEventById(eventId)!;
      const edited = getEditedEvent(timelineSet()!, event);
      const content =
        (edited?.getContent()?.['m.new_content'] as AnyMessage | undefined) ??
        event.getContent<AnyMessage>();
      const replyBody = content.body;
      const replyFormattedBody =
        content.formatted_body === undefined
          ? sanitizeText(replyBody)
          : sanitizeMatrixHtml(content.formatted_body as string, true);

      const body = parseReplyBody(event.getSender()!, replyBody) + text;
      let htmlBody = parseReplyFormattedBody(
        roomId(),
        event.getSender()!,
        eventId,
        replyFormattedBody
      );
      htmlBody = plain ? htmlBody + text : htmlBody + html;

      const sendContent = ContentHelpers.makeHtmlMessage(body, htmlBody);

      sendContent['m.relates_to'] = {
        'm.in_reply_to': {
          event_id: eventId,
        },
      };

      client()!
        .sendEvent(roomId(), 'm.room.message', sendContent)
        .catch(() => {});

      return;
    }

    if (plain) {
      client()!
        .sendTextMessage(roomId(), text)
        .catch(() => {});
    } else {
      const html = proseJSONToHTML(doc);
      client()!
        .sendHtmlMessage(roomId(), text, html)
        .catch(() => {});
    }
  };

  return (
    <div class='flex flex-col h-dvh'>
      <RoomIntro name={name() ?? roomId()} topic={topic()} avatar={avatar()} />
      <Rerun on={roomId}>
        <RoomTimeline roomId={roomId()} setRelationData={setRelationData} />
      </Rerun>
      <div class='py-1 border-t-1 border-slate-200 dark:border-slate-800'>
        <Show when={relationData() !== undefined}>
          <EditorReference
            roomId={roomId()}
            relationData={relationData()!}
            onClose={() => {
              setRelationData(undefined);
            }}
          />
        </Show>
        <Editor onSend={onSend} />
      </div>
    </div>
  );
};

export default Room;
