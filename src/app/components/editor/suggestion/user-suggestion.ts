import { createCallback } from '@solid-primitives/rootless';
import { MentionNodeAttrs } from '@tiptap/extension-mention';
import { SuggestionOptions } from '@tiptap/suggestion';
import { Room, RoomMember } from 'matrix-js-sdk';
import { Accessor } from 'solid-js';
import { SolidRenderer } from 'tiptap-solid';
import { css } from '@hanekokoro-ui/styled-system/css';
import {
  UserMentionList,
  UserMentionListProps,
  UserMentionListRef,
} from './components/UserMentionList';
import { SuggestionParams } from './types';

export const userItems = (room: Accessor<Room>) =>
  createCallback(({ query }: SuggestionParams) =>
    room()
      .getMembers()
      .filter((member) => member.name.startsWith(query))
  );

export const userSuggestion = (
  room: Accessor<Room>
): Omit<SuggestionOptions<RoomMember, MentionNodeAttrs>, 'editor'> => ({
  items: userItems(room),
  render: () => {
    let component: SolidRenderer<UserMentionListProps>;
    let mounted;
    let ref: UserMentionListRef;

    return {
      /* eslint-disable solid/reactivity */
      onStart: (props) => {
        mounted = document.querySelector('#project-nanase-editor');
        component = new SolidRenderer(UserMentionList, {
          props: {
            ...props,
            ref: ($ref: UserMentionListRef) => (ref = $ref),
          },
          editor: props.editor,
          className: css({
            position: 'relative',
          }),
        });

        if (!props.clientRect) {
          return;
        }

        mounted?.prepend(component.element);
      },

      onUpdate: (props) => {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          (component.element as HTMLElement).style.display = 'none';
          return true;
        }

        return ref?.onKeyDown(props);
      },

      onExit() {
        component.element.remove();
        component.destroy();
      },
      /* eslint-enable solid/reactivity */
    };
  },
});
