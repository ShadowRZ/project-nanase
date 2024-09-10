import {
  createMemo,
  createResource,
  type FlowProps,
  untrack,
  type Accessor,
  type FlowComponent,
  type JSX,
  Suspense,
  ErrorBoundary,
} from 'solid-js';
import { specVersions, type SpecVersions } from '~/app/cs-api';

function RemoveUndefinedProp(
  props: FlowProps<
    {
      specVersions: SpecVersions | undefined;
    },
    (specVersions: Accessor<SpecVersions>) => JSX.Element
  >
) {
  const specVersions = () => props.specVersions!;

  const ret = createMemo(() => {
    const child = props.children;
    return untrack(() => {
      return child(specVersions);
    });
  }) as unknown as JSX.Element;

  return ret;
}

const WithSpecVersions: FlowComponent<
  {
    baseUrl: string;
    fallback?: JSX.Element;
    error: (err: Error, retry: () => void) => JSX.Element;
  },
  (specVersions: Accessor<SpecVersions>) => JSX.Element
> = (props) => {
  const baseUrl = () => props.baseUrl;

  const [versions] = createResource(baseUrl, async ($baseUrl) =>
    specVersions(fetch, $baseUrl)
  );

  return (
    <ErrorBoundary fallback={props.error}>
      <Suspense fallback={props.fallback}>
        <RemoveUndefinedProp specVersions={versions()}>
          {props.children}
        </RemoveUndefinedProp>
      </Suspense>
    </ErrorBoundary>
  );
};

export default WithSpecVersions;
