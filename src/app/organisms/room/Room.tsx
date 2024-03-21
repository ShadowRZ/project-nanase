import { Rerun } from '@solid-primitives/keyed';
import { createEffect, type Component } from 'solid-js';
import { type Editor as TiptapEditor } from '@tiptap/core';
import RoomTimeline from './RoomTimeline';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import RoomIntro from '~/app/molecules/room-intro/RoomIntro';
import Editor from '~/app/components/editor/Editor';
import { createTypings } from '~/app/hooks/createTypings';

type RoomProps = {
  roomId: string;
};

const Room: Component<RoomProps> = (props) => {
  const roomId = (): string => props.roomId;
  const { name, topic, avatar } = createRoomResource(roomId);
  const typings = createTypings();
  let ref!: TiptapEditor;

  return (
    <div class='flex flex-col h-dvh'>
      <RoomIntro name={name() ?? roomId()} topic={topic()} avatar={avatar()} />
      <Rerun on={roomId}>
        <RoomTimeline roomId={roomId()} />
      </Rerun>
      <div>
        <Editor
          ref={(v) => {
            ref = v!;
          }}
          onSend={() => {}}
        />
      </div>
    </div>
  );
};

export default Room;
