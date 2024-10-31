import { MentionOptions } from '@tiptap/extension-mention';

export type SuggestionParams = Parameters<
  NonNullable<MentionOptions['suggestion']['items']>
>[0];
