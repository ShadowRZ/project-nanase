import { type Component } from 'solid-js';

export const Welcome: Component = () => {
  return (
    <div class='hidden w-full h-dvh grow md:flex items-center justify-center'>
      <p class='font-bold text-gray-600 text-xl'>Have a nice day.</p>
    </div>
  );
};
