import { cache } from '@solidjs/router';
import to from 'await-to-js';
import { createClient, type MatrixClient } from 'matrix-js-sdk';
import { errorForAutoDiscoveryAciton } from './login/utils';
import {
  autoDiscovery,
  type AutoDiscoveryInfo,
  type SpecVersions,
  specVersions,
} from '~/app/cs-api';
import { getAuthFlows } from '~/app/utils/auth-flows';
import { type AuthFlows } from '~/app/hooks/useAuthFlows';

export type ServerMeta = {
  baseUrl: string;
  wellKnown: AutoDiscoveryInfo;
  authFlows: AuthFlows;
  versions: SpecVersions;
  mx: MatrixClient;
};

export const getServerMeta = cache(
  async (server: string): Promise<ServerMeta> => {
    const [err, wellKnown] = await autoDiscovery(fetch, server);
    if (err) {
      throw errorForAutoDiscoveryAciton(err.action, err.host);
    }

    {
      const baseUrl = wellKnown['m.homeserver'].base_url;
      const [err, versions] = await to(specVersions(fetch, baseUrl));
      if (err)
        throw new Error(
          'Failed to connect. Either homeserver is unavailable at this moment or does not exist.'
        );
      const mx = createClient({ baseUrl });
      const authFlows = await getAuthFlows(mx);
      return {
        baseUrl,
        wellKnown,
        authFlows,
        versions,
        mx,
      };
    }
  },
  'getServerMeta'
);
