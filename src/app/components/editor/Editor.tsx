import { Box, Flex, Float, HStack } from '@hanekokoro-ui/styled-system/jsx';
import { Show, type Component } from 'solid-js';
import PaperPlaneTiltDuotone from '~icons/ph/paper-plane-tilt-duotone';
import PaperclipDuotone from '~icons/ph/paperclip-duotone';
import SmileyDuotone from '~icons/ph/smiley-duotone';
import StickerDuotone from '~icons/ph/sticker-duotone';
import TextAaDuotone from '~icons/ph/text-aa-duotone';
import { IconButton } from './styled/IconButton';

import { css } from '@hanekokoro-ui/styled-system/css';
import { AutoFocusPlugin } from 'lexical-solid/LexicalAutoFocusPlugin';
import { LexicalComposer } from 'lexical-solid/LexicalComposer';
import { ContentEditable } from 'lexical-solid/LexicalContentEditable';
import { LexicalErrorBoundary } from 'lexical-solid/LexicalErrorBoundary';
import { RichTextPlugin } from 'lexical-solid/LexicalRichTextPlugin';
import { SyncMaySendPlugin } from './plugins/SyncMaySendPlugin';
import { createRoomInfo } from '../../hooks/createRoomInfo';
import { useRoom } from '../../hooks/useRoom';

export const Editor: Component = () => {
  const room = useRoom();
  const { maySendMessage } = createRoomInfo(room);

  return (
    <Flex
      data-project-nanase-editor
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
        <IconButton
          size='sm'
          variant='ghost'
          colorPalette='neutral'
          disabled={!maySendMessage()}
        >
          <PaperclipDuotone />
        </IconButton>
        <LexicalComposer
          initialConfig={{
            namespace: 'project-nanase',
            onError: () => {},
          }}
        >
          <Box flexGrow='1' position='relative'>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  class={css({
                    outline: 'none',
                    '&[contenteditable=false]': {
                      cursor: 'not-allowed',
                    },
                  })}
                  aria-placeholder=''
                  placeholder={(editable) => (
                    <Float
                      placement='middle-start'
                      translate='none'
                      color='fg.subtle'
                      userSelect='none'
                      pointerEvents='none'
                    >
                      <Show
                        when={editable}
                        fallback="You can't send messages to this room"
                      >
                        Enter something
                      </Show>
                    </Float>
                  )}
                />
              }
              errorBoundary={LexicalErrorBoundary}
            />
            <AutoFocusPlugin />
            <SyncMaySendPlugin />
          </Box>
        </LexicalComposer>
        <IconButton
          size='sm'
          variant='ghost'
          colorPalette='neutral'
          disabled={!maySendMessage()}
        >
          <TextAaDuotone />
        </IconButton>
        <IconButton
          size='sm'
          variant='ghost'
          colorPalette='neutral'
          disabled={!maySendMessage()}
        >
          <SmileyDuotone />
        </IconButton>
        <IconButton
          size='sm'
          variant='ghost'
          colorPalette='neutral'
          disabled={!maySendMessage()}
        >
          <StickerDuotone />
        </IconButton>
        <IconButton
          size='sm'
          variant='ghost'
          colorPalette='accent'
          disabled={!maySendMessage()}
        >
          <PaperPlaneTiltDuotone />
        </IconButton>
      </HStack>
    </Flex>
  );
};

export default Editor;
