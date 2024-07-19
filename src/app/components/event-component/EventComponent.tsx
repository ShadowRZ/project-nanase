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
import AsyncImage from '~/app/components/async-image/AsyncImage';
import Box from '~/app/atoms/box/Box';
import {
  createCurrentClientResource,
  createCurrentClientUserId,
} from '~/app/hooks/createClientResource';
import createEventInfo from '~/app/hooks/createEventInfo';
import createRoomProfileSnapshot from '~/app/hooks/createRoomProfileSnapshot';
import CFileMessage from '~/app/molecules/message/FileMessage';
import CImageMessage from '~/app/molecules/message/ImageMessage';
import MessageShell from '~/app/molecules/message/MessageShell';
import StateMessageShell from '~/app/molecules/message/StateMessageShell';
import CTextMessage from '~/app/molecules/message/TextMessage';
import QuotedEvent from '~/app/organisms/quoted-event/QuotedEvent';
import { renderMemberContent } from '~/app/utils/renderMemberContent';
import { renderTextContent } from '~/app/utils/renderTextContent';
import { getEventReactions } from '~/app/utils/room';
import {
  type AnyMessage,
  type FileMessage,
  type ImageMessage,
  type MaybeFormattedMessage,
  type Sticker,
} from '~/types/event-content';
import TrashDuotone from '~icons/ph/trash-duotone';
import { getMediaPromise } from '~/lib/utils/media';
import { Flex, styled } from '~styled/jsx';

const RedactedMessage: Component = () => {
  return (
    <Flex
      direction='row'
      fontStyle='italic'
      alignItems='center'
      gap='1'
      w='fit'
      rounded='xl'
      bg='mauve.3'
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
  const client = createCurrentClientResource();
  const sender = () => event().getSender()!;
  const selfId = createCurrentClientUserId();
  const timelineSet = () => props.timelineSet;
  const { event, edited, content, sending, msgtype } =
    createEventInfo<AnyMessage>(timelineSet, () => props.event);

  return (
    <Show when={!event().isRedacted()} fallback={<RedactedMessage />}>
      <Switch>
        <Match
          when={msgtype() === MsgType.Text || msgtype() === MsgType.Notice}
        >
          <CTextMessage
            timestamp={event().getTs()}
            status={sending() ? 'sending' : 'sent'}
            color={sender() === selfId() ? 'primary' : 'default'}
            edited={edited() !== undefined}
            notice={msgtype() === MsgType.Notice}
          >
            <Show when={event().replyEventId !== undefined}>
              <QuotedEvent
                roomId={props.roomId}
                eventId={event().replyEventId!}
                timelineSet={timelineSet()}
                client={client()}
                primary={sender() === selfId()}
              />
            </Show>
            {renderTextContent(
              content() as MaybeFormattedMessage,
              props.roomId,
              client().baseUrl
            )}
          </CTextMessage>
        </Match>
        <Match when={msgtype() === MsgType.Image}>
          <Box color='default' maxW='2/3'>
            <Show when={event().replyEventId !== undefined}>
              <QuotedEvent
                roomId={props.roomId}
                eventId={event().replyEventId!}
                timelineSet={timelineSet()}
                client={client()}
              />
            </Show>
            <CImageMessage
              timestamp={event().getTs()}
              status={sending() ? 'sending' : 'sent'}
              edited={edited() !== undefined}
              width={(content() as ImageMessage).info.w}
              height={(content() as ImageMessage).info.h}
            >
              <AsyncImage
                src={getMediaPromise(
                  client(),
                  client().mxcUrlToHttp((content() as ImageMessage).url) ??
                    undefined
                )}
                width={(content() as ImageMessage).info.w}
                height={(content() as ImageMessage).info.h}
              />
            </CImageMessage>
          </Box>
        </Match>
        <Match when={msgtype() === MsgType.File}>
          <Show when={event().replyEventId !== undefined}>
            <QuotedEvent
              roomId={props.roomId}
              eventId={event().replyEventId!}
              timelineSet={timelineSet()}
              client={client()}
            />
          </Show>
          <CFileMessage
            timestamp={event().getTs()}
            status={sending() ? 'sending' : 'sent'}
            color={sender() === selfId() ? 'primary' : 'default'}
            filename={(content() as FileMessage).filename ?? content().body}
            mime={(content() as FileMessage).info.mimetype}
            onClick={() => {
              const url = (content() as FileMessage).url;
              const httpUrl = client().mxcUrlToHttp(url);
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
  const client = createCurrentClientResource();
  const timelineSet = () => props.timelineSet;
  const { event, edited, content, sending } = createEventInfo<Sticker>(
    timelineSet,
    () => props.event
  );
  const width = createMemo(() => content().info.w);
  const height = createMemo(() => content().info.h);
  const url = createMemo(
    () => client().mxcUrlToHttp(content().url) ?? undefined
  );

  return (
    <>
      <Show when={event().replyEventId !== undefined}>
        <QuotedEvent
          roomId={props.roomId}
          eventId={event().replyEventId!}
          timelineSet={timelineSet()}
          client={client()}
        />
      </Show>
      <CImageMessage
        timestamp={event().getTs()}
        status={sending() ? 'sending' : 'sent'}
        edited={edited() !== undefined}
        width={width()}
        height={height()}
      >
        <AsyncImage
          src={getMediaPromise(client(), url())}
          width={width()}
          height={height()}
        />
      </CImageMessage>
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
    <StateMessageShell
      name={name()}
      avatar={avatar()}
      userId={sender()}
      timestamp={props.event.getTs()}
    >
      {renderMemberContent(event()) ?? 'has an unrecognized member change.'}
    </StateMessageShell>
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
    <MessageShell name={name()} userId={sender()} avatar={avatar()}>
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
    </MessageShell>
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
    <StateMessageShell
      name={name()}
      avatar={avatar()}
      userId={sender()}
      timestamp={props.event.getTs()}
    >
      {props.children}
    </StateMessageShell>
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
            px='2'
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
