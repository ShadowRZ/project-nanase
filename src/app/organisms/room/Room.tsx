import { Rerun } from '@solid-primitives/keyed';
import { useNavigate } from '@solidjs/router';
import { type JSONContent } from '@tiptap/core';
import { Show, createMemo, createSignal, type Component } from 'solid-js';
import RoomTimeline from './RoomTimeline';
import Editor from '~/app/components/editor/Editor';
import EditorReference from '~/app/components/editor/EditorReference';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import createRoomOnLeaveEffect from '~/app/hooks/createRoomOnLeaveEffect';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createTypings } from '~/app/hooks/createTypings';
import RoomIntro from '~/app/molecules/room-intro/RoomIntro';
import { isPlain, proseJSONToHTML } from '~/app/utils/proseJSON';
import { type RelationData } from '~/types/room';

type RoomProps = {
  roomId: string;
};

const Room: Component<RoomProps> = (props) => {
  const client = createCurrentClientResource();
  const roomId = createMemo(() => props.roomId);
  const { name, topic, avatar } = createRoomResource(roomId);
  const typings = createTypings();
  const [relationData, setRelationData] = createSignal<RelationData>();

  const navigate = useNavigate();
  createRoomOnLeaveEffect(roomId, () => {
    navigate('/rooms', { replace: true });
  });

  const onSend = (doc: JSONContent, text: string) => {
    const plain = isPlain(doc.content ?? []);
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
