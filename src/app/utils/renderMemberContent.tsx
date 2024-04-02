import { type MatrixEvent } from 'matrix-js-sdk';
import { isMembershipChanged } from './room';
import Text from '~/app/atoms/text/Text';

type RoomMemberEventContent = {
  avatar_url?: string;
  displayname?: string;
  membership: 'join' | 'invite' | 'knock' | 'ban' | 'leave';
  reason?: string;
};

// eslint-disable-next-line complexity
export function renderMemberContent(event: MatrixEvent) {
  const content = event.getContent<RoomMemberEventContent>();
  const prevContent = event.getPrevContent() as RoomMemberEventContent;
  const senderId = event.getSender();
  const userId = event.getStateKey();

  const userName = content.displayname ?? userId;

  if (!senderId || !userId) return undefined;

  if (isMembershipChanged(event)) {
    if (content.membership === 'invite') {
      if (prevContent.membership === 'knock') {
        return (
          <>
            accepted{' '}
            <Text font='bold' as='span'>
              {userName}
            </Text>
            's join request
            {content.reason ? `: ${content.reason}` : '.'}
          </>
        );
      }

      return (
        <>
          invited{' '}
          <Text font='bold' as='span'>
            {userName}
          </Text>
          {content.reason ? `: ${content.reason}` : '.'}
        </>
      );
    }

    if (content.membership === 'knock') {
      return <>requested to join the room.</>;
    }

    if (content.membership === 'join') {
      return <>joined the room.</>;
    }

    if (content.membership === 'leave') {
      if (prevContent.membership === 'invite') {
        return senderId === userId ? (
          <>
            rejected the invitation
            {content.reason ? `: ${content.reason}` : '.'}
          </>
        ) : (
          <>
            rejected{' '}
            <Text font='bold' as='span'>
              {userName}
            </Text>
            's join request
            {content.reason ? `: ${content.reason}` : '.'}
          </>
        );
      }

      if (prevContent.membership === 'knock') {
        return senderId === userId ? (
          <>
            revoked joined request
            {content.reason ? `: ${content.reason}` : '.'}
          </>
        ) : (
          <>
            revoked{' '}
            <Text font='bold' as='span'>
              {userName}
            </Text>
            's invite
            {content.reason ? `: ${content.reason}` : '.'}
          </>
        );
      }

      if (prevContent.membership === 'ban') {
        return (
          <>
            unbanned{' '}
            <Text font='bold' as='span'>
              {userName}
            </Text>
            {content.reason ? `: ${content.reason}` : '.'}
          </>
        );
      }

      return senderId === userId ? (
        <>left the room{content.reason ? `: ${content.reason}` : '.'}</>
      ) : (
        <>
          kicked{' '}
          <Text font='bold' as='span'>
            {userName}
          </Text>
          {content.reason ? `: ${content.reason}` : '.'}
        </>
      );
    }

    if (content.membership === 'ban') {
      return (
        <>
          banned{' '}
          <Text font='bold' as='span'>
            {userName}
          </Text>
          {content.reason ? `: ${content.reason}` : '.'}
        </>
      );
    }
  }

  if (content.displayname !== prevContent.displayname) {
    return content.displayname ? (
      <>
        changed display name to{' '}
        <Text font='bold' as='span'>
          {userName}
        </Text>
        .
      </>
    ) : (
      <>removed display name.</>
    );
  }

  if (content.avatar_url !== prevContent.avatar_url) {
    return content.displayname ? <>changed avatar.</> : <>removed avatar.</>;
  }

  return undefined;
}
