import { Button } from '@kobalte/core/button';
import { useNavigate } from '@solidjs/router';
import { For, createSignal, type Component } from 'solid-js';
import { profiles } from '~/app/hooks/createProfileStore';
import { useAppContext } from '~/app/hooks/useAppContext';
import t from '~/app/i18n';
import Dialog from '~/app/molecules/dialog/Dialog';
import ProfileContent from '~/app/molecules/profile/ProfileContent';
import Text from '~/app/atoms/text/Text';
import { css, cva } from '~styled/css';
import { square } from '~styled/patterns';
import { Flex, Square } from '~styled/jsx';
import UserCirclePlusDuotone from '~icons/ph/user-circle-plus-duotone';

const buttonBase = css.raw({
  padding: '0.5rem',
  transitionProperty: 'background-color',
  transitionDuration: '200ms',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '0.75rem',
  display: 'flex',
  flexDirection: 'row',
  gap: '0.5rem',
  width: '100%',
  alignItems: 'center',
  _hover: {
    backgroundColor: 'mauve.4',
  },
});

export const button = cva({
  base: buttonBase,
  variants: {
    current: {
      true: {
        backgroundColor: 'ruby.5',
        _hover: {
          backgroundColor: 'mauve.5',
        },
      },
    },
  },
});

export const addAccountButton = css(buttonBase, {
  alignItems: 'center',
});

export type ClientSwitchDialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type ClientSwitchItemProps = {
  id: string;
};

const ClientSwitchItem: Component<ClientSwitchItemProps> = (props) => {
  const { clients } = useAppContext();
  const id = () => props.id;
  const name = () => profiles[id()]?.name;
  const avatar = () => profiles[id()]?.avatar;
  const userId = () => clients.get(id())!.userId;

  return <ProfileContent name={name()} avatar={avatar()} userId={userId()} />;
};

const ClientSwitchDialog: Component<ClientSwitchDialogProps> = (props) => {
  const { clients, current } = useAppContext();
  const navigate = useNavigate();
  const [ids, setIds] = createSignal<string[]>(Array.from(clients.keys()));
  const [addAccount, setAddAccount] = createSignal(false);

  return (
    <>
      <Dialog modal open={props.open} onOpenChange={props.onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content class={css({ width: '100%', maxWidth: '28rem' })}>
            <Dialog.StyledHeader title={t('switch_user')} closeButton />
            <Flex direction='column' mt='2' gap='1'>
              <For each={ids()}>
                {(id) => (
                  <Button
                    onClick={() => {
                      props.onOpenChange(false);
                      // TODO context()?.switch(id);
                      navigate(`/rooms`, { replace: true });
                    }}
                    class={button({ current: id === current() })}
                  >
                    <ClientSwitchItem id={id} />
                  </Button>
                )}
              </For>
              <Button
                onClick={() => {
                  props.onOpenChange(false);
                  setAddAccount(true);
                }}
                class={addAccountButton}
              >
                <Square
                  size='12'
                  display='flex'
                  flexShrink='0'
                  alignItems='center'
                  justifyContent='center'
                  rounded='full'
                >
                  <UserCirclePlusDuotone class={square({ size: '8' })} />
                </Square>
                <Flex direction='column' flexGrow='1' overflow='hidden'>
                  <Text font='bold' content='truncate'>
                    Add Account
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
      {/* <AddAccountDialog open={addAccount()} onOpenChange={setAddAccount} /> */}
    </>
  );
};

export default ClientSwitchDialog;
