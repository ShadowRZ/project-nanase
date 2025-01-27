import { Box, Flex, HStack } from '@hanekokoro-ui/styled-system/jsx';
import { Slate } from '@slate-solid/core';
import { type Component } from 'solid-js';
import PaperPlaneTiltDuotone from '~icons/ph/paper-plane-tilt-duotone';
import PaperclipDuotone from '~icons/ph/paperclip-duotone';
import SmileyDuotone from '~icons/ph/smiley-duotone';
import StickerDuotone from '~icons/ph/sticker-duotone';
import TextAaDuotone from '~icons/ph/text-aa-duotone';
import { sanitizeText } from '../../../lib/utils/sanitize';
import { useEditor } from '../../hooks/useEditor';
import { useRoom } from '../../hooks/useRoom';
import { IconButton } from './styled/IconButton';
import { StyledEditable } from './styled/StyledEditable';

export const customHtmlEqualsPlainText = (
  customHtml: string,
  plain: string
): boolean => customHtml.replaceAll('<br/>', '\n') === sanitizeText(plain);

type EditorProps = {
  onSend?: () => void;
};

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const Editor: Component<EditorProps> = (props) => {
  const room = useRoom();
  const editor = useEditor();

  return (
    <Slate editor={editor()} initialValue={initialValue}>
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
            <StyledEditable placeholder='Write something...' />
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
    </Slate>
  );
};

export default Editor;
