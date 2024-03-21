import { useNavigate, useParams } from '@solidjs/router';
import { RoomEvent, type MatrixEvent, type Room } from 'matrix-js-sdk';
import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  onCleanup,
  onMount,
  type Component,
} from 'solid-js';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import Placeholder from '~/app/components/placeholder/Placeholder';
import { createRoomList } from '~/app/hooks/createRoomList';
import RoomItem from '~/app/molecules/room/RoomItem';
import { useCurrentClient } from '~/app/hooks/useCurrentClient';
import { trimReplyFallback } from '~/lib/utils/matrix';

// 'chats' | 'directs' | 'favorties'
export type RoomCategory = 'chats' | 'directs' | string;

export type RoomListProps = {
  category: RoomCategory;
};

export type RoomListItemProps = {
  roomId: string;
  isDirect?: boolean;
};

export type RoomSummaryProps = {
  roomId: string;
  isDirect?: boolean;
};

const RoomListItem: Component<RoomListItemProps> = (props) => {
  const roomId = (): string => props.roomId;
  const { name, avatar, lastTs, unread } = createRoomResource(roomId);
  const isDirect = () => props.isDirect ?? false;
  const client = useCurrentClient();
  const room = (): Room | undefined =>
    client()?.client.getRoom(props.roomId) ?? undefined;
  const navigate = useNavigate();
  const selectedRoom = (): string | undefined => useParams().id;
  const [event, { refetch }] = createResource(room, ($room) =>
    $room.getLastLiveEvent()
  );

  const onTimeLine = (_event: MatrixEvent): void => {
    void refetch();
  };

  onMount(() => {
    room()?.on(RoomEvent.Timeline, onTimeLine);
  });

  onCleanup(() => {
    room()?.off(RoomEvent.Timeline, onTimeLine);
  });

  return (
    <Show when={room() !== undefined}>
      <RoomItem
        onClick={() => {
          navigate(`/rooms/${props.roomId}`, { replace: true });
        }}
        current={selectedRoom() === props.roomId}
        name={name() ?? props.roomId}
        avatar={avatar()}
        roomId={props.roomId}
        lastTs={lastTs()!}
        direct={isDirect()}
        unread={unread()}
        lastSender={
          event()?.sender?.name ?? (event()?.getContent().sender as string)
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        lastContent={trimReplyFallback(event()?.getContent().body)}
      />
    </Show>
  );
};

const ChatsRoomList: Component = () => {
  const rooms = createRoomList(() => 'chats');
  return (
    <Suspense fallback={<Placeholder />}>
      <Show when={rooms()}>
        <For each={rooms()}>{(item) => <RoomListItem roomId={item} />}</For>
      </Show>
    </Suspense>
  );
};

const DirectsRoomList: Component = () => {
  const rooms = createRoomList(() => 'directs');
  return (
    <Suspense fallback={<Placeholder />}>
      <Show when={rooms()}>
        <For each={rooms()}>
          {(item) => <RoomListItem roomId={item} isDirect />}
        </For>
      </Show>
    </Suspense>
  );
};

const SpaceRoomList: Component<RoomListProps> = (props) => {
  const rooms = createRoomList(() => props.category);

  return (
    <Suspense fallback={<Placeholder />}>
      <Show when={rooms()}>
        <For each={rooms()}>{(item) => <RoomListItem roomId={item} />}</For>
      </Show>
    </Suspense>
  );
};

const RoomList: Component<RoomListProps> = (props) => {
  const category = (): RoomCategory => props.category;

  return (
    <div class='px-1 py-1 flex flex-col gap-1'>
      {/* <Show when={!['chats', 'directs', 'favorites'].includes(category())}>
        <SpaceHeader spaceId={category()} />
      </Show> */}
      <Switch fallback={<SpaceRoomList category={category()} />}>
        <Match when={category() === 'chats'}>
          <ChatsRoomList />
        </Match>
        <Match when={category() === 'directs'}>
          <DirectsRoomList />
        </Match>
      </Switch>
    </div>
  );
};

export default RoomList;
