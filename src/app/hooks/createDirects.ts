import { ClientEvent, MatrixClient, MatrixEvent } from 'matrix-js-sdk';
import { Accessor, batch, createEffect, on, onCleanup } from 'solid-js';
import { createSetStore } from './createSetStore';

export const createDirects = (mx: Accessor<MatrixClient>) => {
  const [directs, { add, clear }] = createSetStore<string>([]);

  const onAccountData = (event: MatrixEvent) => {
    if (event.getType() !== 'm.direct') return;
    const content = event.getContent() satisfies Record<string, string[]>;

    batch(() => {
      for (const userId of Object.keys(content)) {
        const newDirects = content[userId];
        if (Array.isArray(newDirects)) {
          for (const id of newDirects) {
            if (typeof id === 'string') add(id);
          }
        }
      }
    });
  };

  createEffect(
    on(mx, ($mx) => {
      const event = $mx.getAccountData('m.direct');
      if (event === undefined) clear();
      else onAccountData(event);
    })
  );

  createEffect(() => {
    const $mx = mx();
    $mx.on(ClientEvent.AccountData, onAccountData);
    onCleanup(() => {
      $mx.off(ClientEvent.AccountData, onAccountData);
    });
  });

  return directs;
};
