import {
  Extension,
  type JSONContent,
  type Editor as TiptapEditor,
} from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';
import { onMount, type Component } from 'solid-js';
import { createTiptapEditor } from 'solid-tiptap';

type EditorProps = {
  ref: (editor?: TiptapEditor) => void;
  onSend: (doc: JSONContent) => void;
};

const Editor: Component<EditorProps> = (props) => {
  let ref!: HTMLDivElement;

  const EnterExtension = Extension.create({
    addKeyboardShortcuts(this) {
      return {
        Enter() {
          // @ts-expect-error Bugged :(
          props.onSend((this.editor as TiptapEditor).getJSON());
          return true;
        },
      };
    },
  });

  const editor = createTiptapEditor(() => ({
    element: ref,
    extensions: [
      StarterKit,
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

  onMount(() => {
    props.ref?.(editor());
  });

  return (
    <div
      data-project-nanase-composer
      class='grow max-h-32 overflow-y-scroll scrollbar-none'
      ref={ref}
    />
  );
};

export default Editor;
