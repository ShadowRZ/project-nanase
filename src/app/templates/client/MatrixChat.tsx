import { useParams } from '@solidjs/router';
import { SyncState } from 'matrix-js-sdk';
import {
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
  type Component,
  type ParentComponent,
} from 'solid-js';
import Sidebar from '~/app/components/sidebar/Sidebar';
import { createCurrentClientStatus } from '~/app/hooks/createClientStatus';
import useProfileUpdateEffect from '~/app/hooks/useProfileUpdateEffect';
import RoomList, {
  type RoomCategory,
} from '~/app/organisms/room-list/RoomList';
import Room from '~/app/organisms/room/Room';
import { Welcome } from '~/app/organisms/welcome/Welcome';
import XCircleFill from '~icons/ph/x-circle-fill';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

const StatusContainer: ParentComponent = (props) => {
  return (
    <div class='sticky bottom-0 p-2 border-t w-full flex flex-row gap-2 items-center bg-white dark:bg-black'>
      {props.children}
    </div>
  );
};

const SyncStatus: Component = () => {
  const status = createCurrentClientStatus();

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

const LeftContent: Component = () => {
  const [category, setCategory] = createSignal<RoomCategory>('chats');

  return (
    <div class='flex flex-row flex-none relative w-full md:w-110 border-r sm:border-slate-200 dark:sm:border-slate-800'>
      <Sidebar category={category()} onCategoryChanged={setCategory} />
      <div class='relative w-full h-dvh overflow-y-scroll scrollbar-none'>
        <RoomList category={category()} />
        <SyncStatus />
      </div>
    </div>
  );
};

const RightContent: Component = () => {
  const selectedRoom = createMemo(() => useParams().id);

  return (
    <Show when={selectedRoom() !== undefined} fallback={<Welcome />}>
      <div class='absolute w-full min-w-0 md:static z-5 flex-1 flex flex-col h-dvh bg-white dark:bg-black'>
        <Room roomId={selectedRoom()} />
      </div>
    </Show>
  );
};

const MatrixChat: Component = () => {
  useProfileUpdateEffect();

  return (
    <div class='flex flex-row'>
      <LeftContent />
      <RightContent />
    </div>
  );
};

export default MatrixChat;
