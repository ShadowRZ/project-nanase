import {
  createSignal,
  type Component,
  onMount,
  onCleanup,
  Show,
} from 'solid-js';
import { useParams } from '@solidjs/router';
import Room from '~/app/organisms/room/Room';
import { Welcome } from '~/app/organisms/welcome/Welcome';
import RoomList, {
  type RoomCategory,
} from '~/app/organisms/room-list/RoomList';
import Sidebar from '~/app/components/sidebar/Sidebar';
import { ControllerEvents } from '~/lib/client/ClientsController';
import { useClientsController } from '~/app/hooks/useClientsController';

const MatrixChat: Component = () => {
  const context = useClientsController();
  const [category, setCategory] = createSignal<RoomCategory>('chats');
  const selectedRoom = (): string | undefined => useParams().id;

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
        <div class='w-full h-dvh overflow-y-scroll scrollbar-none'>
          <RoomList category={category()} />
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
