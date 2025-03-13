import { useLexicalComposerContext } from 'lexical-solid/LexicalComposerContext';
import { createEffect } from 'solid-js';
import { createRoomInfo } from '../../../hooks/createRoomInfo';
import { useRoom } from '../../../hooks/useRoom';

export function SyncMaySendPlugin() {
  const [editor] = useLexicalComposerContext();
  const room = useRoom();
  const { maySendMessage } = createRoomInfo(room);

  createEffect(() => {
    editor.setEditable(maySendMessage());
  });

  // eslint-disable-next-line unicorn/no-useless-undefined
  return undefined;
}
