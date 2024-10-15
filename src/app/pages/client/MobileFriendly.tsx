import { createBreakpoints } from '@solid-primitives/media';
import { useMatch } from '@solidjs/router';
import { ParentComponent, Show } from 'solid-js';

const $breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

const breakpoints = createBreakpoints($breakpoints);

export const MobileFriendlySidebar: ParentComponent = (props) => {
  const index = useMatch(() => '/');

  return (
    <Show when={index() !== undefined || breakpoints.md}>{props.children}</Show>
  );
};

export const MobileFriendlyPage: ParentComponent = (props) => {
  const index = useMatch(() => '/');

  return (
    <Show when={index() === undefined || breakpoints.md}>{props.children}</Show>
  );
};
