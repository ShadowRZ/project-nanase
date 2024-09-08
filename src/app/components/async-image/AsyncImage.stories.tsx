import type { Meta, StoryObj } from 'storybook-solidjs';
import AsyncImage from './AsyncImage';

const IMAGE_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNENjhCOEJGRiI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPjEwMHgxMDA8L3RleHQ+ICAgCjwvc3ZnPg==';

const meta: Meta<typeof AsyncImage> = {
  component: AsyncImage,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // eslint-disable-next-line @typescript-eslint/require-await
    src: async () => IMAGE_URL,
  },
};

export const Loading: Story = {
  args: {
    src: async () => new Promise(() => {}),
    width: 100,
    height: 100,
  },
};

export const Error: Story = {
  args: {
    src: async () =>
      // eslint-disable-next-line promise/param-names -- Don't care about the resolve
      new Promise((_, reject) => {
        setTimeout(() => {
          reject(new window.Error('This image just failed to load!'));
        }, 5000);
      }),
    width: 100,
    height: 100,
  },
};
