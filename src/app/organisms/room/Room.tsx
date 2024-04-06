import { Rerun } from '@solid-primitives/keyed';
import { createEffect, type Component } from 'solid-js';
import { type Editor as TiptapEditor } from '@tiptap/core';
import { useNavigate } from '@solidjs/router';
import RoomTimeline from './RoomTimeline';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import RoomIntro from '~/app/molecules/room-intro/RoomIntro';
import Editor from '~/app/components/editor/Editor';
import { createTypings } from '~/app/hooks/createTypings';
import createRoomOnLeaveEffect from '~/app/hooks/createRoomOnLeaveEffect';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { createRoomEvents } from '~/app/hooks/createRoomEvents';
import QuotedEvent from '~/app/organisms/quoted-event/QuotedEvent';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import XIcon from '~icons/ph/x';
import IconButton from '~/app/atoms/button/IconButton';

type RoomProps = {
  roomId: string;
};

const Room: Component<RoomProps> = (props) => {
  const client = createCurrentClientResource();
  const roomId = (): string => props.roomId;
  const { name, topic, avatar } = createRoomResource(roomId);
  const typings = createTypings();
  const { timelineSet } = createRoomEvents(roomId);
  let ref!: TiptapEditor;

  const navigate = useNavigate();
  createRoomOnLeaveEffect(roomId, () => {
    navigate(`/rooms`, { replace: true });
  });

  return (
    <div class='flex flex-col h-dvh'>
      <RoomIntro name={name() ?? roomId()} topic={topic()} avatar={avatar()} />
      <Rerun on={roomId}>
        <RoomTimeline roomId={roomId()} />
      </Rerun>
      <div class='py-1 border-t-1 border-slate-200 dark:border-slate-800'>
        {/* <div class='px-2 flex flex-col gap-1 items-start'>
          <div class='flex flex-row items-center gap-2 w-full'>
            <ArrowBendUpLeftDuotone class='inline-block size-4 text-slate-700' />
            <span class='grow'>Reply To</span>
            <IconButton
              type='circle'
              icon={XIcon}
              class='size-6'
              iconClass='size-4 text-slate-700'
              title='Cancel'
            />
          </div>
          <div class='px-6 w-full'>
            <QuotedEvent
              roomId={roomId()}
              eventId={''}
              timelineSet={timelineSet()!}
              client={client()!}
            />
          </div>
        </div> */}
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
