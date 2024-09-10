import { createSignal, ErrorBoundary, type ParentComponent } from 'solid-js';
import SpecVersions from './SpecVersions';
import { currentSession } from '~/app/state/sessions';
import { initClient } from '~/lib/client/init';
import { MatrixClientProvider } from '~/app/hooks/useMatrixClient';

const ClientRoot: ParentComponent = (props) => {
  const [loading, setLoading] = createSignal(false);

  const baseUrl = () => currentSession().baseUrl;
  const mx = () => initClient(currentSession());

  return (
    <ErrorBoundary fallback={<p>Error</p>}>
      <SpecVersions baseUrl={baseUrl()}>
        <MatrixClientProvider value={mx()}>
          {props.children}
        </MatrixClientProvider>
      </SpecVersions>
    </ErrorBoundary>
  );
};

export default ClientRoot;
