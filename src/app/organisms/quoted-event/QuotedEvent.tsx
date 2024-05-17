import { Button } from '@kobalte/core/button';
import {
  type EventTimelineSet,
  type MatrixClient,
  type MatrixEvent,
} from 'matrix-js-sdk';
import { ErrorBoundary, Show, Suspense, type Component } from 'solid-js';
import Text from '~/app/atoms/text/Text';
import { createFetchedEvent } from '~/app/hooks/createFetchedEvent';
import createRoomProfileSnapshot from '~/app/hooks/createRoomProfileSnapshot';
import { trimReplyFallback } from '~/lib/utils/matrix';

type QuotedEventProps = {
  roomId: string;
  eventId: string;
  timelineSet: EventTimelineSet;
  client: MatrixClient;
  primary?: boolean;
  showSender?: boolean;
};

type QuotedEventInnerProps = {
  target: MatrixEvent;
  roomId: string;
  showSender?: boolean;
};

const QuotedEventInner: Component<QuotedEventInnerProps> = (props) => {
  const roomId = () => props.roomId;
  const target = () => props.target;
  const sender = () => target().getSender()!;
  const { name } = createRoomProfileSnapshot(roomId, sender);
  return (
    <>
      <Show when={props.showSender ?? true}>
        <span class='font-bold'>{name() ?? sender()}</span>
      </Show>
      <span
        class='shrink truncate text-wrap whitespace-pre-wrap break-all'
        classList={{
          'opacity-50 font-italic': target().isRedacted(),
        }}
      >
        {target().isRedacted()
          ? 'Event was redacted.'
          : trimReplyFallback(target().getContent().body as string)}
      </span>
    </>
  );
};

const QuotedEvent: Component<QuotedEventProps> = (props) => {
  const roomId = () => props.roomId;
  const eventId = () => props.eventId;
  const timelineSet = () => props.timelineSet;
  const client = () => props.client;
  const target = createFetchedEvent(roomId, eventId, timelineSet, client);

  return (
    <Button
      class='w-fit text-start mb-1 pl-2 border-l-2 flex flex-col'
      classList={{
        'border-inherit': props.primary,
        'border-rose-500': !props.primary,
      }}
    >
      <Suspense fallback={<span>......</span>}>
        <ErrorBoundary fallback={<Text font='italic'>Event not found.</Text>}>
          <Show when={target()}>
            <QuotedEventInner target={target()!} roomId={roomId()} />
          </Show>
        </ErrorBoundary>
      </Suspense>
    </Button>
  );
};

export default QuotedEvent;
