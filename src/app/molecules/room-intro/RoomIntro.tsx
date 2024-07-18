import { Show, type Component } from 'solid-js';
import { DropdownMenu } from '@kobalte/core/dropdown-menu';
import Avatar from '~/app/components/avatar/Avatar';
import IconButton from '~/app/atoms/icon-button/IconButton';
import Text from '~/app/atoms/text/Text';
import Panel from '~/app/atoms/panel/Panel';
import { Flex } from '~styled/jsx';
import { css } from '~styled/css';
import { flex } from '~styled/patterns';
import HashStraightDuotone from '~icons/ph/hash-straight-duotone';
import UserCircleDuotone from '~icons/ph/user-circle-duotone';
import ArrowLeft from '~icons/ph/arrow-left';
import ShieldDuotone from '~icons/ph/shield-duotone';
import DotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
import UsersThreeDuotone from '~icons/ph/users-three-duotone';
import GearDuotone from '~icons/ph/gear-duotone';
import DoorOpenDuotone from '~icons/ph/door-open-duotone';

type RoomIntroProps = {
  name: string;
  topic?: string;
  avatar?: string;
  direct?: boolean;
  encrypted?: boolean;
  onBack?: () => void;
  onMembers?: () => void;
  onSettings?: () => void;
  onLeaveRoom?: () => void;
};

const RoomIntro: Component<RoomIntroProps> = (props) => {
  return (
    <Flex
      direction='row'
      boxSizing='content-box'
      gap='4'
      alignItems='center'
      h='12'
      px='4'
      py='2'
      borderBottomWidth='1'
      borderColor='mauve.7'
    >
      <IconButton
        onClick={props.onBack}
        type='normal'
        icon={ArrowLeft}
        class={css({
          display: {
            base: 'unset',
            md: 'none',
          },
        })}
      />
      <Show
        when={!props.direct}
        fallback={
          <Avatar
            src={props.avatar}
            size='large'
            fallback={UserCircleDuotone}
          />
        }
      >
        <Avatar
          src={props.avatar}
          size='large'
          fallback={HashStraightDuotone}
        />
      </Show>
      <span
        class={flex({
          direction: 'column',
          flex: '1',
          minW: '0',
          truncate: true,
        })}
      >
        <Text font='bold' content='truncate' class={css({ flex: '1' })}>
          <Show when={props.encrypted}>
            <ShieldDuotone
              class={css({ display: 'inline', mb: '1', color: 'ruby.11' })}
            />
          </Show>{' '}
          {props.name}
        </Text>
        <Show when={props.topic}>
          <Text
            content='truncate'
            title={props.topic}
            class={css({ flex: '1' })}
          >
            {props.topic}
          </Text>
        </Show>
      </span>
      <DropdownMenu placement='bottom-end'>
        <IconButton
          as={DropdownMenu.Trigger}
          type='normal'
          icon={DotsThreeVerticalBold}
        />
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            as={Panel}
            decoration='bordered'
            class={css({
              mt: '1',
              zIndex: '5',
              outline: 'none',
              overflow: 'clip',
              animationName: 'hovercardClose',
              animationDuration: '150ms',
              animationTimingFunction: 'ease-in',
              _expanded: {
                animationName: 'hovercardOpen',
                animationDuration: '200ms',
                animationTimingFunction: 'ease-out',
              },
            })}
          >
            <DropdownMenu.Item
              onSelect={props.onMembers}
              class={flex({
                direction: 'row',
                px: '4',
                py: '2',
                gap: '2',
                alignItems: 'center',
                _hover: {
                  cursor: 'pointer',
                  bg: 'mauve.4',
                },
              })}
            >
              <UsersThreeDuotone /> Members
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={props.onSettings}
              class={flex({
                direction: 'row',
                px: '4',
                py: '2',
                gap: '2',
                alignItems: 'center',
                _hover: {
                  cursor: 'pointer',
                  bg: 'mauve.4',
                },
              })}
            >
              <GearDuotone /> Settings
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onSelect={props.onLeaveRoom}
              class={flex({
                direction: 'row',
                px: '4',
                py: '2',
                gap: '2',
                alignItems: 'center',
                _hover: {
                  cursor: 'pointer',
                  bg: 'mauve.4',
                },
                color: 'red.11',
              })}
            >
              <DoorOpenDuotone /> Leave Room
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu>
    </Flex>
  );
};

export default RoomIntro;
