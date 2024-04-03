import {
  type Component,
  For,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Button } from '@kobalte/core';
import Dialog from '~/app/molecules/dialog/Dialog';
import { useClientsController } from '~/app/hooks/useClientsController';
import { ControllerEvents } from '~/lib/client/ClientsController';
import ProfileContent from '~/app/molecules/profile/ProfileContent';
import { createClientProfile } from '~/app/hooks/createClientProfile';
import t from '~/app/i18n';
import UserCirclePlusDuotone from '~icons/ph/user-circle-plus-duotone';

export type ClientSwitchDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type ClientSwitchItemProps = {
  id: string;
};

const ClientSwitchItem: Component<ClientSwitchItemProps> = (props) => {
  const id = () => props.id;
  const context = useClientsController();
  const client = context()?.getClient(props.id);
  const { name, avatar } = createClientProfile(id);
  const userId = (): string | undefined => client?.userId;

  return <ProfileContent name={name()} avatar={avatar()} userId={userId()} />;
};

const ClientSwitchDialog: Component<ClientSwitchDialogProps> = (props) => {
  const context = useClientsController();
  const navigate = useNavigate();
  const [ids, setIds] = createSignal<string[]>([]);
  const [addAccount, setAddAccount] = createSignal(false);

  const onClientsUpdated = (ids: string[]): void => {
    setIds(ids);
  };

  onMount(() => {
    context()?.on(ControllerEvents.ClientsUpdated, onClientsUpdated);
    context()?.updateClients();
  });

  onCleanup(() => {
    context()?.off(ControllerEvents.ClientsUpdated, onClientsUpdated);
  });

  return (
    <>
      <Dialog
        title={t('switch_user')}
        modal
        open={props.open}
        onOpenChange={props.onOpenChange}
        contentClass='w-full max-w-md'
      >
        <div class='mt-2 flex flex-col gap-1'>
          <For each={ids()}>
            {(id) => (
              <Button.Root
                onClick={() => {
                  props.onOpenChange(false);
                  context()?.switch(id);
                  navigate(`/rooms`, { replace: true });
                }}
                class='text-start p-2 transition duration-200 rounded-xl flex flex-row gap-2 w-full'
                classList={{
                  'bg-transparent hover:bg-neutral-200/75':
                    id !== context()?.current,
                  'bg-rose-200/25 hover:bg-rose-200/75':
                    id === context()?.current,
                }}
              >
                <ClientSwitchItem id={id} />
              </Button.Root>
            )}
          </For>
          <Button.Root
            onClick={() => {
              props.onOpenChange(false);
              setAddAccount(true);
            }}
            class='text-start p-2 transition duration-200 rounded-xl flex flex-row items-center gap-2 w-full hover:bg-neutral-200/75'
          >
            <div class='size-12 shrink-0 flex items-center justify-center text-rose-500 rounded-full border-2 border-rose-500/50'>
              <UserCirclePlusDuotone class='size-8' />
            </div>
            <div class='grow flex flex-col overflow-hidden'>
              <span class='font-bold truncate'>Add Account</span>
            </div>
          </Button.Root>
        </div>
      </Dialog>
      {/* <AddAccountDialog open={addAccount()} onOpenChange={setAddAccount} /> */}
    </>
  );
};

export default ClientSwitchDialog;
