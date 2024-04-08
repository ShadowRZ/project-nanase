import type { Meta, StoryObj } from 'storybook-solidjs';
import CImageMessage from './ImageMessage';

const IMAGE_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNENjhCOEJGRiI+PC9yZWN0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjI2cHgiIGZpbGw9IiMzMzMzMzMiPjEwMHgxMDA8L3RleHQ+ICAgCjwvc3ZnPg==';

const meta: Meta<typeof CImageMessage> = {
  component: CImageMessage,
  tags: ['autodocs'],
  args: {
    read: false,
  },
  argTypes: {
    status: {
      control: 'radio',
      options: ['sending', 'sent'],
    },
  },
  render: (props) => (
    <CImageMessage {...props} width={100} height={100} src={IMAGE_URL} />
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageMessage: Story = {
  args: {
    timestamp: 1_700_000_000_000,
    status: 'sent',
  },
};

export const CustomImageMessage: Story = {
  args: {
    timestamp: 1_700_000_000_000,
    status: 'sent',
  },
  render: (props) => (
    // @ts-expect-error Types are unknown.
    <CImageMessage {...props}>
      <div class='p-2 bg-gray-500'>
        <p>This is an example of the ImageMessage with custom component.</p>
        <p>
          The gist is that it allows to use a custom component that handles
          encrypted files.
        </p>
      </div>
    </CImageMessage>
  ),
};
