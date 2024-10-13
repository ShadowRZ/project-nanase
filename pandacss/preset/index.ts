import { definePreset } from '@pandacss/dev';
import { breakpoints } from './breakpoints';
import { recipes, slotRecipes } from './recipes';
import { conditions } from './conditions';
import { containerSizes } from './containers';
import { keyframes } from './keyframes';
import { radixColors } from './radix-colors';
import { createSemanticTokens } from './semantic-tokens';
import { tokens } from './tokens';
import type { RadixGrayScale, RadixScale, SemanticColors } from './types';
import { textStyles } from './typography';

export type PresetOptions = {
  /** The accent color. */
  accent: RadixScale;
  /** The gray color. */
  gray: RadixGrayScale;
  semanticColors?: SemanticColors;
};

/**
 * Create a preset derived from `@pandacss/preset-panda`.
 *
 * This preset uses the Radix Color instead, and combines the styles used in components.
 *
 * @see https://github.com/chakra-ui/panda/blob/283b3090a72074b92e638979a75cc3adc4a684e5/packages/preset-panda/src
 */
export const createPreset = (options?: Partial<PresetOptions>) => {
  const semanticColors = {
    accent: options?.accent ?? 'pink',
    gray: options?.gray ?? 'mauve',
    ...options?.semanticColors,
  };

  return definePreset({
    name: '@shadowrz/hanekokoro-ui',
    theme: {
      keyframes,
      breakpoints,
      tokens: {
        ...tokens,
        colors: radixColors,
      },
      textStyles,
      containerSizes,
      semanticTokens: createSemanticTokens(semanticColors),
      recipes,
      slotRecipes,
      extend: {
        tokens: {
          colors: {
            current: { value: 'currentColor' },
            black: { DEFAULT: { value: '#000' } },
            white: { DEFAULT: { value: '#fff' } },
            transparent: { value: 'rgb(0 0 0 / 0)' },
          },
        },
      },
    },
    conditions,
  });
};
