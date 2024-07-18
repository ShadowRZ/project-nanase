import { useParams } from '@solidjs/router';
import { SyncState } from 'matrix-js-sdk';
import {
  Match,
  Show,
  Switch,
  createMemo,
  createSignal,
  type Component,
  type ParentComponent,
} from 'solid-js';
import Sidebar from '~/app/components/sidebar/Sidebar';
import { createCurrentClientStatus } from '~/app/hooks/createClientStatus';
import RoomList, {
  type RoomCategory,
} from '~/app/organisms/room-list/RoomList';
import Room from '~/app/organisms/room/Room';
import { Welcome } from '~/app/organisms/welcome/Welcome';
import XCircleFill from '~icons/ph/x-circle-fill';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';
import { Flex } from '~styled/jsx';

const StatusContainer: ParentComponent = (props) => {
  return (
    <Flex
      direction='row'
      position='sticky'
      bottom='0'
      p='2'
      borderTopWidth='1'
      borderColor='mauve.7'
      w='full'
      gap='2'
      alignItems='center'
      bg={{ base: 'white', _dark: 'black' }}
    >
      {props.children}
    </Flex>
  );
};

const SyncStatus: Component = () => {
  const status = createCurrentClientStatus();

  return (
    <Switch>
      <Match when={status() === null || status() === SyncState.Reconnecting}>
        <StatusContainer>
          <LoadingIndicator /> Syncing......
        </StatusContainer>
      </Match>
      <Match when={status() === SyncState.Error}>
        <StatusContainer>
          <XCircleFill />
          Sync errored, will try again.
        </StatusContainer>
      </Match>
    </Switch>
  );
};

const LeftContent: Component = () => {
  const [category, setCategory] = createSignal<RoomCategory>({ type: 'chats' });

  return (
    <Flex
      direction='row'
      flex='none'
      w={{ base: 'full', md: '27.5rem' }}
      borderRightWidth={{ base: 'unset', sm: '1' }}
      borderColor='mauve.7'
      position='relative'
    >
      <Sidebar category={category()} onCategoryChanged={setCategory} />
      <Flex
        direction='column'
        position='relative'
        w='full'
        h='dvh'
        overflowY='scroll'
        scrollbar='hidden'
      >
        <RoomList category={category()} />
        <SyncStatus />
      </Flex>
    </Flex>
  );
};

const RightContent: Component = () => {
  const selectedRoom = createMemo(() => useParams().id);

  return (
    <Show when={selectedRoom() !== undefined} fallback={<Welcome />}>
      <Flex
        direction='column'
        w='full'
        h='dvh'
        minW='0'
        zIndex='5'
        flex='1'
        position={{ base: 'absolute', md: 'static' }}
        bg={{ base: 'white', _dark: 'black' }}
      >
        <Room roomId={selectedRoom()} />
      </Flex>
    </Show>
  );
};

const MatrixChat: Component = () => {
  return (
    <Flex direction='row'>
      <LeftContent />
      <RightContent />
    </Flex>
  );
};

export default MatrixChat;
