import { Text } from '@shadowrz/hanekokoro-ui';
import { Button } from '@kobalte/core/button';
import { type EventTimelineSet, type MatrixClient } from 'matrix-js-sdk';
import { Show, Suspense, type Component } from 'solid-js';
import { trimReplyFallback } from '../../../lib/utils/matrix';
import { styled } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import { createFetchedEvent } from '../../hooks/createFetchedEvent';

type QuotedEventProps = {
  roomId: string;
  eventId: string;
  timelineSet: EventTimelineSet;
  client: MatrixClient;
  primary?: boolean;
  showSender?: boolean;
};

type QuotedEventInnerProps = {
  roomId: string;
  eventId: string;
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

const QuotedEventRenderer: Component<QuotedEventInnerProps> = (props) => {
  const roomId = () => props.roomId;
  const eventId = () => props.eventId;
  const target = createFetchedEvent(roomId, eventId);
  //const sender = () => target()?.getSender();
  //const { name } = createRoomProfileSnapshot(roomId, sender);
  return (
    <Show when={target()}>
      {(target) => (
        <>
          <Show when={props.showSender ?? true}>
            <styled.span fontWeight='700'>{target().getSender()!}</styled.span>
          </Show>
          <RedactedWrapper redacted={target().isRedacted()}>
            {target().isRedacted()
              ? 'Event was redacted.'
              : trimReplyFallback(target().getContent().body as string)}
          </RedactedWrapper>
        </>
      )}
    </Show>
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
        <Show
          when={target()}
          fallback={<Text fontStyle='italic'>Event not found.</Text>}
        >
          <QuotedEventRenderer roomId={roomId()} eventId={eventId()} />
        </Show>
      </Suspense>
    </QuoteButton>
  );
};
