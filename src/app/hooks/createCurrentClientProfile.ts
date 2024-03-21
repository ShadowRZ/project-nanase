import { createSignal, onCleanup, onMount } from 'solid-js';
import { createClientProfile } from './createClientProfile';
import { useClientsController } from '~/app/hooks/useClientsController';
import { ControllerEvents } from '~/lib/client/ClientsController';
import { type MatrixClient } from '~/lib/client/MatrixClient';

export function createCurrentClientProfile() {
  const controller = useClientsController();
  const [id, setId] = createSignal(controller()!.current);

  const onChanged = (_prev: MatrixClient, next: MatrixClient) => {
    setId(next.id);
  };

  onMount(() => {
    controller()?.on(ControllerEvents.ClientChanged, onChanged);
  });

  onCleanup(() => {
    controller()?.off(ControllerEvents.ClientChanged, onChanged);
  });

  return createClientProfile(id);
}
