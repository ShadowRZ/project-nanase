import { Navigate, Route, HashRouter as Router } from '@solidjs/router';
import {
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  type Component,
  type ParentComponent,
} from 'solid-js';
import FeatureCheck from './FeatureCheck';
import AuthFormLayout from './auth/AuthFormLayout';
import AuthLayout from './auth/AuthLayout';
import Login from './auth/login/Login';
import PasswordLogin from './auth/login/PasswordLogin';
import { setProfiles } from '~/app/hooks/createProfileStore';
import { AppContext } from '~/app/hooks/useAppContext';
import { I18NProvider } from '~/app/i18n';
import MatrixChat from '~/app/templates/client/MatrixChat';
import { SessionList, SessionListEvents } from '~/lib/client/session';
import { isInitial } from '~/app/state/sessions';
import { ClientRoute } from './client/ClientRoute';

const Index: ParentComponent = (props) => {
  return (
    <Show when={!isInitial()} fallback={<Navigate href='/login' />}>
      {props.children}
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

const Layout: ParentComponent = (props) => (
  <I18NProvider>
    <FeatureCheck>{props.children}</FeatureCheck>
  </I18NProvider>
);

const App: Component = () => {
  return (
    <Router root={Layout}>
      <Route path='/' component={Index}>
        <Route component={ClientRoute} />
      </Route>
      <Route component={AuthLayout}>
        <Route path='/login' component={Login} />
        <Route component={AuthFormLayout}>
          <Route path='/login/:server' component={PasswordLogin} />
        </Route>
      </Route>
      <Route path='/rooms/:id?' component={ChatWrapper} />
    </Router>
  );
};

export default App;
