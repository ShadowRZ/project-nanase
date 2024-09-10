import { type ParentComponent } from 'solid-js';
import WithSpecVersions from '~/app/components/with-spec-versions/WithSpecVersions';
import { SpecVersionsProvider } from '~/app/hooks/useSpecVersions';

const SpecVersions: ParentComponent<{ baseUrl: string }> = (props) => (
  <WithSpecVersions
    baseUrl={props.baseUrl}
    fallback={<p>Loading</p>}
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
