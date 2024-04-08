import { Tooltip } from '@kobalte/core';
import { For, type Component, Suspense, Show } from 'solid-js';
import Avatar from '~/app/atoms/avatar/Avatar';
import { createSpaceList } from '~/app/hooks/createSpaces';
import { createRoomResource } from '~/app/hooks/createRoomResource';
import FoldersDuotone from '~icons/ph/folders-duotone';
import ImageButton from '~/app/atoms/button/ImageButton';
import TooltipContent from '~/app/atoms/tooltip/TooltipContent';

type SpaceItemProps = {
  spaceId: string;
  category: string;
  onCategoryChanged: (category: string) => void;
};

const SpaceItem: Component<SpaceItemProps> = (props) => {
  const spaceId = () => props.spaceId;
  const { name, avatar } = createRoomResource(spaceId);

  return (
    <Tooltip.Root placement='right' openDelay={0} closeDelay={0}>
      <ImageButton
        as={Tooltip.Trigger}
        onClick={() => {
          props.onCategoryChanged(props.spaceId);
        }}
        size='large'
        src={avatar()}
        icon={FoldersDuotone}
        checked={props.category === props.spaceId}
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
  category: string;
  onCategoryChanged: (category: string) => void;
};

const SpaceList: Component<SpaceListProps> = (props) => {
  const spaces = createSpaceList();

  return (
    <Show when={spaces()}>
      <For each={spaces()}>
        {(spaceId) => (
          <SpaceItem
            spaceId={spaceId}
            category={props.category}
            onCategoryChanged={props.onCategoryChanged}
          />
        )}
      </For>
    </Show>
  );
};

export default SpaceList;
