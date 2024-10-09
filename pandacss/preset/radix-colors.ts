import * as colors from '@radix-ui/colors';

const tones = Object.keys(colors).filter(
  (tone) => !tone.startsWith('_') && !tone.includes('P3') && !tone.endsWith('A') && !tone.includes('Dark')
);

const mapTone = (tone: string) => (tone === 'gray' ? 'neutral' : tone);

const scales = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export const radixColors = {
  ...Object.fromEntries(
    tones.map((tone) => [
      mapTone(tone),
      {
        light: Object.fromEntries(
          scales.flatMap((scale) => [
            [scale, { value: (colors as Record<string, Record<string, string>>)[tone][`${tone}${scale}`] }],
            [
              `a${scale}`,
              { value: (colors as Record<string, Record<string, string>>)[`${tone}A`][`${tone}A${scale}`] },
            ],
          ])
        ),
        dark: Object.fromEntries(
          scales.flatMap((scale) => [
            [scale, { value: (colors as Record<string, Record<string, string>>)[`${tone}Dark`][`${tone}${scale}`] }],
            [
              `a${scale}`,
              { value: (colors as Record<string, Record<string, string>>)[`${tone}DarkA`][`${tone}A${scale}`] },
            ],
          ])
        ),
      },
    ])
  ),
  ...Object.fromEntries(
    ['black', 'white'].map((tone) => [
      tone,
      Object.fromEntries(
        scales.map((scale) => [
          `a${scale}`,
          { value: (colors as Record<string, Record<string, string>>)[`${tone}A`][`${tone}A${scale}`] },
        ])
      ),
    ])
  ),
};

const toSemanticTokens = (tone: string) => {
  const base = {
    default: { value: { _light: `{colors.${tone}.9}`, _dark: `{colors.${tone}.9}` } },
    emphasized: { value: { _light: `{colors.${tone}.10}`, _dark: `{colors.${tone}.10}` } },
    fg: { value: { _light: 'white', _dark: 'white' } },
    text: { value: { _light: `{colors.${tone}.11}`, _dark: `{colors.${tone}.11}` } },
    dimmed: { value: { _light: `{colors.${tone}.3}`, _dark: `{colors.${tone}.3}` } },
    light: { value: { _light: `{colors.${tone}.4}`, _dark: `{colors.${tone}.4}` } },
    border: { value: { _light: `{colors.${tone}.6}`, _dark: `{colors.${tone}.6}` } },
    ring: { value: { _light: `{colors.${tone}.8}`, _dark: `{colors.${tone}.8}` } },
  };

  switch (tone) {
    case 'sky':
    case 'mint':
    case 'line':
    case 'yellow':
    case 'amber': {
      return {
        ...base,
        fg: { value: { _light: 'black', _dark: 'black' } },
      };
    }
    case 'neutral': {
      return {
        ...base,
        default: { value: { _light: 'black', _dark: 'white' } },
        emphasized: { value: { _light: '{colors.gray.12}', _dark: '{colors.gray.12}' } },
        fg: { value: { _light: 'white', _dark: 'black' } },
        text: { value: { _light: 'black', _dark: 'white' } },
      };
    }
    default: {
      return base;
    }
  }
};

export const radixSemanticColors = Object.fromEntries(
  tones
    .map((tone) => mapTone(tone))
    .map((tone) => [
      tone,
      {
        ...Object.fromEntries(
          scales.flatMap((scale) => [
            [
              scale,
              {
                value: { _light: `{colors.${tone}.light.${scale}}`, _dark: `{colors.${tone}.dark.${scale}}` },
              },
            ],
            [
              `a${scale}`,
              {
                value: {
                  _light: `{colors.${tone}.light.a${scale}}`,
                  _dark: `{colors.${tone}.dark.a${scale}}`,
                },
              },
            ],
          ])
        ),
        ...toSemanticTokens(tone),
      },
    ])
);
