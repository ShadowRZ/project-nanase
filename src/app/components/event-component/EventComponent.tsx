import FileSaver from 'file-saver';
import {
  MsgType,
  type EventTimelineSet,
  type MatrixEvent,
} from 'matrix-js-sdk';
import {
  ErrorBoundary,
  For,
  Match,
  Show,
  Switch,
  createMemo,
  type Component,
  type ParentComponent,
} from 'solid-js';
import {
  type AnyMessage,
  type FileMessage,
  type ImageMessage,
  type MaybeFormattedMessage,
  type Sticker,
} from '../../../types/event-content';
import TrashDuotone from '~icons/ph/trash-duotone';
import { Flex, styled } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import createEventInfo from '../../hooks/createEventInfo';
import createRoomProfileSnapshot from '../../hooks/createRoomProfileSnapshot';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import { renderMemberContent } from '../../utils/renderMemberContent';
import { getEventReactions } from '../../utils/room';
import { QuotedEvent } from '../quoted-event/QuotedEvent';
import { FileContent } from './content/FileContent';
import { ImageContent } from './content/ImageContent';
import { TextContent } from './content/TextContent';
import { Message } from './Message';
import { State } from './State';
import { FormattedRenderer } from './FormattedRenderer';

const ContentBox = styled('div', {
  base: {
    rounded: 'lg',
    padding: '2',
    colorPalette: 'gray',
    bg: 'colorPalette.dimmed',
  },
  variants: {
    primary: {
      true: {
        colorPalette: 'accent',
      },
    },
  },
});

const RedactedMessage: Component = () => {
  return (
    <Flex
      direction='row'
      fontStyle='italic'
      alignItems='center'
      gap='1'
      w='fit'
      rounded='xl'
      bg='bg.subtle'
      p='2'
      opacity='50'
    >
      <TrashDuotone />
      This message was deleted.
    </Flex>
  );
};

type EventComponentProps = {
  roomId: string;
  event: MatrixEvent;
  timelineSet: EventTimelineSet;
};

const MessageContent: Component<EventComponentProps> = (props) => {
  const mx = useMatrixClient();
  const sender = () => event().getSender()!;
  const selfId = () => mx().getSafeUserId();
  const timelineSet = () => props.timelineSet;
  const { event, edited, content, sending, msgtype } =
    createEventInfo<AnyMessage>(timelineSet, () => props.event);

  return (
    <Show when={!event().isRedacted()} fallback={<RedactedMessage />}>
      <Switch>
        <Match
          when={msgtype() === MsgType.Text || msgtype() === MsgType.Notice}
        >
          <TextContent
            timestamp={event().getTs()}
            status={sending() ? 'sending' : 'sent'}
            primary={sender() === selfId()}
            edited={edited() !== undefined}
            notice={msgtype() === MsgType.Notice}
          >
            <Show when={event().replyEventId !== undefined}>
              <QuotedEvent
                roomId={props.roomId}
                eventId={event().replyEventId!}
                timelineSet={timelineSet()}
                client={mx()}
                primary={sender() === selfId()}
              />
            </Show>
            <FormattedRenderer content={content() as MaybeFormattedMessage} />
          </TextContent>
        </Match>
        <Match when={msgtype() === MsgType.Image}>
          <ContentBox primary={sender() === selfId()} maxW='40rem'>
            <Show when={event().replyEventId !== undefined}>
              <QuotedEvent
                roomId={props.roomId}
                eventId={event().replyEventId!}
                timelineSet={timelineSet()}
                client={mx()}
              />
            </Show>
            <ImageContent
              timestamp={event().getTs()}
              status={sending() ? 'sending' : 'sent'}
              edited={edited() !== undefined}
              src={(content() as ImageMessage).url}
              width={(content() as ImageMessage).info.w}
              height={(content() as ImageMessage).info.h}
            />
          </ContentBox>
        </Match>
        <Match when={msgtype() === MsgType.File}>
          <Show when={event().replyEventId !== undefined}>
            <QuotedEvent
              roomId={props.roomId}
              eventId={event().replyEventId!}
              timelineSet={timelineSet()}
              client={mx()}
            />
          </Show>
          <FileContent
            timestamp={event().getTs()}
            status={sending() ? 'sending' : 'sent'}
            primary={sender() === selfId()}
            filename={(content() as FileMessage).filename ?? content().body}
            mime={(content() as FileMessage).info.mimetype}
            onClick={() => {
              const url = (content() as FileMessage).url;
              const httpUrl = mx().mxcUrlToHttp(url);
              const filename =
                (content() as FileMessage).filename ?? content().body;
              if (httpUrl) {
                setTimeout(() => {
                  FileSaver.saveAs(httpUrl, filename);
                }, 0);
              }
            }}
          />
        </Match>
      </Switch>
    </Show>
  );
};

const StickerContent: Component<EventComponentProps> = (props) => {
  const mx = useMatrixClient();
  const timelineSet = () => props.timelineSet;
  const { event, edited, content, sending } = createEventInfo<Sticker>(
    timelineSet,
    () => props.event
  );
  const width = createMemo(() => content().info.w);
  const height = createMemo(() => content().info.h);
  const url = createMemo(() => content().url);

  return (
    <>
      <Show when={event().replyEventId !== undefined}>
        <QuotedEvent
          roomId={props.roomId}
          eventId={event().replyEventId!}
          timelineSet={timelineSet()}
          client={mx()}
        />
      </Show>
      <ImageContent
        timestamp={event().getTs()}
        status={sending() ? 'sending' : 'sent'}
        edited={edited() !== undefined}
        src={url()}
        width={width()}
        height={height()}
      />
    </>
  );
};

const MemberContent: Component<Omit<EventComponentProps, 'timelineSet'>> = (
  props
) => {
  const roomId = () => props.roomId;
  const event = () => props.event;
  const sender = () => event().getSender()!;
  const { name, avatar } = createRoomProfileSnapshot(roomId, sender);

  return (
    <State
      name={name()}
      avatar={avatar()}
      userId={sender()}
      timestamp={props.event.getTs()}
    >
      {renderMemberContent(event()) ?? 'has an unrecognized member change.'}
    </State>
  );
};

const RoomMessage: ParentComponent<EventComponentProps> = (props) => {
  const roomId = () => props.roomId;
  const event = () => props.event;
  const timelineSet = () => props.timelineSet;
  const sender = () => event().getSender()!;
  const { name, avatar } = createRoomProfileSnapshot(roomId, sender);
  const keyedReactions = () => getEventReactions(timelineSet(), event());

  return (
    <Message name={name()} userId={sender()} avatar={avatar()}>
      {props.children}
      <For each={keyedReactions()}>
        {([key, reactions]) => {
          const count = reactions.size;

          return (
            <div>
              {key}: {count}
            </div>
          );
        }}
      </For>
    </Message>
  );
};

const StateMessage: ParentComponent<
  Omit<EventComponentProps, 'timelineSet'>
> = (props) => {
  const roomId = () => props.roomId;
  const event = () => props.event;
  const sender = () => event().getSender()!;
  const { name, avatar } = createRoomProfileSnapshot(roomId, sender);

  return (
    <State
      name={name()}
      avatar={avatar()}
      userId={sender()}
      timestamp={props.event.getTs()}
    >
      {props.children}
    </State>
  );
};

const EventComponent: Component<EventComponentProps> = (props) => {
  const roomId = () => props.roomId;
  const event = () => props.event;
  const timelineSet = () => props.timelineSet;
  const type = () => event().getWireType();

  return (
    <Switch
      fallback={
        <StateMessage roomId={roomId()} event={event()}>
          sent{' '}
          <styled.code
            px='1'
            fontFamily='monospace'
            bg='mauve.3'
            rounded='md'
            borderWidth='1px'
            borderStyle='solid'
            borderColor='mauve.7'
          >
            {type()}
          </styled.code>{' '}
          event.
        </StateMessage>
      }
    >
      <Match when={type() === 'm.room.redaction'}>
        <StateMessage roomId={roomId()} event={event()}>
          redacted a message.
        </StateMessage>
      </Match>
      <Match when={type() === 'm.room.message'}>
        <RoomMessage
          roomId={roomId()}
          event={event()}
          timelineSet={timelineSet()}
        >
          <MessageContent
            roomId={roomId()}
            event={event()}
            timelineSet={timelineSet()}
          />
        </RoomMessage>
      </Match>
      <Match when={type() === 'm.sticker'}>
        <RoomMessage
          roomId={roomId()}
          event={event()}
          timelineSet={timelineSet()}
        >
          <ErrorBoundary fallback={<div>Failed to render event</div>}>
            <Show when={!event().isRedacted()} fallback={<RedactedMessage />}>
              <StickerContent
                roomId={roomId()}
                event={event()}
                timelineSet={timelineSet()}
              />
            </Show>
          </ErrorBoundary>
        </RoomMessage>
      </Match>
      <Match when={type() === 'm.room.member'}>
        <MemberContent roomId={roomId()} event={event()} />
      </Match>
      <Match when={type() === 'm.room.create'}>
        <StateMessage roomId={roomId()} event={event()}>
          created the room.
        </StateMessage>
      </Match>
    </Switch>
  );
};

export default EventComponent;
