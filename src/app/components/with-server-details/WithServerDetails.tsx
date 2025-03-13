import { createDeepSignal } from '@solid-primitives/resource';
import type { Capabilities } from 'matrix-js-sdk';
import {
  type FlowComponent,
  type JSX,
  createMemo,
  createResource,
  untrack,
} from 'solid-js';
import { useMatrixClient } from '../../hooks/useMatrixClient';
import type { MediaConfig } from '../../hooks/useServerDetails';

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
    return untrack(() => {
      return child(capabilities(), mediaConfig());
    });
  }) as unknown as JSX.Element;

  return ret;
};
