import { createResource } from 'solid-js';

export function createBlobUrl(source: () => string) {
  const [url, { refetch }] = createResource(source, async ($source) => {
    const res = await fetch($source);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  });

  return { url, refetch };
}
