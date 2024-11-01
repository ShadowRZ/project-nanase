import { MentionNodeAttrs } from '@tiptap/extension-mention';
import { SuggestionKeyDownProps } from '@tiptap/suggestion';
import { RoomMember } from 'matrix-js-sdk';
import { Component, For, createSignal, onMount } from 'solid-js';
import { MxcAvatar } from '../../../mxc-avatar/MxcAvatar';
import { useMatrixClient } from '../../../../hooks/useMatrixClient';
import { css, cx } from '~styled/css';

import { menu } from '~styled/recipes';
import { Box } from '~styled/jsx';

export type UserMentionListRef = {
  onKeyDown: (ev: SuggestionKeyDownProps) => boolean;
};

export type UserMentionListProps = {
  items: RoomMember[];
  command: (item: MentionNodeAttrs) => void;
  ref?: (ref: UserMentionListRef) => void;
};

const $menu = menu();

export const UserMentionList: Component<UserMentionListProps> = (props) => {
  const client = useMatrixClient();
  const [selectedIndex, setSelectedIndex] = createSignal(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item.userId, label: item.name });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex() + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex() + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex());
  };

  onMount(() => {
    props.ref?.({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          upHandler();
          return true;
        }

        if (event.key === 'ArrowDown') {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      },
    });
  });

  return (
    <Box p='2' position='absolute' bottom='0' left='0' right='0'>
      <div
        class={cx(
          $menu.content,
          css({
            maxH: '72',
            w: 'full',
          })
        )}
      >
        <For each={props.items}>
          {(member, idx) => (
            <button
              class={cx($menu.item, css({ w: 'full' }))}
              data-highlighted={idx() === selectedIndex() ? '' : undefined}
              onClick={() => selectItem(idx())}
            >
              <MxcAvatar
                client={client()}
                src={member.getMxcAvatarUrl()}
                size='small'
              />
              {member.name}
            </button>
          )}
        </For>
      </div>
    </Box>
  );
};
