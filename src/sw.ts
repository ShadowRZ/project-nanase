/// <reference lib="WebWorker" />

declare let self: ServiceWorkerGlobalScope;

import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';

import * as sm from './lib/session-idb';

void self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

registerRoute(
  ({ request }) => {
    const { url } = request;
    return (
      url.includes('/_matrix/client/v1/media/download') ||
      url.includes('/_matrix/client/v1/media/thumbnail')
    );
  },
  async ({ url }) => {
    const hash = url.hash.slice(1);
    const params = new URLSearchParams(hash);
    const userId = params.get('user_id');

    try {
      console.log(`[SW/Fetch] Fetching ${url}`);
      const session = userId ? await sm.get(userId) : undefined;
      const params: RequestInit = {
        cache: 'default',
      };
      if (session)
        params.headers = {
          Authorization: `Bearer ${session.accessToken}`,
        };
      return await fetch(url, params);
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
