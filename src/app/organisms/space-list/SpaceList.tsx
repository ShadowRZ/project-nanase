import { Tooltip } from '@kobalte/core';
import { For, Show, type Component } from 'solid-js';
import ImageButton from '~/app/atoms/button/ImageButton';
import TooltipContent from '~/app/atoms/tooltip/TooltipContent';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import { createSpaceList } from '~/app/hooks/createSpaces';
import FoldersDuotone from '~icons/ph/folders-duotone';

type SpaceItemProps = {
  spaceId: string;
  currentSpaceId: string | undefined;
  onCurrentSpaceIdChanged: (spaceId: string) => void;
};

const SpaceItem: Component<SpaceItemProps> = (props) => {
  const spaceId = () => props.spaceId;
  const { name, avatar } = createRoomResource(spaceId);

  return (
    <Tooltip.Root placement='right' openDelay={0} closeDelay={0}>
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
        <Tooltip.Content as={TooltipContent} class='ml-1'>
          {name() ?? props.spaceId}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
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
