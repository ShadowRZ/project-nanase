import { useNavigate, useParams } from '@solidjs/router';
import { type Room } from 'matrix-js-sdk';
import { For, Match, Show, Switch, type Component } from 'solid-js';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import createRoomLastEvent from '~/app/hooks/createRoomLastEvent';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createRoomScopedProfile } from '~/app/hooks/createRoomScopedProfile';
import { createRooms } from '~/app/hooks/createRooms';
import { createSpaceChildrens } from '~/app/hooks/createSpaceRooms';
import RoomItem from '~/app/molecules/room/RoomItem';
import { trimReplyFallback } from '~/lib/utils/matrix';

// 'chats' | 'directs' | 'favorties'
export type ChatRooms = {
  type: 'chats';
};

export type DirectRooms = {
  type: 'directs';
};

export type SpaceRooms = {
  type: 'space';
  space: string;
};

export type RoomCategory = ChatRooms | DirectRooms | SpaceRooms;

export type RoomListProps = {
  category: RoomCategory;
};

export type RoomListItemProps = {
  roomId: string;
};

const RoomListItem: Component<RoomListItemProps> = (props) => {
  const roomId = (): string => props.roomId;
  const { name, avatar, lastTs, unread } = createRoomResource(roomId);
  const client = createCurrentClientResource();
  const room = (): Room | undefined =>
    client()?.getRoom(props.roomId) ?? undefined;
  const navigate = useNavigate();
  const selectedRoom = (): string | undefined => useParams().id;
  const event = createRoomLastEvent(roomId);

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
        unread={unread()}
        lastSender={
          event()?.sender?.name ?? (event()?.getContent().sender as string)
        }
        lastContent={trimReplyFallback(event()?.getContent().body as string)}
      />
    </Show>
  );
};

const RoomListItemDirect: Component<RoomListItemProps> = (props) => {
  const roomId = (): string => props.roomId;
  const { lastTs, unread } = createRoomResource(roomId);
  const client = createCurrentClientResource();
  const room = (): Room | undefined =>
    client()?.getRoom(props.roomId) ?? undefined;
  const dmUser = () => room()!.guessDMUserId();
  const { name, avatar } = createRoomScopedProfile(roomId, dmUser);
  const navigate = useNavigate();
  const selectedRoom = (): string | undefined => useParams().id;
  const event = createRoomLastEvent(roomId);

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
        unread={unread()}
        lastSender={
          event()?.sender?.name ?? (event()?.getContent().sender as string)
        }
        lastContent={trimReplyFallback(event()?.getContent().body as string)}
      />
    </Show>
  );
};

const RoomList: Component<RoomListProps> = (props) => {
  const category = (): RoomCategory => props.category;
  const categoryType = () => category().type;
  const { chats, directs } = createRooms();
  const spaceChildrens = createSpaceChildrens();
  const spaceId = () =>
    category().type === 'space' ? (category() as SpaceRooms).space : undefined;
  const spaceRooms = () => {
    const thisSpaceId = spaceId();
    if (thisSpaceId !== undefined) {
      return spaceChildrens()?.[thisSpaceId] ?? [];
    }

    return [];
  };

  return (
    <div class='px-1 py-1 flex flex-col gap-1 grow'>
      <Switch>
        <Match when={categoryType() === 'chats'}>
          <Show when={chats()}>
            <For each={chats()}>{(item) => <RoomListItem roomId={item} />}</For>
          </Show>
        </Match>
        <Match when={categoryType() === 'directs'}>
          <Show when={directs()}>
            <For each={directs()}>
              {(item) => <RoomListItemDirect roomId={item} />}
            </For>
          </Show>
        </Match>
        <Match when={categoryType() === 'space'}>
          <Show when={spaceChildrens() && spaceId()}>
            <For each={spaceRooms()}>
              {(item) => <RoomListItem roomId={item} />}
            </For>
          </Show>
        </Match>
      </Switch>
    </div>
  );
};

export default RoomList;
