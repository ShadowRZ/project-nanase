import { ParentComponent } from 'solid-js';
import ClientRoot from './ClientRoot';
import ClientLayout from './ClientLayout';
import Sidebar from '~/app/components/sidebar/Sidebar';

export const ClientRoute: ParentComponent = (props) => (
  <ClientRoot>
    <ClientLayout nav={<Sidebar />}>Hello</ClientLayout>
  </ClientRoot>
);
