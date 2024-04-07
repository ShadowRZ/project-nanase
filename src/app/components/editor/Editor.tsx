import {
  Extension,
  type JSONContent,
  type Editor as TiptapEditor,
} from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { type Component } from 'solid-js';
import { createTiptapEditor } from 'solid-tiptap';
import IconButton from '~/app/atoms/button/IconButton';
import { ProseExtensions } from '~/app/lib/editor-extensions';
import PaperPlaneTiltDuotone from '~icons/ph/paper-plane-tilt-duotone';
import PaperclipDuotone from '~icons/ph/paperclip-duotone';
import SmileyDuotone from '~icons/ph/smiley-duotone';
import StickerDuotone from '~icons/ph/sticker-duotone';

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
        emptyEditorClass:
          'first:before:content-[attr(data-placeholder)] before:opacity-50 before:pointer-events-none before:float-left before:h-0',
        placeholder: 'Write something...',
      }),
      EnterExtension,
    ],
    editorProps: {
      attributes: {
        class: 'mx-auto focus:outline-none',
      },
    },
  }));

  return (
    <div class='flex flex-row items-center px-1 gap-1'>
      <IconButton
        type='circle'
        icon={PaperclipDuotone}
        class='size-8'
        iconClass='size-5 text-slate-700'
        title='Upload'
      />
      <div
        data-project-nanase-composer
        class='grow max-h-32 overflow-y-scroll scrollbar-none'
        ref={ref}
      />
      <IconButton
        type='circle'
        icon={StickerDuotone}
        class='size-8'
        iconClass='size-5 text-slate-700'
        title='Insert Emoji'
      />
      <IconButton
        type='circle'
        icon={SmileyDuotone}
        class='size-8'
        iconClass='size-5 text-slate-700'
        title='Send Sticker'
      />
      <IconButton
        onClick={() => {
          editorSend(editor()!);
        }}
        type='circle'
        icon={PaperPlaneTiltDuotone}
        class='size-8 group'
        iconClass='size-5 text-rose-500 group-disabled:text-rose-500/50'
        title='Send'
      />
    </div>
  );
};

export default Editor;
