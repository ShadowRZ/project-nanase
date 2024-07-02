import { For, Show, type Component } from 'solid-js';
import Tooltip from '~/app/atoms/tooltip/Tooltip';
import Avatar from '~/app/components/avatar/Avatar';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createSpaceList } from '~/app/hooks/createSpaces';
import Box from '~/app/atoms/box/Box';
import FoldersFill from '~icons/ph/folders-fill';

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
      <Avatar.Button
        as={Tooltip.Trigger}
        onClick={() => {
          props.onCurrentSpaceIdChanged(props.spaceId);
        }}
        size='large'
        src={avatar()}
        fallback={FoldersFill}
        checked={props.currentSpaceId === props.spaceId}
      />
      <Tooltip.Portal>
        <Tooltip.Content ml='1'>{name() ?? props.spaceId}</Tooltip.Content>
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
