import {
  createSignal,
  type Component,
  onMount,
  onCleanup,
  Show,
  Switch,
  Match,
  type ParentComponent,
} from 'solid-js';
import { useParams } from '@solidjs/router';
import { SyncState } from 'matrix-js-sdk';
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
  const [category, setCategory] = createSignal<RoomCategory>('chats');
  const selectedRoom = (): string | undefined => useParams().id;
  const status = createClientStatus(() => context()!.current);

  const onClientChanged = (): void => {
    setCategory('chats');
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
  );
};

export default MatrixChat;
