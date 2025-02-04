import { Flex, HStack } from '@hanekokoro-ui/styled-system/jsx';
import { Slate, withSolid } from '@slate-solid/core';
import { createMemo, type Component } from 'solid-js';
import PaperPlaneTiltDuotone from '~icons/ph/paper-plane-tilt-duotone';
import PaperclipDuotone from '~icons/ph/paperclip-duotone';
import SmileyDuotone from '~icons/ph/smiley-duotone';
import StickerDuotone from '~icons/ph/sticker-duotone';
import TextAaDuotone from '~icons/ph/text-aa-duotone';
//import { useRoom } from '../../hooks/useRoom';
import { IconButton } from './styled/IconButton';
import { StyledEditable } from './styled/StyledEditable';
import { createEditor } from 'slate';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const Editor: Component = () => {
  //const room = useRoom();
  const editor = createMemo(() => withSolid(createEditor()));

  return (
    <Slate editor={editor()} initialValue={initialValue}>
      <div id='project-nanase-editor'>
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
      </div>
    </Slate>
  );
};

export default Editor;
