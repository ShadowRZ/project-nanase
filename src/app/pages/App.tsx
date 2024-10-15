import { Navigate, Route, HashRouter as Router } from '@solidjs/router';
import { Show, type Component, type ParentComponent } from 'solid-js';
import { I18NProvider } from '~/app/i18n';
import { isInitial } from '~/app/state/sessions';
import FeatureCheck from './FeatureCheck';
import AuthFormLayout from './auth/AuthFormLayout';
import AuthLayout from './auth/AuthLayout';
import Login from './auth/login/Login';
import PasswordLogin from './auth/login/PasswordLogin';
import { ClientRoute } from './client/ClientRoute';
import { RoomRoute } from '../features/room/RoomRoute';

const Index: ParentComponent = (props) => {
  return (
    <Show when={!isInitial()} fallback={<Navigate href='/login' />}>
      {props.children}
    </Show>
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
        <Route component={ClientRoute}>
          <Route path='/' component={() => 'Hello World'} />
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
