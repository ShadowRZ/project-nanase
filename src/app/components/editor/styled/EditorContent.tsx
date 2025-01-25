import { EditorContent as BaseEditorContent } from 'tiptap-solid';
import { styled } from '@hanekokoro-ui/styled-system/jsx';

export const EditorContent = styled(BaseEditorContent, {
  base: {
    flexGrow: '1',
  },
});
