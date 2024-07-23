import { TextField } from '@kobalte/core/text-field';
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
import { type SessionData } from '~/lib/auth';
import { Box, Flex, styled } from '~styled/jsx';
import { flex, square } from '~styled/patterns';
import { css } from '~styled/css';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

type AuthLoadingProps = {
  message?: string;
};

const AuthLoading: Component<AuthLoadingProps> = (props) => {
  return (
    <Flex direction='row' gap='2' alignItems='center'>
      <LoadingIndicator class={square({ size: '8' })} />
      <span>{props.message}</span>
    </Flex>
  );
};

const LinkButton = styled('button', {
  base: {
    display: 'inline',
    fontWeight: 'bold',
    color: 'red.11',
    _hover: {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
});

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

  // eslint-disable-next-line solid/reactivity
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
      <TextField
        class={flex({ direction: 'column', my: '2', gap: '2' })}
        onChange={onChange}
      >
        <TextField.Label class={css({ fontWeight: 'bold' })}>
          Homeserver
        </TextField.Label>
        <TextField.Input
          class={css({
            transition: 'common',
            transitionDuration: '200ms',
            outlineWidth: '2',
            outlineStyle: 'solid',
            outlineOffset: '0.5',
            outlineColor: 'mauve.7',
            rounded: 'xl',
            padding: '2',
            _disabled: {
              cursor: 'not-allowed',
            },
            _focus: {
              outlineColor: 'ruby.9',
            },
          })}
        />
      </TextField>
      <Show when={progress().loading}>
        <AuthLoading message={progress().message} />
      </Show>
      <Show when={progress().error !== undefined}>
        <styled.span color='red.11' fontWeight='bold'>
          {progress().error}
        </styled.span>
      </Show>
    </>
  );
};

type LoginOrRegister = 'login' | 'register';

export type AuthContentProps = {
  onClientCreated: (data: SessionData) => void;
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
                    <styled.span color='red.11' fontWeight='bold'>
                      {info().register.error}
                    </styled.span>
                  </Match>
                </Switch>
              </Match>
            </Switch>
            <Box mt='2'>
              <Switch>
                <Match when={loginOrRegister() === 'login'}>
                  <Switch>
                    <Match when={info().register.errcode === undefined}>
                      <span>
                        You can{' '}
                        <LinkButton
                          onClick={() => {
                            setLoginOrRegister('register');
                          }}
                        >
                          register
                        </LinkButton>{' '}
                        if you don't have an account.
                      </span>
                    </Match>
                    <Match when={info().register.errcode !== undefined}>
                      <styled.span color='red.11' fontWeight='bold'>
                        {info().register.error}
                      </styled.span>
                    </Match>
                  </Switch>
                </Match>
                <Match when={loginOrRegister() === 'register'}>
                  <span>
                    Already have an account?{' '}
                    <LinkButton
                      onClick={() => {
                        setLoginOrRegister('login');
                      }}
                    >
                      Sign in
                    </LinkButton>
                    .
                  </span>
                </Match>
              </Switch>
            </Box>
          </>
        )}
      </Show>
    </>
  );
};

export default AuthContent;
