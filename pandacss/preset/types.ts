type scales = [
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'neutral',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mauve',
  'mint',
  'olive',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sage',
  'sand',
  'sky',
  'slate',
  'teal',
  'tomato',
  'violet',
  'yellow',
];

type grayScales = ['neutral', 'mauve', 'slate', 'sage', 'olive', 'sand'];

export type RadixScale = scales[number];
export type RadixGrayScale = grayScales[number];
export type SemanticColors = Record<string, RadixScale>;
