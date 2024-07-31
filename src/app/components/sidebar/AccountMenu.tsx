import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { createSignal, type Component } from 'solid-js';
import Panel from '~/app/atoms/panel/Panel';
import Tooltip from '~/app/atoms/tooltip/Tooltip';
import Avatar from '~/app/components/avatar/Avatar';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { profiles } from '~/app/hooks/createProfileStore';
import { useAppContext } from '~/app/hooks/useAppContext';
import t from '~/app/i18n';
import ConfrimDialog from '~/app/molecules/confirm-dialog/ConfirmDialog';
import ProfileContent from '~/app/molecules/profile/ProfileContent';
import ClientSwitchDialog from '~/app/organisms/switch-dialog/ClientSwitchDialog';
import { flex, square } from '~styled/patterns';
import { Flex } from '~styled/jsx';
import PowerDuotone from '~icons/ph/power-duotone';
import UserSwitchDuotone from '~icons/ph/user-switch-duotone';

const DropdownMenuWrapper: Component = (props) => {
  return <DropdownMenu.Trigger as={Tooltip.Trigger} {...props} />;
};

const AccountMenu: Component = () => {
  const { clients, current } = useAppContext();
  const name = () => profiles[current()]?.name;
  const avatar = () => profiles[current()]?.avatar;
  const client = createCurrentClientResource();
  const userId = () => clients.get(current())!.userId;

  const [logoutOpen, setLogoutOpen] = createSignal(false);
  const [switchOpen, setSwitchOpen] = createSignal(false);

  return (
    <>
      <DropdownMenu fitViewport modal preventScroll>
        <Tooltip placement='right' openDelay={0} closeDelay={0}>
          <Avatar.Button as={DropdownMenuWrapper} size='large' src={avatar()} />
          <Tooltip.Portal>
            <Tooltip.Content ml='1'>{t('account_menu')}</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            as={Panel}
            decoration='bordered'
            class={flex({
              direction: 'column',
              mb: '1',
              mr: '4',
              maxWidth: 'min(20rem, var(--kb-popper-content-available-width))',
              outline: 'none',
              rounded: 'md',
              bg: {
                base: 'white',
                _dark: 'black',
              },
              animationName: 'popupClose',
              animationDuration: '150ms',
              animationTimingFunction: 'ease-in',
              _expanded: {
                animationName: 'popupOpen',
                animationDuration: '200ms',
                animationTimingFunction: 'ease-out',
              },
            })}
          >
            <Flex
              direction='row'
              gap='2'
              roundedTop='md'
              roundedBottom='md'
              bg='mauve.3'
              p='2'
              alignItems='center'
              justifyContent='start'
            >
              <ProfileContent
                name={name()}
                avatar={avatar()}
                userId={userId()}
              />
              <Flex direction='row' gap='2'>
                <Tooltip placement='top' openDelay={0} closeDelay={0}>
                  <DropdownMenu.Item
                    onSelect={() => {
                      setSwitchOpen(true);
                    }}
                    as={Tooltip.Trigger}
                    class={square({
                      size: '8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      rounded: 'full',
                      _highlighted: {
                        bg: {
                          base: 'orange.100',
                          _dark: 'orange.900',
                        },
                        ringWidth: '2',
                        outlineStyle: 'solid',
                      },
                      ringColor: 'orange.300',
                    })}
                  >
                    <UserSwitchDuotone
                      class={square({ size: '6', color: 'orange.500' })}
                    />
                  </DropdownMenu.Item>
                  <Tooltip.Portal>
                    <Tooltip.Content mb='1'>{t('switch_user')}</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
                <Tooltip placement='top' openDelay={0} closeDelay={0}>
                  <DropdownMenu.Item
                    onClick={() => {
                      setTimeout(() => {
                        setLogoutOpen(true);
                      });
                    }}
                    as={Tooltip.Trigger}
                    class={square({
                      size: '8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      rounded: 'full',
                      _highlighted: {
                        bg: {
                          base: 'red.100',
                          _dark: 'red.900',
                        },
                        ringWidth: '2',
                        outlineStyle: 'solid',
                      },
                      ringColor: 'red.300',
                    })}
                  >
                    <PowerDuotone
                      class={square({ size: '6', color: 'red.500' })}
                    />
                  </DropdownMenu.Item>
                  <Tooltip.Portal>
                    <Tooltip.Content mb='1'>{t('logout')}</Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
              </Flex>
            </Flex>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
      <ConfrimDialog
        type='danger'
        open={logoutOpen()}
        onOpenChange={setLogoutOpen}
        title={t('logout_dialog_title')}
        description={t('logout_dialog_desc')}
        confirm={t('confirm_logout')}
        cancel={t('cancel')}
        onConfirm={() => {
          setLogoutOpen(false);
          client()
            ?.logout()
            .then(() => {
              window.location.reload();
            })
            .catch(() => {
              window.location.reload();
            });
        }}
        onCancel={() => setLogoutOpen(false)}
      />
      <ClientSwitchDialog open={switchOpen()} onOpenChange={setSwitchOpen} />
    </>
  );
};

export default AccountMenu;
