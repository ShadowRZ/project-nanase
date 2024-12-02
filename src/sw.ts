/// <reference lib="WebWorker" />

declare let self: ServiceWorkerGlobalScope;

import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';

void self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(
  ({ request }) => {
    const { url } = request;
    return (
      url.includes('/_matrix/media/v3/download') ||
      url.includes('/_matrix/media/v3/thumbnail')
    );
  },
  async ({ request }) => {
    const { url } = request;

    try {
      console.log(`[SW/Fetch] Fetching ${url}`);
      return await fetch(url);
    } catch (error) {
      return new Response(
        JSON.stringify({
          errcode: 'M_UNKNOWN',
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          error: `Unexpected error occoured when fetching this request: ${error}`,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
);

registerRoute(
  new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist })
);
