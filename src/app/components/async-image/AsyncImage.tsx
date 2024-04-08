import { Button, Image } from '@kobalte/core';
import {
  ErrorBoundary,
  Show,
  createResource,
  splitProps,
  type Component,
} from 'solid-js';
import ArrowsClockwiseDuotone from '~icons/ph/arrows-clockwise-duotone';
import LoadingIndicator from '~icons/svg-spinners/90-ring-with-bg';

type AsyncImageProps = {
  src: () => Promise<string>;
  width?: number;
  height?: number;
};

const AsyncImage: Component<AsyncImageProps> = (props) => {
  const [image] = splitProps(props, ['width', 'height']);
  const [src, { refetch }] = createResource(props.src);

  return (
    <ErrorBoundary
      fallback={(_, reset) => (
        <div
          class='flex items-center justify-center'
          style={{ width: `${image.width}px`, height: `${image.height}px` }}
        >
          <Button.Root
            onClick={() => {
              console.log('Clicked');
              void refetch();
              reset();
            }}
            class='transition duration-150 inline-flex items-center gap-1 rounded-md px-2 py-1 border border-red bg-slate-200 text-black dark:text-white hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-900'
          >
            <ArrowsClockwiseDuotone />
            Reload
          </Button.Root>
        </div>
      )}
    >
      <Image.Root>
        <Image.Img {...image} src={src()} class='rounded-lg' />
        <Image.Fallback
          as='div'
          style={{ width: `${image.width}px`, height: `${image.height}px` }}
          class='flex items-center justify-center'
        >
          <Show when={src.loading}>
            <LoadingIndicator class='size-8' />
          </Show>
        </Image.Fallback>
      </Image.Root>
    </ErrorBoundary>
  );
};

export default AsyncImage;
