import { For, Show, type Component } from 'solid-js';
import { Tooltip } from '@kobalte/core/tooltip';
import ImageButton from '~/app/atoms/button/ImageButton';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createSpaceList } from '~/app/hooks/createSpaces';
import FoldersDuotone from '~icons/ph/folders-duotone';
import Box from '~/app/atoms/box/Box';

type SpaceItemProps = {
  spaceId: string;
  currentSpaceId: string | undefined;
  onCurrentSpaceIdChanged: (spaceId: string) => void;
};

const SpaceItem: Component<SpaceItemProps> = (props) => {
  const spaceId = () => props.spaceId;
  const { name, avatar } = createRoomResource(spaceId);

  return (
    <Tooltip placement='right' openDelay={0} closeDelay={0}>
      <ImageButton
        as={Tooltip.Trigger}
        onClick={() => {
          props.onCurrentSpaceIdChanged(props.spaceId);
        }}
        size='large'
        src={avatar()}
        icon={FoldersDuotone}
        checked={props.currentSpaceId === props.spaceId}
      />
      <Tooltip.Portal>
        <Tooltip.Content as={Box} color='tooltip' ml='1'>
          {name() ?? props.spaceId}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
};

type SpaceListProps = {
  currentSpaceId: string | undefined;
  onCurrentSpaceIdChanged: (spaceId: string) => void;
};

const SpaceList: Component<SpaceListProps> = (props) => {
  const spaces = createSpaceList();

  return (
    <Show when={spaces()}>
      <For each={spaces()}>
        {(spaceId) => (
          <SpaceItem
            spaceId={spaceId}
            currentSpaceId={props.currentSpaceId}
            onCurrentSpaceIdChanged={props.onCurrentSpaceIdChanged}
          />
        )}
      </For>
    </Show>
  );
};

export default SpaceList;
