import {
  Extension,
  type JSONContent,
  type Editor as TiptapEditor,
} from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { type Component } from 'solid-js';
import { createTiptapEditor } from 'solid-tiptap';
import IconButton from '~/app/atoms/icon-button/IconButton';
import { ProseExtensions } from '~/app/lib/editor-extensions';
import { sanitizeText } from '~/lib/utils/sanitize';
import { css } from '~styled/css';
import { Flex } from '~styled/jsx';
import PaperPlaneTiltDuotone from '~icons/ph/paper-plane-tilt-duotone';
import PaperclipDuotone from '~icons/ph/paperclip-duotone';
import SmileyDuotone from '~icons/ph/smiley-duotone';
import StickerDuotone from '~icons/ph/sticker-duotone';

export const customHtmlEqualsPlainText = (
  customHtml: string,
  plain: string
): boolean => customHtml.replaceAll('<br/>', '\n') === sanitizeText(plain);

type EditorProps = {
  onSend: (doc: JSONContent, text: string) => void;
};

const Editor: Component<EditorProps> = (props) => {
  let ref!: HTMLDivElement;

  function editorSend(editor: TiptapEditor): void {
    const json = editor.getJSON();
    const text = editor.getText({ blockSeparator: '\n' });
    props.onSend(json, text);
    editor.commands.setContent('');
  }

  const EnterExtension = Extension.create({
    addKeyboardShortcuts() {
      return {
        Enter({ editor }) {
          editorSend(editor);
          return true;
        },
      };
    },
  });

  const editor = createTiptapEditor(() => ({
    element: ref,
    extensions: [
      ...ProseExtensions,
      Placeholder.configure({
        emptyEditorClass: css({
          _before: {
            opacity: '50',
            pointerEvents: 'none',
            float: 'left',
            height: 0,
          },
          _first: {
            _before: {
              content: 'attr(data-placeholder)',
            },
          },
        }),
        placeholder: 'Write something...',
      }),
      EnterExtension,
    ],
    editorProps: {
      attributes: {
        class: css({ mx: 'auto', _focus: { outline: 'none' } }),
      },
    },
  }));

  return (
    <Flex direction='row' alignItems='center' px='1' gap='1'>
      <IconButton
        type='circle'
        icon={PaperclipDuotone}
        iconClass={css({ color: 'mauve.9' })}
        title='Upload'
      />
      <div
        data-project-nanase-composer
        class={css({
          flexGrow: '1',
          maxHeight: '32',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          _scrollbar: {
            display: 'none',
          },
        })}
        ref={ref}
      />
      <IconButton
        type='circle'
        icon={StickerDuotone}
        iconClass={css({ color: 'mauve.9' })}
        title='Insert Emoji'
      />
      <IconButton
        type='circle'
        icon={SmileyDuotone}
        iconClass={css({ color: 'mauve.9' })}
        title='Send Sticker'
      />
      <IconButton
        onClick={() => {
          editorSend(editor()!);
        }}
        type='circle'
        icon={PaperPlaneTiltDuotone}
        iconClass={css({ color: 'ruby.9' })}
        title='Send'
      />
    </Flex>
  );
};

export default Editor;
