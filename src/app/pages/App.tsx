import { Navigate, Route, MemoryRouter as Router } from '@solidjs/router';
import {
  Show,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from 'solid-js';
import FeatureCheck from './FeatureCheck';
import { AppContext } from '~/app/hooks/useAppContext';
import { useClientsController } from '~/app/hooks/useClientsController';
import MatrixChat from '~/app/templates/client/MatrixChat';
import AuthContent from '~/app/templates/auth/Auth';
import Panel from '~/app/atoms/panel/Panel';
import ClientsController, {
  ControllerEvents,
} from '~/lib/client/ClientsController';
import { type MatrixClient } from '~/lib/client/MatrixClient';
import { type ClientData } from '~/lib/auth';

const AuthWrapper: Component = () => {
  const onClientCreated = (data: ClientData) => {
    ClientsController.populateClientData(data);
    window.location.reload();
  };

  return (
    <div class='h-full flex flex-col overflow-y-scroll scrollbar-none'>
      <div class='flex flex-1 justify-center mx-4 my-16'>
        <Panel style='shadow' class='p-4 w-md h-fit'>
          <h2 class='font-bold text-2xl'>Login to Matrix</h2>
          <p class='opacity-50'>Select your homeserver and login.</p>
          <AuthContent onClientCreated={onClientCreated} />
        </Panel>
      </div>
      <div class='flex flex-row gap-2 items-center justify-center my-4'>
        <span>Project Nanase</span>
        <span class='opacity-50'>·</span>
        <a
          href='https://github.com/ShadowRZ/project-nanase'
          class='text-rose-500 hover:underline'
        >
          Source Code
        </a>
        <span class='opacity-50'>·</span>
        <a href='https://matrix.org' class='text-rose-500 hover:underline'>
          Powered by Matrix
        </a>
      </div>
    </div>
  );
};

const ChatWrapper: Component = () => {
  const controller = useClientsController();

  return (
    <Show when={controller() !== undefined}>
      <MatrixChat />
    </Show>
  );
};

const Index: Component = () => {
  const controller = useClientsController();

  return (
    <Show
      when={!ClientsController.newSession()}
      fallback={<Navigate href='/login' />}
    >
      <Show when={controller() !== undefined}>
        <Navigate href='/rooms' />
      </Show>
    </Show>
  );
};

const App: Component = () => {
  const [controller] = createSignal(
    ClientsController.restoreFromLocalStorage()
  );

  const [client, setClient] = createSignal<MatrixClient | undefined>(
    controller()?.currentClient
  );

  const onChanged = (_prev: MatrixClient, next: MatrixClient) => {
    setClient(next);
  };

  onMount(() => {
    controller()?.on(ControllerEvents.ClientChanged, onChanged);
  });

  onCleanup(() => {
    controller()?.off(ControllerEvents.ClientChanged, onChanged);
  });

  return (
    <AppContext.Provider
      value={{
        controller,
        client,
      }}
    >
      <Router>
        <Route path='/' component={Index} />
        <Route path='/login' component={AuthWrapper} />
        <Route path='/rooms/:id?' component={ChatWrapper} />
      </Router>
    </AppContext.Provider>
  );
};

export default App;
