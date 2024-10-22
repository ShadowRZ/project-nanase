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
import { styled } from '~styled/jsx';

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

const RedactedWrapper = styled('span', {
  base: {
    flexShrink: '1',
    truncate: true,
    textWrap: 'wrap',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  variants: {
    redacted: {
      true: {
        opacity: '50',
        fontStyle: 'italic',
      },
    },
  },
});

const QuotedEventInner: Component<QuotedEventInnerProps> = (props) => {
  const roomId = () => props.roomId;
  const target = () => props.target;
  const sender = () => target().getSender()!;
  const { name } = createRoomProfileSnapshot(roomId, sender);
  return (
    <>
      <Show when={props.showSender ?? true}>
        <styled.span fontWeight='700'>{name() ?? sender()}</styled.span>
      </Show>
      <RedactedWrapper redacted={target().isRedacted()}>
        {target().isRedacted()
          ? 'Event was redacted.'
          : trimReplyFallback(target().getContent().body as string)}
      </RedactedWrapper>
    </>
  );
};

const QuoteButton = styled(Button, {
  base: {
    display: 'flex',
    flexDirection: 'column',
    w: 'fit-content',
    textAlign: 'start',
    mb: '1',
    pl: '2',
    borderLeftWidth: '2',
  },
  variants: {
    primary: {
      true: {
        borderColor: 'colorPalette.default',
      },
    },
  },
});

export const QuotedEvent: Component<QuotedEventProps> = (props) => {
  const primary = () => props.primary;
  const roomId = () => props.roomId;
  const eventId = () => props.eventId;
  const target = createFetchedEvent(roomId, eventId);

  return (
    <QuoteButton primary={!primary()}>
      <Suspense fallback={<span>......</span>}>
        <ErrorBoundary fallback={<Text font='italic'>Event not found.</Text>}>
          <Show when={target()}>
            <QuotedEventInner target={target()!} roomId={roomId()} />
          </Show>
        </ErrorBoundary>
      </Suspense>
    </QuoteButton>
  );
};
