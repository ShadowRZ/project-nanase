import { autoPlacement, computePosition } from '@floating-ui/dom';
import { createCallback } from '@solid-primitives/rootless';
import { MentionNodeAttrs } from '@tiptap/extension-mention';
import { SuggestionOptions } from '@tiptap/suggestion';
import { Room, RoomMember } from 'matrix-js-sdk';
import { Accessor } from 'solid-js';
import { SolidRenderer } from 'tiptap-solid';
import {
  UserMentionList,
  UserMentionListProps,
  UserMentionListRef,
} from './components/UserMentionList';
import { SuggestionParams } from './types';
import { css } from '~styled/css';

export const userItems = (room: Accessor<Room>) =>
  createCallback(({ query }: SuggestionParams) =>
    room()
      .getMembers()
      .filter((member) => member.name.startsWith(query))
      .slice(0, 5)
  );

export const userSuggestion = (
  room: Accessor<Room>
): Omit<SuggestionOptions<RoomMember, MentionNodeAttrs>, 'editor'> => ({
  items: userItems(room),
  render: () => {
    let component: SolidRenderer<UserMentionListProps>;
    let reference;
    let ref: UserMentionListRef;

    return {
      /* eslint-disable solid/reactivity */
      onStart: (props) => {
        component = new SolidRenderer(UserMentionList, {
          props: {
            ...props,
            ref: ($ref: UserMentionListRef) => (ref = $ref),
          },
          editor: props.editor,
          className: css({
            position: 'absolute',
            w: 'max-content',
            top: '0',
            left: '0',
          }),
        });

        if (!props.clientRect) {
          return;
        }

        reference = {
          getBoundingClientRect: () => props.clientRect!()!,
        };

        document.body.append(component.element);

        computePosition(reference, component.element as HTMLElement, {
          middleware: [autoPlacement()],
        })
          .then(({ x, y }) => {
            Object.assign((component.element as HTMLElement).style, {
              left: `${x}px`,
              top: `${y}px`,
            });

            return;
          })
          .catch(() => {});
      },

      onUpdate: (props) => {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        reference = {
          getBoundingClientRect: () => props.clientRect!()!,
        };

        computePosition(reference, component.element as HTMLElement, {
          middleware: [autoPlacement()],
        })
          .then(({ x, y }) => {
            Object.assign((component.element as HTMLElement).style, {
              left: `${x}px`,
              top: `${y}px`,
            });

            return;
          })
          .catch(() => {});
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
