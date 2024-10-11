import {
  type Accessor,
  createMemo,
  createResource,
  type FlowComponent,
  type FlowProps,
  type JSX,
  Match,
  Switch,
  untrack,
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

  const [versions, { refetch }] = createResource(baseUrl, async ($baseUrl) =>
    specVersions(fetch, $baseUrl)
  );

  return (
    <Switch>
      <Match when={versions.loading}>{props.fallback}</Match>
      <Match when={!!versions.error}>
        {props.error(versions.error as Error, () => {
          void refetch();
        })}
      </Match>
      <Match when={versions.state === 'ready'}>
        <RemoveUndefinedProp specVersions={versions()}>
          {props.children}
        </RemoveUndefinedProp>
      </Match>
    </Switch>
  );
};

export default WithSpecVersions;
