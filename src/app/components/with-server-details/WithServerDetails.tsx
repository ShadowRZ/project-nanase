import { createDeepSignal } from '@solid-primitives/resource';
import { Capabilities } from 'matrix-js-sdk';
import {
  type JSX,
  type FlowComponent,
  createResource,
  createMemo,
} from 'solid-js';
import { useMatrixClient } from '~/app/hooks/useMatrixClient';
import { MediaConfig } from '~/app/hooks/useServerDetails';

export const WithServerDetails: FlowComponent<
  object,
  (capabilities?: Capabilities, mediaConfig?: MediaConfig) => JSX.Element
> = (props) => {
  const mx = useMatrixClient();

  const [capabilities] = createResource(
    mx,
    async ($mx) => await $mx.getCapabilities(),
    {
      storage: createDeepSignal,
    }
  );

  const [mediaConfig] = createResource(
    mx,
    async ($mx) => await $mx.getMediaConfig(),
    {
      storage: createDeepSignal,
    }
  );

  const ret = createMemo(() => {
    const child = props.children;
    return child(capabilities(), mediaConfig());
  }) as unknown as JSX.Element;

  return ret;
};
