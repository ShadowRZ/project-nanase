import { type EventTimelineSet } from 'matrix-js-sdk';
import { Match, Switch, type Component } from 'solid-js';
import IconButton from '~/app/atoms/button/IconButton';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import QuotedEvent from '~/app/organisms/quoted-event/QuotedEvent';
import { type RelationData } from '~/types/room';
import { css } from '~styled/css';
import { Flex, styled } from '~styled/jsx';
import { square } from '~styled/patterns';
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
    <Flex direction='column' gap='1' alignItems='start' px='2'>
      <Flex direction='row' alignItems='center' gap='2' width='full'>
        <Switch>
          <Match when={type() === 'reply'}>
            <ArrowBendUpLeftDuotone
              class={square({
                size: '4',
                display: 'inline-block',
                color: 'mauve.9',
              })}
            />
          </Match>
          <Match when={type() === 'edit'}>
            <PencilSimpleLineDuotone
              class={square({
                size: '4',
                display: 'inline-block',
                color: 'mauve.9',
              })}
            />
          </Match>
        </Switch>
        <styled.span flexGrow='1'>
          <Switch>
            <Match when={type() === 'reply'}>Reply To</Match>
            <Match when={type() === 'edit'}>Edit</Match>
          </Switch>
        </styled.span>
        <IconButton
          type='circle'
          icon={XIcon}
          class={square({ size: '6' })}
          iconClass={css({ color: 'mauve.9' })}
          title='Cancel'
          onClick={() => {
            props.onClose?.();
          }}
        />
      </Flex>
      <styled.div px='6' width='full'>
        <QuotedEvent
          showSender={type() !== 'edit'}
          roomId={roomId()}
          eventId={eventId()}
          timelineSet={timelineSet()}
          client={client()}
        />
      </styled.div>
    </Flex>
  );
};

export default EditorReference;
