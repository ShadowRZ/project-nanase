import 'uno.css';
import '../src/index.css';
import { withThemeByClassName } from '@storybook/addon-themes';

// @ts-expect-error Internally used by Storybook
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
