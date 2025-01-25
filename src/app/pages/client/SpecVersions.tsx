import { type ParentComponent } from 'solid-js';
import { SplashScreen } from '../../components/splash-screen/Splashscreen';
import WithSpecVersions from '../../components/with-spec-versions/WithSpecVersions';
import { SpecVersionsProvider } from '../../hooks/useSpecVersions';
import { Text } from '@hanekokoro-ui/solid';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { HStack } from '@hanekokoro-ui/styled-system/jsx';

const SpecVersions: ParentComponent<{ baseUrl: string }> = (props) => (
  <WithSpecVersions
    baseUrl={props.baseUrl}
    fallback={
      <SplashScreen>
        <HStack gap='2'>
          <LoadingIndicator width='2rem' height='2rem' />
          <Text display='inline' size='lg' fontWeight='bold'>
            Connecting...
          </Text>
        </HStack>
      </SplashScreen>
    }
    error={() => <p>Error</p>}
  >
    {(versions) => (
      <SpecVersionsProvider value={versions()}>
        {props.children}
      </SpecVersionsProvider>
    )}
  </WithSpecVersions>
);

export default SpecVersions;
