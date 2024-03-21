import { type ParentComponent } from 'solid-js';

type TooltipContentProps = {
  class?: string;
};

const TooltipContent: ParentComponent<TooltipContentProps> = (props) => {
  return (
    <div
      {...props}
      class={`${props.class ?? ''} px-3 py-2 bg-slate-800 text-white border-none rounded-lg`}
    >
      {props.children}
    </div>
  );
};

export default TooltipContent;
