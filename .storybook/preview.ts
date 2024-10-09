import { Preview, SolidRenderer } from 'storybook-solidjs';
import { withThemeByClassName } from '@storybook/addon-themes';
import '@fontsource-variable/inter';
import '@fontsource-variable/outfit';
import 'uno.css';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  globalTypes: {
    font: {
      description: 'Global fonts',
      toolbar: {
        title: 'Font',
        icon: 'document',
        items: ['Inter', 'Outfit'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    font: 'Inter',
  },
  tags: ['autodocs'],
  decorators: [
    // @ts-expect-error: Seems work?
    withThemeByClassName<SolidRenderer>({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      storyFn: () => any,
      context: { globals: { font: string | undefined } }
    ) => {
      const font =
        (context.globals.font as 'Inter' | 'Outfit' | undefined) || 'Inter';
      const parentElement = document.querySelector('html');

      if (!parentElement) {
        return;
      }

      switch (font) {
        case 'Inter': {
          parentElement.style.setProperty(
            '--global-font-body',
            '"Inter Variable", Inter, sans-serif'
          );
          break;
        }
        case 'Outfit': {
          parentElement.style.setProperty(
            '--global-font-body',
            '"Outfit Variable", Outfit, sans-serif'
          );
          break;
        }
      }

      return storyFn();
    },
  ],
};

export default preview;
