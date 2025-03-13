import { createSingletonRoot } from '@solid-primitives/rootless';
import { makeEventListener } from '@solid-primitives/event-listener';
import { createMemo, createSignal } from 'solid-js';

export const useSelected = createSingletonRoot(() => {
  const [selected, setSelected] = createSignal(false);
  const memo = createMemo(() => selected());

  makeEventListener(document, 'selectionchange', () =>
    setSelected(document.getSelection()?.type === 'Range')
  );

  return memo;
});
