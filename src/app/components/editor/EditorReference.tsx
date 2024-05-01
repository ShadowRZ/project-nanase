import { type EventTimelineSet } from 'matrix-js-sdk';
import { Match, Switch, type Component } from 'solid-js';
import IconButton from '~/app/atoms/button/IconButton';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import QuotedEvent from '~/app/organisms/quoted-event/QuotedEvent';
import { type RelationData } from '~/types/room';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import PencilSimpleLineDuotone from '~icons/ph/pencil-simple-line-duotone';
import XIcon from '~icons/ph/x';

type EditorReferenceProps = {
  roomId: string;
  timelineSet: EventTimelineSet;
  relationData: RelationData;
  onClose?: () => void;
};

const EditorReference: Component<EditorReferenceProps> = (props) => {
  const roomId = () => props.roomId;
  const relationData = () => props.relationData;
  const type = () => relationData().type;
  const eventId = () => relationData().eventId;
  const client = createCurrentClientResource();
  const timelineSet = () => props.timelineSet;

  return (
    <div class='px-2 flex flex-col gap-1 items-start'>
      <div class='flex flex-row items-center gap-2 w-full'>
        <Switch>
          <Match when={type() === 'reply'}>
            <ArrowBendUpLeftDuotone class='inline-block size-4 text-slate-700' />
          </Match>
          <Match when={type() === 'edit'}>
            <PencilSimpleLineDuotone class='inline-block size-4 text-slate-700' />
          </Match>
        </Switch>
        <span class='grow'>
          <Switch>
            <Match when={type() === 'reply'}>Reply To</Match>
            <Match when={type() === 'edit'}>Edit</Match>
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
          showSender={type() !== 'edit'}
          roomId={roomId()}
          eventId={eventId()}
          timelineSet={timelineSet()}
          client={client()!}
        />
      </div>
    </div>
  );
};

export default EditorReference;
