import {
  Extension,
  type JSONContent,
  type Editor as TiptapEditor,
} from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { type Component } from 'solid-js';
import { createEditor } from 'tiptap-solid';
import { ProseExtensions } from '~/app/lib/editor-extensions';
import { sanitizeText } from '~/lib/utils/sanitize';
import TextAaDuotone from '~icons/ph/text-aa-duotone';
import PaperPlaneTiltDuotone from '~icons/ph/paper-plane-tilt-duotone';
import PaperclipDuotone from '~icons/ph/paperclip-duotone';
import SmileyDuotone from '~icons/ph/smiley-duotone';
import StickerDuotone from '~icons/ph/sticker-duotone';
import { css } from '@shadowrz/hanekokoro-ui/styled-system/css';
import { Box, Flex, HStack } from '@shadowrz/hanekokoro-ui/styled-system/jsx';
import { EditorContent } from './styled/EditorContent';
import { IconButton } from './styled/IconButton';
import { useRoom } from '../../hooks/useRoom';
import { userSuggestion } from './suggestion/user-suggestion';
import Mention from '@tiptap/extension-mention';

export const customHtmlEqualsPlainText = (
  customHtml: string,
  plain: string
): boolean => customHtml.replaceAll('<br/>', '\n') === sanitizeText(plain);

type EditorProps = {
  onSend?: (doc: JSONContent, text: string) => void;
};

export const Editor: Component<EditorProps> = (props) => {
  const room = useRoom();

  function editorSend(editor: TiptapEditor): void {
    const json = editor.getJSON();
    const text = editor.getText({ blockSeparator: '\n' });
    props.onSend?.(json, text);
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

  const editor = createEditor({
    extensions: [
      ...ProseExtensions,
      Placeholder.configure({
        emptyEditorClass: css({
          _before: {
            opacity: '0.5',
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
      // User mention
      Mention.configure({
        HTMLAttributes: {
          class: css({
            border: '1px solid token(colors.border.default)',
            p: '0.5',
            rounded: 'md',
          }),
        },
        suggestion: userSuggestion(room),
      }),
    ],
    editorProps: {
      attributes: {
        class: css({ _focus: { outline: 'none' } }),
      },
    },
  });

  return (
    <Box id='project-nanase-editor'>
      <Flex
        position='relative'
        direction='column'
        m='2'
        mt='0'
        bg='bg.subtle'
        p='1'
        rounded='md'
        border='1px solid token(colors.border.default)'
      >
        <HStack gap='1'>
          <IconButton size='small' variant='ghost' colorPalette='neutral'>
            <PaperclipDuotone />
          </IconButton>
          <EditorContent editor={editor()} />
          <IconButton size='small' variant='ghost' colorPalette='neutral'>
            <TextAaDuotone />
          </IconButton>
          <IconButton size='small' variant='ghost' colorPalette='neutral'>
            <SmileyDuotone />
          </IconButton>
          <IconButton size='small' variant='ghost' colorPalette='neutral'>
            <StickerDuotone />
          </IconButton>
          <IconButton size='small' variant='ghost' colorPalette='accent'>
            <PaperPlaneTiltDuotone />
          </IconButton>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Editor;
