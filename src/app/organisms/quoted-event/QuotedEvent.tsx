import { Button } from '@kobalte/core';
import { type EventTimelineSet, type MatrixClient } from 'matrix-js-sdk';
import { type Component, Suspense, Show } from 'solid-js';
import { createReplyEvent } from '~/app/hooks/createReplyEvent';
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
  const target = createReplyEvent(
    props.roomId,
    props.eventId,
    props.timelineSet,
    props.client
  );
  const roomId = () => props.roomId;
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
      </Suspense>
    </Button.Root>
  );
};

export default QuotedEvent;
