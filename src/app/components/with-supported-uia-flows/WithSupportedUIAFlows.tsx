import { type UIAFlow } from 'matrix-js-sdk';
import {
  type Accessor,
  createMemo,
  untrack,
  type FlowComponent,
  type JSX,
} from 'solid-js';
import { createSupportedUIAFlows } from '~/app/hooks/createUIAFlows';

const WithSupportedUIAFlows: FlowComponent<
  {
    flows: UIAFlow[];
    supportedStages: string[];
  },
  (supportedFlows: Accessor<UIAFlow[]>) => JSX.Element
> = (props) => {
  const flows = () => props.flows;
  const supportedStages = () => props.supportedStages;

  const supported = createSupportedUIAFlows(flows, supportedStages);

  const ret = createMemo(() => {
    const child = props.children;
    return untrack(() => {
      return child(supported);
    });
  }) as unknown as JSX.Element;

  return ret;
};

export default WithSupportedUIAFlows;
