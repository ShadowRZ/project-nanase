import {
  type Accessor,
  createMemo,
  createSignal,
  type EffectFunction,
} from 'solid-js';

export const createRefetchMemo = <Next extends Prev, Prev = Next>(
  fn: EffectFunction<undefined | NoInfer<Prev>, Next>
): [Accessor<Next>, () => void] => {
  const [signal, refetch] = createSignal(undefined, {
    equals: false,
  });

  const data = createMemo<Next, Prev>(($prev) => {
    signal();
    return fn($prev);
  });

  return [data, refetch];
};
