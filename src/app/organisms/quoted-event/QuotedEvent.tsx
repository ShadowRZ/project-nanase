import { Button } from '@kobalte/core';
import { type EventTimelineSet, type MatrixClient } from 'matrix-js-sdk';
import { type Component, Suspense, Show, ErrorBoundary } from 'solid-js';
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

const QuotedEvent: Component<QuotedEventProps> = (props) => {
  const roomId = () => props.roomId;
  const eventId = () => props.eventId;
  const timelineSet = () => props.timelineSet;
  const client = () => props.client;
  const target = createFetchedEvent(roomId, eventId, timelineSet, client);
  const sender = () => target()!.getSender()!;
  const { name } = createRoomProfileSnapshot(roomId, sender);

  return (
    <Button.Root
      class='w-fit text-start mb-1 pl-2 border-l-2 flex flex-col'
      classList={{
        'border-inherit': props.primary,
        'border-rose-500': !props.primary,
      }}
    >
      <Suspense fallback={<span>......</span>}>
        <ErrorBoundary fallback={<Text font='italic'>Event not found.</Text>}>
          <Show when={target()}>
            <Show when={props.showSender ?? true}>
              <span class='font-bold'>{name() ?? sender()}</span>
            </Show>
            <span
              class='shrink truncate text-wrap whitespace-pre-wrap'
              classList={{
                'opacity-50 font-italic': target()!.isRedacted(),
              }}
            >
              {target()!.isRedacted()
                ? 'Event was redacted.'
                : trimReplyFallback(target()?.getContent().body as string)}
            </span>
          </Show>
        </ErrorBoundary>
      </Suspense>
    </Button.Root>
  );
};

export default QuotedEvent;
