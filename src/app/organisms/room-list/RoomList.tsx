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
import { createRooms } from '~/app/hooks/createRooms';
import RoomItem from '~/app/molecules/room/RoomItem';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { trimReplyFallback } from '~/lib/utils/matrix';
import { createSpaceRoomList } from '~/app/hooks/createSpaceRooms';

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
  const client = createCurrentClientResource();
  const room = (): Room | undefined =>
    client()?.getRoom(props.roomId) ?? undefined;
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

const Chats: Component = () => {
  const { chats } = createRooms();

  return (
    <Show when={chats()}>
      <For each={chats()}>{(item) => <RoomListItem roomId={item} />}</For>
    </Show>
  );
};

const Directs: Component = () => {
  const { directs } = createRooms();

  return (
    <Show when={directs()}>
      <For each={directs()}>
        {(item) => <RoomListItem roomId={item} isDirect />}
      </For>
    </Show>
  );
};

const SpaceRoomList: Component<RoomListProps> = (props) => {
  const category = () => props.category;
  const rooms = createSpaceRoomList(category);

  return (
    <Show when={rooms()}>
      <For each={rooms()}>{(item) => <RoomListItem roomId={item} />}</For>
    </Show>
  );
};

const RoomList: Component<RoomListProps> = (props) => {
  const category = (): RoomCategory => props.category;
  const { chats, directs } = createRooms();

  return (
    <div class='px-1 py-1 flex flex-col gap-1'>
      {/* <Show when={!['chats', 'directs', 'favorites'].includes(category())}>
        <SpaceHeader spaceId={category()} />
      </Show> */}
      <Switch
        fallback={
          <Suspense fallback={<Placeholder />}>
            <SpaceRoomList category={category()} />{' '}
          </Suspense>
        }
      >
        <Match when={category() === 'chats'}>
          <Suspense fallback={<Placeholder />}>
            <Chats />
          </Suspense>
        </Match>
        <Match when={category() === 'directs'}>
          <Suspense fallback={<Placeholder />}>
            <Directs />
          </Suspense>
        </Match>
      </Switch>
    </div>
  );
};

export default RoomList;
