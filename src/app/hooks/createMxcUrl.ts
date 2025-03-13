import { createAsync } from '@solidjs/router';
import { MatrixClient } from 'matrix-js-sdk';
import { type Accessor, onCleanup } from 'solid-js';

export const createMxcUrl = (
  mx: Accessor<MatrixClient>,
  mxcUrl: Accessor<string | undefined>
) => {
  const imgSrc = createAsync(async () => {
    const $mx = mx();
    const $mxcUrl = mxcUrl();
    if ($mxcUrl === undefined) return;
    const url = $mx.mxcUrlToHttp(
      $mxcUrl,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      false // TODO: Handle auth media
    );
    // TODO: Use a blob cache
    // eslint-disable-next-line no-constant-condition -- TODO: Handle auth media
    if (false) {
      if (!url) return;
      // @ts-expect-error: See TODO Above
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${$mx.getAccessToken()}`,
        },
      });
      return URL.createObjectURL(await resp.blob());
    } else {
      return url ?? undefined;
    }
  });

  onCleanup(() => {
    // TODO: Schedule release
  });

  return imgSrc;
};
