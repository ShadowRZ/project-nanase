import { EditorContent as BaseEditorContent } from 'tiptap-solid';
import { styled } from '~styled/jsx';

export const EditorContent = styled(BaseEditorContent, {
  base: {
    flexGrow: '1',
  },
});
