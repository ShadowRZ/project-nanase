import { Navigate, Route, MemoryRouter as Router } from '@solidjs/router';
import {
  Show,
  createSignal,
  onCleanup,
  onMount,
  type Component,
} from 'solid-js';
import FeatureCheck from './FeatureCheck';
import { I18NProvider } from '~/app/i18n';
import Panel from '~/app/atoms/panel/Panel';
import { setProfiles } from '~/app/hooks/createProfileStore';
import { AppContext } from '~/app/hooks/useAppContext';
import AuthContent from '~/app/templates/auth/Auth';
import MatrixChat from '~/app/templates/client/MatrixChat';
import { type SessionData } from '~/lib/auth';
import { SessionList, SessionListEvents } from '~/lib/client/session';

const AuthWrapper: Component = () => {
  const onClientCreated = (data: SessionData) => {
    SessionList.populateClientData(data);
    window.location.reload();
  };

  return (
    <div class='h-full flex flex-col overflow-y-scroll scrollbar-none'>
      <div class='flex flex-1 justify-center mx-4 my-16'>
        <Panel decoration='shadowed' class='p-4 w-md h-fit'>
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
    <Show when={!SessionList.isInitial()} fallback={<Navigate href='/login' />}>
      <Navigate href='/rooms' />
    </Show>
  );
};

const ChatWrapper: Component = () => {
  const sessionList = SessionList.fromLocalStorage()!;
  const { clients, current: storedCurrent } = sessionList;
  const [current, setCurrent] = createSignal(storedCurrent);

  const session = () => clients.get(current())!;
  const client = () => session().client;

  const profileUpdate = (
    id: string,
    displayName?: string,
    avatarUrl?: string
  ) => {
    setProfiles(id, () => ({
      name: displayName,
      avatar: avatarUrl,
    }));
  };

  onMount(() => {
    sessionList.startAll();
    sessionList.on(SessionListEvents.ProfileUpdated, profileUpdate);
  });

  onCleanup(() => {
    sessionList.off(SessionListEvents.ProfileUpdated, profileUpdate);
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
    <I18NProvider>
      <FeatureCheck>
        <Router>
          <Route path='/' component={Index} />
          <Route path='/login' component={AuthWrapper} />
          <Route path='/rooms/:id?' component={ChatWrapper} />
        </Router>
      </FeatureCheck>
    </I18NProvider>
  );
};

export default App;
