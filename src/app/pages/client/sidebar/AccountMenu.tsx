import { Avatar } from '@/components/ui/avatar';
import { Menu } from '@/components/ui/menu';
import { Tooltip } from '@/components/ui/tooltip';
import { createUniqueId, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useSelfProfile } from '~/app/hooks/useClientState';
import { useMatrixClient } from '~/app/hooks/useMatrixClient';
import t from '~/app/i18n';
import ProfileContent from '~/app/molecules/profile/ProfileContent';
import CodeDuotone from '~icons/ph/code-duotone';
import GearSixDuotone from '~icons/ph/gear-six-duotone';
import PowerDuotone from '~icons/ph/power-duotone';
import ShieldCheckeredDuotone from '~icons/ph/shield-checkered-duotone';
import UserSwitchDuotone from '~icons/ph/user-switch-duotone';
import { Flex } from '~styled/jsx';
import { square } from '~styled/patterns';
import { MxcImg } from '../../../components/mxc-img/MxcImg';

const AccountMenu: Component = () => {
  const trigger = createUniqueId();
  const mx = useMatrixClient();
  const profile = useSelfProfile();
  const userId = () => mx().getSafeUserId();

  return (
    <>
      <Menu.Root ids={{ trigger }}>
        <Tooltip.Root ids={{ trigger }} positioning={{ placement: 'right' }}>
          <Tooltip.Trigger.AsChild>
            {(props) => (
              <Menu.Trigger.AsChild {...props()}>
                {(props) => (
                  <Avatar.WithComponent ids={{ root: trigger }} {...props()}>
                    {(props) => (
                      <MxcImg
                        {...props()}
                        client={mx()}
                        src={profile.avatarUrl}
                      />
                    )}
                  </Avatar.WithComponent>
                )}
              </Menu.Trigger.AsChild>
            )}
          </Tooltip.Trigger.AsChild>
          <Portal>
            <Tooltip.Positioner>
              <Tooltip.Content>{t('account_menu')}</Tooltip.Content>
            </Tooltip.Positioner>
          </Portal>
        </Tooltip.Root>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value='settings'>
                <GearSixDuotone /> Settings
              </Menu.Item>
              <Menu.Item value='security'>
                <ShieldCheckeredDuotone /> Security
              </Menu.Item>
              <Menu.Item value='devtools'>
                <CodeDuotone /> Developer Tools
              </Menu.Item>
              <Flex direction='row' mt='2' gap='2' px='1' alignItems='center'>
                <ProfileContent
                  mx={mx()}
                  name={profile.displayName}
                  avatar={profile.avatarUrl}
                  userId={userId()}
                />
                <Tooltip.Root positioning={{ placement: 'top' }}>
                  <Tooltip.Trigger.AsChild>
                    {(props) => (
                      <Menu.Item
                        {...props()}
                        value='switch'
                        colorPalette='orange'
                        width='8'
                        height='8'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        rounded='full'
                        transition='all'
                        _highlighted={{
                          bg: 'colorPalette.3',
                          ringWidth: '2',
                          outlineStyle: 'solid',
                        }}
                        ringColor='colorPalette.ring'
                      >
                        <UserSwitchDuotone
                          class={square({
                            size: '6',
                            color: 'colorPalette.text',
                          })}
                        />
                      </Menu.Item>
                    )}
                  </Tooltip.Trigger.AsChild>
                  <Tooltip.Positioner>
                    <Tooltip.Content>Switch Account</Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
                <Tooltip.Root positioning={{ placement: 'top' }}>
                  <Tooltip.Trigger.AsChild>
                    {(props) => (
                      <Menu.Item
                        {...props()}
                        value='logout'
                        colorPalette='red'
                        width='8'
                        height='8'
                        display='flex'
                        alignItems='center'
                        justifyContent='center'
                        rounded='full'
                        transition='all'
                        _highlighted={{
                          bg: 'colorPalette.3',
                          ringWidth: '2',
                          outlineStyle: 'solid',
                        }}
                        ringColor='colorPalette.ring'
                      >
                        <PowerDuotone
                          class={square({
                            size: '6',
                            color: 'colorPalette.text',
                          })}
                        />
                      </Menu.Item>
                    )}
                  </Tooltip.Trigger.AsChild>
                  <Tooltip.Positioner>
                    <Tooltip.Content>Logout</Tooltip.Content>
                  </Tooltip.Positioner>
                </Tooltip.Root>
              </Flex>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </>
  );
};

export default AccountMenu;