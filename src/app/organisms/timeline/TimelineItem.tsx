import { ContextMenu } from '@kobalte/core';
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
  createSignal,
  type Component,
  type ParentComponent,
} from 'solid-js';
import Box from '~/app/atoms/box/Box';
import Panel from '~/app/atoms/panel/Panel';
import {
  createCurrentClientResource,
  createCurrentClientUserId,
} from '~/app/hooks/createClientResource';
import createEventInfo from '~/app/hooks/createEventInfo';
import createMaybeRedactedEvent from '~/app/hooks/createMaybeRedactedEvent';
import createRoomProfileSnapshot from '~/app/hooks/createRoomProfileSnapshot';
import CFileMessage from '~/app/molecules/message/FileMessage';
import CImageMessage from '~/app/molecules/message/ImageMessage';
import MessageShell from '~/app/molecules/message/MessageShell';
import StateMessageShell from '~/app/molecules/message/StateMessageShell';
import CTextMessage from '~/app/molecules/message/TextMessage';
import QuotedEvent from '~/app/organisms/quoted-event/QuotedEvent';
import ViewSourceDialog from '~/app/organisms/view-source/ViewSourceDialog';
import { renderMemberContent } from '~/app/utils/renderMemberContent';
import { renderTextContent } from '~/app/utils/renderTextContent';
import { getEditedEvent, getEventReactions } from '~/app/utils/room';
import {
  type AnyMessage,
  type FileMessage,
  type ImageMessage,
  type MaybeFormattedMessage,
  type Sticker,
} from '~/types/event-content';
import { type RelationData } from '~/types/room';
import ArrowBendUpLeftDuotone from '~icons/ph/arrow-bend-up-left-duotone';
import CodeDuotone from '~icons/ph/code-duotone';
import TrashDuotone from '~icons/ph/trash-duotone';

const RedactedMessage: Component = () => {
  return (
    <div class='font-italic flex flex-row items-center gap-1 w-fit rounded-xl bg-neutral-200 p-2 opacity-50'>
      <TrashDuotone />
      This message was deleted.
    </div>
  );
};

type EventProps = {
  roomId: string;
  event: MatrixEvent;
  timelineSet: EventTimelineSet;
  setRelationData?: (rel: RelationData | undefined) => void;
};

const MessageContent: Component<EventProps> = (props) => {
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
                client={client()!}
                primary={sender() === selfId()}
              />
            </Show>
            {renderTextContent(
              content() as MaybeFormattedMessage,
              props.roomId,
              client()!.baseUrl
            )}
          </CTextMessage>
        </Match>
        <Match when={msgtype() === MsgType.Image}>
          <Box color='default' class='max-w-2/3'>
            <Show when={event().replyEventId !== undefined}>
              <QuotedEvent
                roomId={props.roomId}
                eventId={event().replyEventId!}
                timelineSet={timelineSet()}
                client={client()!}
              />
            </Show>

            <CImageMessage
              timestamp={event().getTs()}
              status={sending() ? 'sending' : 'sent'}
              edited={edited() !== undefined}
              width={(content() as ImageMessage).info.w}
              height={(content() as ImageMessage).info.h}
              src={
                client()!.mxcUrlToHttp((content() as ImageMessage).url) ??
                undefined
              }
            />
          </Box>
        </Match>
        <Match when={msgtype() === MsgType.File}>
          <Show when={event().replyEventId !== undefined}>
            <QuotedEvent
              roomId={props.roomId}
              eventId={event().replyEventId!}
              timelineSet={timelineSet()}
              client={client()!}
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
              const httpUrl = client()!.mxcUrlToHttp(url);
              const filename =
                (content() as FileMessage).filename ?? content().body;
              if (httpUrl) {
                FileSaver.saveAs(httpUrl, filename);
              }
            }}
          />
        </Match>
      </Switch>
    </Show>
  );
};

const StickerContent: Component<EventProps> = (props) => {
  const client = createCurrentClientResource();
  const timelineSet = () => props.timelineSet;
  const { event, edited, content, sending } = createEventInfo<Sticker>(
    timelineSet,
    () => props.event
  );
  const width = createMemo(() => content().info.w);
  const height = createMemo(() => content().info.h);
  const url = createMemo(() => client()!.mxcUrlToHttp(content().url));

  return (
    <>
      <Show when={event().replyEventId !== undefined}>
        <QuotedEvent
          roomId={props.roomId}
          eventId={event().replyEventId!}
          timelineSet={timelineSet()}
          client={client()!}
        />
      </Show>
      <CImageMessage
        timestamp={event().getTs()}
        status={sending() ? 'sending' : 'sent'}
        edited={edited() !== undefined}
        width={width()}
        height={height()}
        src={url() ?? undefined}
      />
    </>
  );
};

const MemberContent: Component<Omit<EventProps, 'timelineSet'>> = (props) => {
  const roomId = () => props.roomId;
  const event = () => props.event;
  const sender = () => event().getSender()!;
  const { name, avatar } = createRoomProfileSnapshot(roomId, sender);
  const prevName = () => event().getPrevContent().displayname ?? name();

  return (
    <StateMessageShell
      name={prevName()}
      avatar={avatar()}
      userId={sender()}
      timestamp={props.event.getTs()}
    >
      {renderMemberContent(event()) ?? 'has an unrecognized member change.'}
    </StateMessageShell>
  );
};

const RoomMessage: ParentComponent<EventProps> = (props) => {
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

const StateMessage: ParentComponent<Omit<EventProps, 'timelineSet'>> = (
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
      {props.children}
    </StateMessageShell>
  );
};

const TimelineItemContent: Component<EventProps> = (props) => {
  const roomId = () => props.roomId;
  const event = () => props.event;
  const timelineSet = () => props.timelineSet;
  const type = () => event().getWireType();

  return (
    <Switch
      fallback={
        <StateMessage roomId={roomId()} event={event()}>
          sent{' '}
          <code class='px-2 font-mono bg-gray-200 dark:bg-gray-800 rounded-md border border-slate-100'>
            {type()}
          </code>{' '}
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

const TimelineItem: Component<EventProps> = (props) => {
  const roomId = () => props.roomId;
  const event = createMaybeRedactedEvent(() => props.event, roomId);
  const timelineSet = () => props.timelineSet;
  const canReply = () =>
    !(event().isState() || event().isRedacted() || event().isRedaction());

  const [sourceOpen, setSourceOpen] = createSignal(false);

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger
          as='div'
          data-project-nanase-roomid={roomId()}
          data-project-nanase-eventid={event().getId()}
          class='ui-expanded:bg-slate-100 dark:ui-expanded:bg-slate-900 px-2 py-1'
        >
          <TimelineItemContent
            roomId={roomId()}
            event={event()}
            timelineSet={timelineSet()}
          />
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <Panel
            decoration='bordered'
            as={ContextMenu.Content}
            class='z-5 animate-popup-close ui-expanded:animate-popup-open overflow-clip'
          >
            <Show when={canReply()}>
              <ContextMenu.Item
                onSelect={() => {
                  props.setRelationData?.({
                    type: 'reply',
                    eventId: event().getId()!,
                  });
                }}
                class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900'
              >
                <ArrowBendUpLeftDuotone /> Reply
              </ContextMenu.Item>
            </Show>
            <ContextMenu.Item
              onSelect={() => {
                setSourceOpen(true);
              }}
              class='px-4 py-2 flex flex-row gap-2 items-center hover:cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900'
            >
              <CodeDuotone /> View Source
            </ContextMenu.Item>
          </Panel>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <ViewSourceDialog
        open={sourceOpen()}
        onOpenChange={setSourceOpen}
        event={event()}
      />
    </>
  );
};

export default TimelineItem;
