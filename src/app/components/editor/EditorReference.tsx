import { Match, Switch, type Component } from 'solid-js';
import IconButton from '~/app/atoms/button/IconButton';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { createRoomEvents } from '~/app/hooks/createRoomEvents';
import QuotedEvent from '~/app/organisms/quoted-event/QuotedEvent';
import { type RelationData } from '~/types/room';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import XIcon from '~icons/ph/x';
import PencilSimpleLineDuotone from '~icons/ph/pencil-simple-line-duotone';

type EditorReferenceProps = {
  roomId: string;
  relationData: RelationData;
  onClose?: () => void;
};

const EditorReference: Component<EditorReferenceProps> = (props) => {
  const roomId = () => props.roomId;
  const relationData = () => props.relationData;
  const client = createCurrentClientResource();
  const { timelineSet } = createRoomEvents(roomId);

  return (
    <div class='px-2 flex flex-col gap-1 items-start'>
      <div class='flex flex-row items-center gap-2 w-full'>
        <Switch>
          <Match when={relationData().type === 'reply'}>
            <ArrowBendUpLeftDuotone class='inline-block size-4 text-slate-700' />
          </Match>
          <Match when={relationData().type === 'edit'}>
            <PencilSimpleLineDuotone class='inline-block size-4 text-slate-700' />
          </Match>
        </Switch>
        <span class='grow'>
          <Switch>
            <Match when={relationData().type === 'reply'}>Reply To</Match>
            <Match when={relationData().type === 'edit'}>Edit</Match>
          </Switch>
        </span>
        <IconButton
          type='circle'
          icon={XIcon}
          class='size-6'
          iconClass='size-4 text-slate-700'
          title='Cancel'
          onClick={() => {
            props.onClose?.();
          }}
        />
      </div>
      <div class='px-6 w-full'>
        <QuotedEvent
          showSender={relationData().type !== 'edit'}
          roomId={roomId()}
          eventId={relationData().eventId}
          timelineSet={timelineSet()!}
          client={client()!}
        />
      </div>
    </div>
  );
};

export default EditorReference;
