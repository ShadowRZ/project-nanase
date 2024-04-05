import {
  createSignal,
  type Component,
  onMount,
  onCleanup,
  Show,
  Switch,
  Match,
  type ParentComponent,
  createResource,
} from 'solid-js';
import { useParams } from '@solidjs/router';
import { SyncState } from 'matrix-js-sdk';
import { createStore } from 'solid-js/store';
import Room from '~/app/organisms/room/Room';
import { Welcome } from '~/app/organisms/welcome/Welcome';
import RoomList, {
  type RoomCategory,
} from '~/app/organisms/room-list/RoomList';
import Sidebar from '~/app/components/sidebar/Sidebar';
import { ControllerEvents } from '~/lib/client/ClientsController';
import { useClientsController } from '~/app/hooks/useClientsController';
import createClientStatus from '~/app/hooks/createClientStatus';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import XCircleFill from '~icons/ph/x-circle-fill';
import { ClientData, type UploadData } from '~/app/hooks/useClientData';

const StatusContainer: ParentComponent = (props) => {
  return (
    <div class='absolute bottom-0 p-2 border-t w-full flex flex-row gap-2 items-center'>
      {props.children}
    </div>
  );
};

const SyncStatus: Component = () => {
  const context = useClientsController();
  const status = createClientStatus(() => context()!.current);

  return (
    <Switch>
      <Match when={status() === null || status() === SyncState.Reconnecting}>
        <StatusContainer>
          <LoadingIndicator /> Syncing......
        </StatusContainer>
      </Match>
      <Match when={status() === SyncState.Error}>
        <StatusContainer>
          <XCircleFill />
          Sync errored, will try again.
        </StatusContainer>
      </Match>
    </Switch>
  );
};

const MatrixChat: Component = () => {
  const context = useClientsController();
  const [client, { refetch: refetchClient }] = createResource(
    context,
    async ($context) => {
      const client = $context.currentClient;
      await client.wait();
      return client.client;
    }
  );
  const [roomList, { refetch: refetchRoomList }] = createResource(
    context,
    async ($context) => {
      const client = $context.currentClient;
      await client.wait();
      return client.roomList;
    }
  );
  const [uploads, setUploads] = createStore<Record<string, UploadData[]>>({});
  const [category, setCategory] = createSignal<RoomCategory>('chats');
  const selectedRoom = (): string | undefined => useParams().id;

  const onClientChanged = (): void => {
    setCategory('chats');
    void refetchClient();
    void refetchRoomList();
  };

  onMount(() => {
    context()
      ?.startAndWaitAll()
      .catch(() => {});
    context()?.on(ControllerEvents.ClientChanged, onClientChanged);
  });

  onCleanup(() => {
    context()?.off(ControllerEvents.ClientChanged, onClientChanged);
  });

  return (
    <ClientData.Provider
      value={{
        client,
        roomList,
        uploads,
      }}
    >
      <div class='flex flex-row'>
        <div class='flex flex-row flex-none relative w-full md:w-110 border-r sm:border-slate-200 dark:sm:border-slate-800'>
          <Sidebar category={category()} onCategoryChanged={setCategory} />
          <div class='relative w-full h-dvh overflow-y-scroll scrollbar-none'>
            <RoomList category={category()} />
            <SyncStatus />
          </div>
        </div>
        <Show when={selectedRoom() !== undefined} fallback={<Welcome />}>
          <div class='absolute w-full min-w-0 md:static z-5 flex-1 flex flex-col h-dvh bg-white dark:bg-black'>
            <Room roomId={selectedRoom()!} />
          </div>
        </Show>
      </div>
    </ClientData.Provider>
  );
};

export default MatrixChat;
