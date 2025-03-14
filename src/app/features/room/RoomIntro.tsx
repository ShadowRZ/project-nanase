import { IconButton, DropdownMenu, Text } from '@hanekokoro-ui/solid';
import { css } from '@hanekokoro-ui/styled-system/css';
import { Flex, styled } from '@hanekokoro-ui/styled-system/jsx';
import { flex } from '@hanekokoro-ui/styled-system/patterns';
import { Show, type Component } from 'solid-js';
import ArrowLeft from '~icons/ph/arrow-left';
import DoorOpenDuotone from '~icons/ph/door-open-duotone';
import DotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
import GearDuotone from '~icons/ph/gear-duotone';
import HashStraightBold from '~icons/ph/hash-straight-bold';
import ShieldDuotone from '~icons/ph/shield-duotone';
import UserCircleFill from '~icons/ph/user-circle-fill';
import UsersThreeDuotone from '~icons/ph/users-three-duotone';
import { MxcAvatar } from '../../components/mxc-avatar/MxcAvatar';

type RoomIntroProps = {
  name?: string;
  topic?: string;
  avatar?: string;
  direct?: boolean;
  encrypted?: boolean;
  onBack?: () => void;
  onMembers?: () => void;
  onSettings?: () => void;
  onLeaveRoom?: () => void;
};

export const RoomIntro: Component<RoomIntroProps> = (props) => {
  return (
    <Flex
      direction='row'
      boxSizing='content-box'
      gap='2'
      alignItems='center'
      h='12'
      px='4'
      py='2'
      borderBottomWidth='1'
      borderColor='border.default'
    >
      <IconButton
        onClick={props.onBack}
        variant='ghost'
        colorPalette='neutral'
        md={{ display: 'none' }}
      >
        <ArrowLeft />
      </IconButton>
      <MxcAvatar
        icon={
          <Show when={props.direct} fallback={<HashStraightBold />}>
            <UserCircleFill />
          </Show>
        }
        src={props.avatar}
      />
      <styled.span
        class={flex({
          direction: 'column',
          flex: '1',
          minW: '0',
          truncate: true,
        })}
      >
        <Text as='span' fontWeight='bold' truncate minW='0' flex='1'>
          <Show when={props.encrypted}>
            <ShieldDuotone
              class={css({
                colorPalette: 'accent',
                display: 'inline',
                mb: '1',
                me: '1',
                color: 'colorPalette.text',
              })}
            />
          </Show>
          {props.name ?? '<Unknown Room>'}
        </Text>
        <Show when={props.topic}>
          <Text
            as='span'
            color='fg.muted'
            truncate
            minW='0'
            flex='1'
            title={props.topic}
          >
            {props.topic}
          </Text>
        </Show>
      </styled.span>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          as={IconButton}
          variant='ghost'
          colorPalette='neutral'
        >
          <DotsThreeVerticalBold />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item onSelect={() => props.onMembers?.()}>
              <UsersThreeDuotone /> Members
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => props.onSettings?.()}>
              <GearDuotone /> Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={() => props.onLeaveRoom?.()}
              colorPalette='red'
            >
              <DoorOpenDuotone /> Leave Room
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </Flex>
  );
};
