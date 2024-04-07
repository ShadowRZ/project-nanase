import { type JSONContent, generateHTML } from '@tiptap/core';
import { ProseExtensions } from '~/app/lib/editor-extensions';

export function isPlain(content: JSONContent[]): boolean {
  if (content.length === 1) {
    if (content[0].type === 'paragraph')
      return isPlain(content[0].content ?? []);
    return content[0].type === 'text';
  }

  return content.every((node) => {
    if (node.type !== 'paragraph') return false;
    return isPlain(node.content ?? []);
  });
}

export function proseJSONToHTML(doc: JSONContent): string {
  const content = doc.content ?? [];
  if (content.length === 0) {
    return '';
  }

  if (content.length === 1 && content[0].type === 'paragraph') {
    doc = {
      type: 'doc',
      content: content[0].content ?? [],
    };
  }

  return generateHTML(doc, ProseExtensions);
}
