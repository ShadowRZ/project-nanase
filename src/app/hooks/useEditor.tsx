import { withSolid } from '@slate-solid/core';
import {
  Accessor,
  createContext,
  createMemo,
  ParentComponent,
  useContext,
} from 'solid-js';
import { createEditor } from 'slate';

const EditorContext = createContext<Accessor<ReturnType<typeof withSolid>>>();

export const useEditor = () => {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error('Editor Context was not provided!');
  }
  return ctx;
};

export const EditorProvider: ParentComponent = (props) => {
  const editor = createMemo(() => withSolid(createEditor()));

  return (
    <EditorContext.Provider value={editor}>
      {props.children}
    </EditorContext.Provider>
  );
};
