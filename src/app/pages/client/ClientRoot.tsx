import {
  ClientEvent,
  HttpApiEvent,
  HttpApiEventHandlerMap,
  MatrixClient,
  SyncState,
} from 'matrix-js-sdk';
import {
  Accessor,
  createEffect,
  createResource,
  Match,
  onCleanup,
  Show,
  Switch,
  type ParentComponent,
} from 'solid-js';
import { SplashScreen } from '~/app/components/splash-screen/Splashscreen';
import { MatrixClientProvider } from '~/app/hooks/useMatrixClient';
import { currentSession, removeSession } from '~/app/state/sessions';
import { Text } from '~/components/ui/text';
import { initClient, startClient } from '~/lib/client/init';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { Flex, HStack } from '~styled/jsx';
import SpecVersions from './SpecVersions';
import { Dialog } from '@/components/ui/dialog';
import { Portal } from 'solid-js/web';
import { Button } from '~/components/ui/button';
import { WithServerDetails } from '~/app/components/with-server-details/WithServerDetails';
import { ServerDetailsProvider } from '~/app/hooks/useServerDetails';
import { WithClientState } from '~/app/hooks/useClientState';

const createLogoutListener = (
  mx: Accessor<MatrixClient | undefined>,
  onLogout: () => void
) => {
  createEffect(() => {
    const $mx = mx();
    const handleLogout: HttpApiEventHandlerMap[HttpApiEvent.SessionLoggedOut] =
      () => {
        $mx?.stopClient();
        void $mx?.clearStores().then(() => {
          onLogout();
          return;
        });
      };

    $mx?.on(HttpApiEvent.SessionLoggedOut, handleLogout);
    onCleanup(() => {
      $mx?.removeListener(HttpApiEvent.SessionLoggedOut, handleLogout);
    });
  });
};

const ClientRoot: ParentComponent = (props) => {
  const baseUrl = () => currentSession().baseUrl;
  const [mx, { refetch: refetchMx }] = createResource(
    currentSession,
    async ($currentSession) => await initClient($currentSession)
  );
  const [start, { refetch: refetchStart }] = createResource(mx, async ($mx) => {
    await Promise.all([
      startClient($mx),
      new Promise<void>((resolve) => {
        const onSync = (state: SyncState) => {
          if (state === SyncState.Prepared) {
            $mx.off(ClientEvent.Sync, onSync);
            resolve();
          }
        };

        $mx.on(ClientEvent.Sync, onSync);
      }),
    ]);
  });

  createLogoutListener(mx, () => {
    removeSession(currentSession());
  });

  const handleRetry = () => {
    if (mx.state === 'ready') void refetchStart();
    else void refetchMx();
  };

  const errored = () => mx.state == 'errored' || start.state == 'errored';

  return (
    <SpecVersions baseUrl={baseUrl()}>
      <Show when={mx.state === 'ready'}>
        <Switch>
          <Match when={start.state !== 'ready'}>
            <SplashScreen>
              <HStack gap='2'>
                <LoadingIndicator width='2rem' height='2rem' />
                <Text display='inline' size='lg' fontWeight='bold'>
                  Heating Up...
                </Text>
              </HStack>
            </SplashScreen>
          </Match>
          <Match when={!!start.error}>
            <p>Error</p>
          </Match>
          <Match when={start.state === 'ready'}>
            <MatrixClientProvider value={mx as Accessor<MatrixClient>}>
              <WithServerDetails>
                {(capabilities, mediaConfig) => (
                  <ServerDetailsProvider
                    value={{
                      capabilities,
                      mediaConfig,
                    }}
                  >
                    <WithClientState>{props.children}</WithClientState>
                  </ServerDetailsProvider>
                )}
              </WithServerDetails>
            </MatrixClientProvider>
          </Match>
        </Switch>
      </Show>
      <Dialog.Root open={errored()}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Title>Unable to connect</Dialog.Title>
              <Flex direction='column' mt='2' gap='2'>
                <Show when={mx.state === 'errored'}>
                  <Text>{`Failed to load: ${(mx.error as Error).message}`}</Text>
                </Show>
                <Show when={start.state === 'errored'}>
                  <Text>{`Failed to load: ${(start.error as Error).message}`}</Text>
                </Show>
                <Flex justify='end'>
                  <Dialog.CloseTrigger.AsChild onClick={handleRetry}>
                    {(props) => (
                      <Button {...props()} variant='soft' colorPalette='accent'>
                        Retry
                      </Button>
                    )}
                  </Dialog.CloseTrigger.AsChild>
                </Flex>
              </Flex>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </SpecVersions>
  );
};

export default ClientRoot;
