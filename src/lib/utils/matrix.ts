import {
  type RoomMember,
  type IIdentityProvider,
  type ILoginFlowsResponse,
  type Room,
  type SSOFlow,
} from 'matrix-js-sdk';
import type ClientDiscovery from '~/types/discovery';

export function getRoomAvatarUrl(room?: Room): string | undefined {
  if (room !== undefined) {
    const homeserver = room.client.getHomeserverUrl();
    return room.getAvatarUrl(homeserver, 48, 48, 'crop') ?? undefined;
  }

  return undefined;
}

export function getRoomMemberAvatarUrl(
  room?: Room,
  member?: RoomMember
): string | undefined {
  if (room === undefined) return;
  if (member === undefined) return;
  const homeserver = room.client.getHomeserverUrl();
  return (
    member.getAvatarUrl(homeserver, 48, 48, 'crop', undefined, false) ??
    undefined
  );
}

export function trimReplyFallback(body?: string): string | undefined {
  if (body === undefined) return undefined;
  const match = /^> <.+?> .+\n(>.*\n)*?\n/m.exec(body);
  if (match === null) return body;
  return body.slice(match[0].length);
}

const WELL_KNOWN_URI = '/.well-known/matrix/client';

export async function getHomeserverUrl(servername: string): Promise<string> {
  let protocol = 'https://';
  if (/^https?:\/\//.exec(servername) !== null) protocol = '';
  const serverDiscoveryUrl = `${protocol}${servername}${WELL_KNOWN_URI}`;
  try {
    const resp = await fetch(serverDiscoveryUrl, { method: 'GET' });
    const result = (await resp.json()) as ClientDiscovery;

    const baseUrl = result?.['m.homeserver']?.base_url as string | undefined;
    if (baseUrl === undefined)
      throw new Error('Your homeserver has an invaild config');
    return baseUrl;
  } catch {
    return `${protocol}${servername}`;
  }
}

export function findSSOFlows(
  flows: ILoginFlowsResponse | undefined
): IIdentityProvider[] | undefined {
  if (flows === undefined) return undefined;
  const flow = flows.flows.find(
    (value) => value.type === 'm.login.sso' || 'm.login.cas'
  );
  if (flow === undefined) return undefined;

  const idps = (flow as SSOFlow).identity_providers;
  return idps;
}
