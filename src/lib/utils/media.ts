import { type MatrixClient } from 'matrix-js-sdk';

export function getMediaPromise(
  client: MatrixClient,
  url?: string
): (() => Promise<string>) | undefined {
  if (url === undefined) return undefined;

  return async () => {
    // TODO: Implment MSC3916
    // const res = await fetch(url, {
    //   headers: {
    //     Authorization: `Bearer ${client.getAccessToken()}`,
    //   },
    // });
    const res = await fetch(url);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };
}
