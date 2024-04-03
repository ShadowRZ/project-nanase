import { type IContent, type MsgType } from 'matrix-js-sdk';

export type Message<T extends string> = {
  body: string;
  msgtype: T;
} & IContent;

export type TextMessage<F extends string | undefined> = {
  format: F;
} & Message<MsgType.Text>;

export type FormattedMessage = {
  formatted_body: string;
} & TextMessage<'org.matrix.custom.html'>;

export type MaybeFormattedMessage = TextMessage<undefined> | FormattedMessage;

export type ImageInfo = {
  w: number;
  h: number;
  mimetype: string;
  size: number;
};

export type ImageMessage = {
  info: ImageInfo;
  url: string;
} & Message<MsgType.Image>;

export type AnyMessage = MaybeFormattedMessage | ImageMessage;

export type Sticker = {
  info: ImageInfo;
  url: string;
  body: string;
};

export type Reaction = {
  'm.relates_to': {
    event_id: string;
    key: string;
    rel_type: 'm.annotation';
  };
};
