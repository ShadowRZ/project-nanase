import { Navigate, Route, HashRouter as Router } from '@solidjs/router';
import { Show, type Component, type ParentComponent } from 'solid-js';
import { I18NProvider } from '../i18n';
import { isInitial } from '../state/sessions';
import FeatureCheck from './FeatureCheck';
import AuthFormLayout from './auth/AuthFormLayout';
import AuthLayout from './auth/AuthLayout';
import Login from './auth/login/Login';
import PasswordLogin from './auth/login/PasswordLogin';
import { ClientRoute } from './client/ClientRoute';
import { RoomRoute } from '../features/room/RoomRoute';
import { HTMLParserProvider } from '../hooks/useHTMLParser';
import { useRegisterSW } from 'virtual:pwa-register/solid';
import { Welcome } from '../components/welcome/Welcome';
const Index: ParentComponent = (props) => {
  return (
    <Show when={!isInitial()} fallback={<Navigate href='/login' />}>
      {props.children}
    </Show>
  );
};

const Layout: ParentComponent = (props) => (
  <HTMLParserProvider>
    <I18NProvider>
      <FeatureCheck>{props.children}</FeatureCheck>
    </I18NProvider>
  </HTMLParserProvider>
);

const App: Component = () => {
  useRegisterSW({
    immediate: true,
    onRegisteredSW: (swScriptUrl, registration) => {
      console.log(`[SW] OK, Service Worker ${swScriptUrl} is registered.`);
      console.log(registration?.active);
    },
    onRegisterError: (error) => {
      console.log(`[SW] Error occured`, error);
    },
  });

  return (
    <Router root={Layout}>
      <Route path='/' component={Index}>
        <Route component={ClientRoute}>
          <Route path='/' component={Welcome} />
          <Route path='/rooms/:roomId?' component={RoomRoute} />
        </Route>
      </Route>
      <Route component={AuthLayout}>
        <Route path='/login' component={Login} />
        <Route component={AuthFormLayout}>
          <Route path='/login/:server' component={PasswordLogin} />
        </Route>
      </Route>
    </Router>
  );
};

export default App;
