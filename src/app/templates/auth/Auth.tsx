import { TextField } from '@kobalte/core';
import { type Component, Match, Show, Switch, createSignal } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';
import {
  type IAuthData,
  type ILoginFlowsResponse,
  type MatrixClient,
  createClient,
} from 'matrix-js-sdk';
import Login from './Login';
import { Register } from './Register';
import { getHomeserverUrl } from '~/lib/utils/matrix';
import { type ClientData } from '~/lib/auth';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

type AuthLoadingProps = {
  message?: string;
};

const AuthLoading: Component<AuthLoadingProps> = (props) => {
  return (
    <div class='flex flex-row gap-2 items-center'>
      <LoadingIndicator class='size-8' />
      <span>{props.message}</span>
    </div>
  );
};

type IErrorJson = {
  error?: string;
  errcode?: string;
};

type ServerInfo = {
  client: MatrixClient;
  login: ILoginFlowsResponse;
  register: IAuthData & IErrorJson;
};

type ProgressInfo = {
  loading: boolean;
  message?: string;
  error?: string;
};

type HomeserverProps = {
  onChange: (resp?: ServerInfo) => void;
};

const Homeserver: Component<HomeserverProps> = (props) => {
  const [progress, setProgress] = createSignal<ProgressInfo>(
    { loading: false },
    { equals: false }
  );

  const trigger = debounce((homeserver: string) => {
    if (homeserver.trim() !== '') {
      props.onChange(undefined);
      setupConfig(homeserver.trim()).catch((error: Error) => {
        setProgress({ loading: false, error: error.message });
      });
    }
  }, 500);

  const onChange = (value: string) => {
    setProgress({ loading: false });
    trigger(value);
  };

  const setupConfig = async (homeserver: string): Promise<void> => {
    setProgress({ loading: true, message: 'Looking for homeserver...' });
    const baseUrl = await getHomeserverUrl(homeserver);
    setProgress({ loading: true, message: `Connecting to ${baseUrl}...` });

    const client = createClient({ baseUrl });
    const [login, register] = await Promise.allSettled([
      client.loginFlows(),
      client.registerRequest({}),
    ]);
    const loginFlow = login.status === 'fulfilled' ? login.value : undefined;
    const registerFlow =
      register.status === 'rejected'
        ? (register.reason?.data as IAuthData)
        : undefined;
    if (loginFlow === undefined || registerFlow === undefined) {
      throw new Error('Unexpected error when fetching login / register info');
    }

    props.onChange({ client, login: loginFlow, register: registerFlow });
    setProgress({ loading: false });
  };

  return (
    <>
      <TextField.Root class='my-2 flex flex-col gap-2' onChange={onChange}>
        <TextField.Label class='font-bold'>Homeserver</TextField.Label>
        <TextField.Input class='transition duration-200 rounded-xl p-2 ring ring-neutral/25 focus:ring-rose-500 focus:ring-2 outline-none' />
      </TextField.Root>
      <Show when={progress().loading}>
        <AuthLoading message={progress().message} />
      </Show>
      <Show when={progress().error !== undefined}>
        <span class='text-red font-bold'>{progress().error}</span>
      </Show>
    </>
  );
};

type LoginOrRegister = 'login' | 'register';

export type AuthContentProps = {
  onClientCreated: (data: ClientData) => void;
};

export const AuthContent: Component<AuthContentProps> = (props) => {
  const [serverInfo, setServerInfo] = createSignal<ServerInfo | undefined>(
    undefined
  );
  const [loginOrRegister, setLoginOrRegister] =
    createSignal<LoginOrRegister>('login');

  return (
    <>
      <Homeserver onChange={setServerInfo} />
      <Show when={serverInfo()}>
        {(info) => (
          <>
            <Switch>
              <Match when={loginOrRegister() === 'login'}>
                <Login
                  client={info().client}
                  flows={info().login}
                  onClientCreated={props.onClientCreated}
                />
              </Match>
              <Match when={loginOrRegister() === 'register'}>
                <Switch>
                  <Match when={info().register.errcode === undefined}>
                    <Register
                      registerInfo={info().register}
                      loginFlows={info().login}
                      client={info().client}
                      onClientCreated={props.onClientCreated}
                    />
                  </Match>
                  <Match when={info().register.errcode !== undefined}>
                    <span class='font-bold text-red'>
                      {info().register.error}
                    </span>
                  </Match>
                </Switch>
              </Match>
            </Switch>
            <div class='mt-2'>
              <Switch>
                <Match when={loginOrRegister() === 'login'}>
                  <Switch>
                    <Match when={info().register.errcode === undefined}>
                      <span>
                        You can{' '}
                        <button
                          onClick={() => {
                            setLoginOrRegister('register');
                          }}
                          class='inline font-bold text-rose-500 hover:underline'
                        >
                          register
                        </button>{' '}
                        if you don't have an account.
                      </span>
                    </Match>
                    <Match when={info().register.errcode !== undefined}>
                      <span class='font-bold text-red'>
                        {info().register.error}
                      </span>
                    </Match>
                  </Switch>
                </Match>
                <Match when={loginOrRegister() === 'register'}>
                  <span>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setLoginOrRegister('login');
                      }}
                      class='inline font-bold text-rose-500 hover:underline'
                    >
                      Sign in
                    </button>
                    .
                  </span>
                </Match>
              </Switch>
            </div>
          </>
        )}
      </Show>
    </>
  );
};

export default AuthContent;
