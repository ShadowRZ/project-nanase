import { type Component } from 'solid-js';

const Placeholder: Component = () => {
  return (
    <div class='animate-pulse flex flex-row items-center gap-2 w-full'>
      <div class='size-12 rounded-full bg-slate-200' />
      <div class='grow flex flex-col gap-1 overflow-hidden'>
        <span class='bg-slate-200 rounded-lg w-1/4 h-5' />
        <span class='bg-slate-200 rounded-lg w-1/2 h-5' />
      </div>
    </div>
  );
};

export default Placeholder;
