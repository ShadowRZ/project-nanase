import { useParams } from '@solidjs/router';
import {
  createContext,
  createResource,
  Show,
  useContext,
  type ParentComponent,
} from 'solid-js';
import { getServerMeta, type ServerMeta } from './getServerMeta';

const ServerMetaContext = createContext<ServerMeta>();

const WithServerMeta: ParentComponent = (props) => {
  const params = useParams();
  const server = () => params.server;

  const [serverMeta] = createResource(server, async ($server) =>
    getServerMeta($server)
  );

  return (
    <Show when={serverMeta() !== undefined}>
      <ServerMetaContext.Provider value={serverMeta()}>
        {props.children}
      </ServerMetaContext.Provider>
    </Show>
  );
};

export default WithServerMeta;

export const useServerMeta = () => {
  const data = useContext(ServerMetaContext);
  if (!data) throw new Error('Server meta was not provided?');

  return data;
};
