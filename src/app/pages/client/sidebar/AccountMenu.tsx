import { DropdownMenu, Tooltip } from '@hanekokoro-ui/solid';
import { Flex } from '@hanekokoro-ui/styled-system/jsx';
import type { PolymorphicCallbackProps } from '@kobalte/core';
import type {
  DropdownMenuTriggerOptions,
  DropdownMenuTriggerRenderProps,
} from '@kobalte/core/dropdown-menu';
import type { Component, ComponentProps } from 'solid-js';
import CodeDuotone from '~icons/ph/code-duotone';
import GearSixDuotone from '~icons/ph/gear-six-duotone';
import ShieldCheckeredDuotone from '~icons/ph/shield-checkered-duotone';
import { MxcAvatar } from '../../../components/mxc-avatar/MxcAvatar';
import ProfileContent from '../../../components/profile-content/ProfileContent';
import { useSelfProfile } from '../../../hooks/useClientState';
import { useMatrixClient } from '../../../hooks/useMatrixClient';
import t from '../../../i18n';
import { ClientSwitchDialog } from './dialogs/ClientSwitchDialog';
import { LogoutDialog } from './dialogs/LogoutDialog';

const AccountMenu: Component = () => {
  const mx = useMatrixClient();
  const profile = useSelfProfile();
  const userId = () => mx().getSafeUserId();

  return (
    <>
      <DropdownMenu.Root>
        <Tooltip.Root placement='right'>
          <Tooltip.Trigger
            as={(
              props: PolymorphicCallbackProps<
                ComponentProps<typeof DropdownMenu.Trigger<typeof MxcAvatar>>,
                DropdownMenuTriggerOptions,
                DropdownMenuTriggerRenderProps
              >
            ) => (
              <DropdownMenu.Trigger
                {...props}
                as={MxcAvatar}
                _hover={{ cursor: 'pointer' }}
                src={profile.avatar()}
              />
            )}
          />
          <Tooltip.Portal>
            <Tooltip.Content>{t('account_menu')}</Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <DropdownMenu.Portal>
          <DropdownMenu.Content maxW='var(--kb-popper-content-available-width)'>
            <DropdownMenu.Item>
              <GearSixDuotone /> Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <ShieldCheckeredDuotone /> Security
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <CodeDuotone /> Developer Tools
            </DropdownMenu.Item>
            <Flex direction='row' mt='2' gap='2' px='1' alignItems='center'>
              <ProfileContent
                name={profile.name()}
                avatar={profile.avatar()}
                userId={userId()}
              />
              <ClientSwitchDialog />
              <LogoutDialog />
            </Flex>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </>
  );
};

export default AccountMenu;
