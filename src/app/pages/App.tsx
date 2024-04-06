import { Navigate, Route, MemoryRouter as Router } from '@solidjs/router';
import { Show, createResource, createSignal, type Component } from 'solid-js';
import { createClientResource } from '../hooks/createClientResource';
import Panel from '~/app/atoms/panel/Panel';
import { AppContext } from '~/app/hooks/useAppContext';
import AuthContent from '~/app/templates/auth/Auth';
import MatrixChat from '~/app/templates/client/MatrixChat';
import { type SessionData } from '~/lib/auth';
import restoreFromStorage, {
  isInitial,
  populateClientData,
} from '~/lib/client/storage';

const AuthWrapper: Component = () => {
  const onClientCreated = (data: SessionData) => {
    populateClientData(data);
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

const Index: Component = () => {
  return (
    <Show when={!isInitial()} fallback={<Navigate href='/login' />}>
      <Navigate href='/rooms' />
    </Show>
  );
};

const ChatWrapper: Component = () => {
  const { clients, current: storedCurrent } = restoreFromStorage()!;
  const [current, setCurrent] = createSignal(storedCurrent);

  const [client] = createResource(current, async ($current) => {
    const { client } = clients.get($current)!;
    return client;
  });

  return (
    <AppContext.Provider
      value={{
        client,
        clients,
        current,
      }}
    >
      <MatrixChat />
    </AppContext.Provider>
  );
};

const App: Component = () => {
  return (
    <Router>
      <Route path='/' component={Index} />
      <Route path='/login' component={AuthWrapper} />
      <Route path='/rooms/:id?' component={ChatWrapper} />
    </Router>
  );
};

export default App;
