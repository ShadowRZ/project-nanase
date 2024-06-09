import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import { createSignal, type Component } from 'solid-js';
import { Tooltip } from '@kobalte/core/tooltip';
import ImageButton from '~/app/atoms/button/ImageButton';
import Panel from '~/app/atoms/panel/Panel';
import { createCurrentClientResource } from '~/app/hooks/createClientResource';
import { profiles } from '~/app/hooks/createProfileStore';
import { useAppContext } from '~/app/hooks/useAppContext';
import t from '~/app/i18n';
import ConfrimDialog from '~/app/molecules/confrim-dialog/ConfirmDialog';
import ProfileContent from '~/app/molecules/profile/ProfileContent';
import ClientSwitchDialog from '~/app/organisms/switch-dialog/ClientSwitchDialog';
import PowerDuotone from '~icons/ph/power-duotone';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';
import UserSwitchDuotone from '~icons/ph/user-switch-duotone';
import Box from '~/app/atoms/box/Box';

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
          <ImageButton
            as={DropdownMenuWrapper}
            size='large'
            src={avatar()}
            icon={UserCircleDuotone}
          />
          <Tooltip.Portal>
            <Tooltip.Content class='ml-1'>{t('account_menu')}</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip>
        <DropdownMenu.Portal>
          <Panel
            as={DropdownMenu.Content}
            decoration='bordered'
            class='mb-1 mr-4 max-w-[min(20rem,var(--kb-popper-content-available-width))] outline-none rounded-md bg-white dark-bg-black flex flex-col animate-popup-close ui-expanded:animate-popup-open'
          >
            <div class='rounded-t-md rounded-b-md bg-neutral-100 dark:bg-neutral-900 p-2 flex flex-row gap-2 items-center justify-start'>
              <ProfileContent
                name={name()}
                avatar={avatar()}
                userId={userId()}
              />
              <div class='flex flex-row gap-2'>
                <Tooltip placement='top' openDelay={0} closeDelay={0}>
                  <DropdownMenu.Item
                    onSelect={() => {
                      setSwitchOpen(true);
                    }}
                    as={Tooltip.Trigger}
                    class='flex items-center justify-center size-8 rounded-full transform duration-200 ui-highlighted:bg-orange-100 dark:ui-highlighted:bg-orange-900 outline-none ui-highlighted:ring-2 ring-orange-300'
                  >
                    <UserSwitchDuotone class='size-6 text-orange-500' />
                  </DropdownMenu.Item>
                  <Tooltip.Portal>
                    <Tooltip.Content class='mb-1'>
                      {t('switch_user')}
                    </Tooltip.Content>
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
                    class='flex items-center justify-center size-8 rounded-full transform duration-200 ui-highlighted:bg-red-100 dark:ui-highlighted:bg-red-900 outline-none ui-highlighted:ring-2 ring-red-300'
                  >
                    <PowerDuotone class='size-6 text-red-500' />
                  </DropdownMenu.Item>
                  <Tooltip.Portal>
                    <Tooltip.Content as={Box} color='tooltip' mb='1'>
                      {t('logout')}
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip>
              </div>
            </div>
          </Panel>
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
